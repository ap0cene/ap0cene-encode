import * as xrpl from 'xrpl'
import axios from 'axios'

import { signTransaction, getAccount } from './walletUtils'
import { ProductMetadata } from '../types/productTypes'
import { IPFS_GATEWAY_PREFIX } from '../constants'
import { XrplNft } from '../types/xrplTypes'

function getNet() {
  return 'wss://s2.ripple.com' // Clio enabled public XRPL endpoint
}

export function pkToTaxon(pkHex: string): number {
  if (typeof pkHex !== 'string' || pkHex.length < 8 || /[^0-9a-f]/i.test(pkHex)) {
    throw new Error('pkToTaxon expects a hex string ≥ 8 chars')
  }

  // Grab the last 8 hex chars → parse as base-16
  // eslint-disable-next-line no-bitwise
  return parseInt(pkHex.slice(1, 9), 16) >>> 0 // ">>> 0" forces Uint32
}

export async function mintToken(ipfsHash: string, chipPublicKey: string, walletType: string) {
  const net = getNet()
  // const standbyWallet = xrpl.Wallet.fromSeed(XRPL_DEVNET_SEED)
  const client = new xrpl.Client(net)
  await client.connect()
  const account = await getAccount(walletType)

  if (!account) {
    throw new Error('No account found. Please connect your wallet first.')
  }

  // Note that you must convert the token URL to a hexadecimal
  // value for this transaction.
  // ------------------------------------------------------------------------
  const tokenUri = `ipfs://${ipfsHash}:${chipPublicKey}`
  const transactionJson = {
    TransactionType: 'NFTokenMint',
    Account: account,
    URI: Buffer.from(tokenUri, 'utf8').toString('hex'),
    Flags: 0x0000, // 0x0000 (tfTransferable)
    TransferFee: 0,
    NFTokenTaxon: pkToTaxon(chipPublicKey),
    Fee: '10', // standard fee in drops
    Memos: [
      {
        Memo: {
          MemoType: Buffer.from('text/plain', 'utf8').toString('hex'),
          MemoData: Buffer.from('AP0CENE-AUTH', 'utf8').toString('hex'),
        },
      },
    ],
  }

  let result
  try {
    result = await signTransaction(walletType, transactionJson)
    debugger
    if (!result) {
      throw new Error('Transaction was cancelled by user')
    }
  } catch (error) {
    client.disconnect()
    console.error('Error signing NFT transaction:', error)
    throw error
  }
  debugger
  let tx
  try {
    // Wait for the transaction to be confirmed
    tx = await client.request({
      command: 'tx',
      transaction: result.hash,
    })
  } catch (error) {
    client.disconnect()
    console.error('Error confirming NFT transaction:', error)
    throw error
  }
  debugger
  client.disconnect()
  return tx.result
}

/**
 * Fetches NFTs by taxon ID for a specific account
 * @param account The XRPL account address
 * @param taxon The NFT taxon ID
 * @returns Array of NFTs matching the taxon ID
 */
export async function fetchNFTByTaxon(account: string, taxon: number): Promise<any[]> {
  const client = new xrpl.Client(getNet())
  try {
    await client.connect()

    // Get all NFTs for the account - XRPL API doesn't have a direct filter by taxon parameter
    const response: any = await client.request({
      command: 'nfts_by_issuer',
      issuer: account,
      nft_taxon: taxon,
    })

    // Filter NFTs by taxon ID
    const [matchingNFT] = response?.result?.nfts || []

    return matchingNFT
  } catch (error) {
    console.error('Error fetching NFTs by taxon:', error)
    return []
  } finally {
    client.disconnect()
  }
}

/**
 * Extracts the IPFS hash and chip public key from an NFT's URI
 * @param nft The NFT object from XRPL
 * @returns Object containing IPFS hash and chip public key, or null if invalid
 */
export function extractNFTUriData(nft: any): { ipfsHash: string; chipPublicKey: string } | null {
  try {
    if (!nft.uri) {
      return null
    }
    // Convert hex URI to string
    const uri = Buffer.from(nft.uri, 'hex').toString('utf8')
    // Expected format: ipfs://{ipfsHash}:{chipPublicKey}
    const match = uri.match(/ipfs:\/\/([^:]+):(.+)/)
    if (!match) {
      return null
    }

    return {
      ipfsHash: match[1],
      chipPublicKey: match[2],
    }
  } catch (error) {
    console.error('Error extracting URI data from NFT:', error)
    return null
  }
}

/**
 * Verifies if an NFT belongs to a specific chip by checking its public key
 * @param nft The NFT object from XRPL
 * @param chipPublicKey The chip's public key to verify
 * @returns Boolean indicating if the NFT belongs to the chip
 */
export function verifyNFTChipMatch(nft: any, chipPublicKey: string): boolean {
  const uriData = extractNFTUriData(nft)
  if (!uriData) {
    return false
  }
  // Check if the chip public key in the URI matches the provided key
  return uriData.chipPublicKey === chipPublicKey
}

/**
 * Looks up an NFT across multiple accounts using the chip's public key
 * @param chipPublicKey The chip's public key
 * @param accounts Array of XRPL account addresses to search
 * @returns The matching NFT and its owner, or null if not found
 */
export async function findNFTByChipPublicKey(
  chipPublicKey: string,
  accounts: string[],
): Promise<{ nft: XrplNft; owner: string; ipfsHash: string } | null> {
  if (!chipPublicKey || accounts.length === 0) {
    return null
  }

  // Generate taxon ID from the chip's public key
  const taxon = pkToTaxon(chipPublicKey)

  // Fetch NFTs concurrently from all accounts for the given taxon
  const results = await Promise.all(
    accounts.map(async (account) => {
      try {
        const nft = await fetchNFTByTaxon(account, taxon) // Returns XrplNft | null
        return { account, nft } // Return an object containing both account and result
      } catch (error) {
        console.error(`Error fetching NFT for account ${account} and taxon ${taxon}:`, error)
        return { account, nft: null } // Return null on error for this specific account
      }
    }),
  )

  let returnValue
  // Iterate through the results after all promises have resolved
  results.forEach((result) => {
    const { account, nft } = result

    // If an NFT was found for this account
    if (nft) {
      // Verify the chip public key embedded in the URI
      if (verifyNFTChipMatch(nft, chipPublicKey)) {
        const uriData = extractNFTUriData(nft)
        if (uriData) {
          // Found the correct NFT
          returnValue = {
            nft,
            owner: account,
            ipfsHash: uriData.ipfsHash,
          }
        }
      }
      // If verifyNFTChipMatch is false, log a warning and continue checking other results
      console.warn(`NFT found with taxon ${taxon} for account ${account}, but chipPublicKey mismatch in URI.`)
    }
  })

  return returnValue
}

/**
 * Fetches metadata from IPFS using the hash
 * @param ipfsHash The IPFS hash
 * @returns The metadata object
 */
export async function fetchMetadataFromIPFS(ipfsHash: string): Promise<ProductMetadata> {
  try {
    const url = `${IPFS_GATEWAY_PREFIX}${ipfsHash}`
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error)
    throw error
  }
}

/**
 * Main function to look up an NFT and its metadata based on a chip's public key
 * @param chipPublicKey The chip's public key
 * @param knownAccounts List of XRPL accounts to search
 * @returns Object containing the NFT, owner, and metadata if found
 */
export async function lookupAuthenticatedNFT(
  chipPublicKey: string,
  knownAccounts: string[],
): Promise<{
  nft: any
  owner: string
  metadata: ProductMetadata
} | null> {
  try {
    // Find the NFT
    const nftInfo = await findNFTByChipPublicKey(chipPublicKey, knownAccounts)
    if (!nftInfo) {
      return null
    }

    // Fetch the metadata
    const metadata = await fetchMetadataFromIPFS(nftInfo.ipfsHash)

    return {
      nft: nftInfo.nft,
      owner: nftInfo.owner,
      metadata,
    }
  } catch (error) {
    console.error('Error looking up authenticated NFT:', error)
    return null
  }
}
