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
  const res = await sdk.methods.signAndSubmitAndWait(txJSON)
  // According to Crossmark SDK examples, the hash is found at res.response.data.resp.result.hash
  const { data } = res.response

  if (data && data.resp && data.resp.result && typeof data.resp.result.hash === 'string') {
    return { hash: data.resp.result.hash }
  }

  console.error('Transaction hash not found in expected path (data.resp.result.hash) in Crossmark response:', data)
  throw new Error('Transaction hash not found in Crossmark response after signAndSubmitAndWait')
}
