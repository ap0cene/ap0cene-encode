// add imports from crossmark & xrpl library
import sdk from '@crossmarkio/sdk'
import { convertStringToHex } from 'xrpl'

// handles connection to crossmark
export const connectToCrossmark = async () => {
  const res = await sdk.methods.signInAndWait()
  if (res.response.data) {
    console.log(res.response.data)
    return res.response.data.address
  }
}

// handles signing a transaction using crossmark
// after — generic signer for any XRPL tx
export const signTransactionUsingCrossmark = async (txJSON: Record<string, any>) => {
  // txJSON should already have URI hex‑encoded, flags, etc.
  const res = await sdk.methods.signAndWait(txJSON)
  return res.response.data.txBlob
}
