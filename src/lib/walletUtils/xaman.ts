import { XummPkce } from 'xumm-oauth2-pkce'
import { XummTypes } from 'xumm-sdk'

type XummJsonTransaction = XummTypes.XummJsonTransaction

const XUMM_APP_ID = '7358d19a-4a8e-4594-bb71-44132cab3ddc' // same value as "API Key"
const xumm = new XummPkce(XUMM_APP_ID, { implicit: true }) // implicit = pick up existing session

export const connectToXumm = async () => {
  return xumm.authorize()
}

export const signTransactionUsingXummWallet = async (txJSON: Record<string, any>): Promise<{ hash: string }> => {
  // make sure we have an authenticated SDK instance first
  const connectResult = await connectToXumm()
  const sdk = connectResult?.sdk

  if (!sdk) {
    throw new Error('No SDK instance found')
  }

  // Create the sign request AND subscribe to events in one go
  const { created, resolved } = await sdk.payload.createAndSubscribe(
    {
      txjson: txJSON as XummJsonTransaction, // Assert that txJSON is a valid transaction object
      options: {
        submit: true, // auto-submit after signing
        expire: 300, // 5 min
        return_url: { web: window.location.origin },
      },
      custom_meta: { instruction: 'Please sign the transaction' },
    },
    (ev) => {
      // handle streaming events (optional, keeps UI in sync)
      if ('opened' in ev.data) console.log('User opened the sign request')
      if ('signed' in ev.data) {
        if (ev.data.signed) {
          // returning anything ≈ resolve the websocket & stop listening
          return { hash: ev.data.txid }
        }
        throw new Error('Transaction rejected by user in Xumm.')
      }
      if ('expires_in_seconds' in ev.data && ev.data.expires_in_seconds <= 0) {
        throw new Error('Xumm signing request expired.')
      }
      return false // keep listening
    },
  )

  // Show the QR / deep-link (opens Xumm on desktop & mobile)
  window.open(created.next.always, '_blank')

  // Wait until the callback above resolves or throws
  // `resolved` carries whatever the callback returned
  return resolved as Promise<{ hash: string }>
}

export const handleLogOutOfXumm = async () => {
  await xumm.logout()
}
