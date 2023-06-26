import * as xrpl from 'xrpl'
import { XRPL_DEVNET_SEED } from '../../constants'

function getNet() {
  return 'wss://s.devnet.rippletest.net:51233'
}

export async function mintToken(ipfsHash: string) {
  const net = getNet()
  console.log(xrpl)
  debugger
  const standbyWallet = xrpl.Wallet.fromSeed(XRPL_DEVNET_SEED)
  const client = new xrpl.Client(net)
  await client.connect()

  // Note that you must convert the token URL to a hexadecimal
  // value for this transaction.
  // ------------------------------------------------------------------------
  const transactionJson = {
    TransactionType: 'NFTokenMint',
    Account: standbyWallet.classicAddress,
    URI: xrpl.convertStringToHex(`ipfs://${ipfsHash}`),
    Flags: 8,
    TransferFee: 0,
    NFTokenTaxon: 0, // Required, but if you have no use for it, set to zero.
  }

  // ----------------------------------------------------- Submit signed blob
  // @ts-ignore
  const tx = await client.submitAndWait(transactionJson, { wallet: standbyWallet })
  const nfts = await client.request({
    command: 'account_nfts',
    account: standbyWallet.classicAddress,
  })

  client.disconnect()

  return {
    tx,
    nfts,
  }
}
