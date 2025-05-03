import * as xrpl from 'xrpl'
import { signTransaction, getAccount } from '../../walletUtils'

function getNet() {
  return 'wss://xrplcluster.com' // Mainnet endpoint
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
    Flags: 8,
    TransferFee: 0,
    NFTokenTaxon: 0, // Required, but if you have no use for it, set to zero.
    Fee: '10', // Standard fee in drops for mainnet
    // Sequence: 0, // GemWallet will auto-fill this
    // LastLedgerSequence: 0, // GemWallet will auto-fill this
  }

  try {
    const result = await signTransaction(walletType, transactionJson)
    if (!result) {
      throw new Error('Transaction was cancelled by user')
    }
    // Wait for the transaction to be confirmed
    const tx = await client.request({
      command: 'tx',
      transaction: result.hash,
    })

    // Get the updated NFT list
    const nfts = await client.request({
      command: 'account_nfts',
      account,
    })

    client.disconnect()
    return {
      tx,
      nfts,
    }
  } catch (error) {
    client.disconnect()
    console.error('Error minting NFT:', error)
    throw error
  }
}
