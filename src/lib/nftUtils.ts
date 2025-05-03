import * as xrpl from 'xrpl'
import { signTransaction, getAccount } from './walletUtils'
import { ProductMetadata } from '../types/productTypes'

function getNet() {
  return 'wss://xrplcluster.com' // Mainnet endpoint
}

export function pkToTaxon(pkHex: string): number {
  if (typeof pkHex !== 'string' || pkHex.length < 8 || /[^0-9a-f]/i.test(pkHex)) {
    throw new Error('pkToTaxon expects a hex string ≥ 8 chars')
  }

  // Grab the last 8 hex chars → parse as base-16
  // eslint-disable-next-line no-bitwise
  return parseInt(pkHex.slice(-8), 16) >>> 0 // ">>> 0" forces Uint32
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
    if (!result) {
      throw new Error('Transaction was cancelled by user')
    }
  } catch (error) {
    client.disconnect()
    console.error('Error signing NFT transaction:', error)
    throw error
  }

  console.log('result', result)
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
  // return tx.hash

  // let nfts
  // try {
  //   // Get the updated NFT list
  //   nfts = await client.request({
  //     command: 'account_nfts',
  //     account,
  //   })
  // } catch (error) {
  //   client.disconnect()
  //   console.error('Error fetching NFTs after minting:', error)
  //   throw error
  // }

  client.disconnect()
  return tx.hash
}
