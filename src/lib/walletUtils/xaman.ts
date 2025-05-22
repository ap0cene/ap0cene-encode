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

  const returnUrl = `${window.location.origin}/success/{txid}`

  // Create the sign request AND subscribe to events in one go
  const { created, resolved } = await sdk.payload.createAndSubscribe(
    {
      txjson: txJSON as XummJsonTransaction, // Assert that txJSON is a valid transaction object
      options: {
        submit: true, // auto-submit after signing
        expire: 300, // 5 min
        return_url: {
          app: returnUrl, // identical app + web  → only the opener redirects
          web: returnUrl,
        },
      },
      custom_meta: { instruction: 'Please sign the transaction' },
    },
    (eventDetails): { hash: string } | undefined => {
      console.log('eventDetails', eventDetails)
      // handle streaming events
      // `eventDetails.data` contains the event specific data
      if ('opened' in eventDetails.data) {
        console.log('User opened the sign request (QR shown or Xumm app opened)')
        // Do not return a value here, to keep listening for further events
        return undefined
      }

      if ('signed' in eventDetails.data) {
        if (eventDetails.data.signed) {
          // Transaction signed successfully
          console.log('Transaction signed, txid:', eventDetails.data.txid)
          // Returning the hash object will resolve the `resolved` promise with this value
          return { hash: eventDetails.data.txid }
        }
        // Transaction rejected by the user
        console.error('Transaction rejected by user in Xumm.')
        // Throwing an error will reject the `resolved` promise
        throw new Error('Transaction rejected by user in Xumm.')
      }

      if ('expires_in_seconds' in eventDetails.data && eventDetails.data.expires_in_seconds <= 0) {
        // Sign request expired
        console.error('Xumm signing request expired.')
        // Throwing an error will reject the `resolved` promise
        throw new Error('Xumm signing request expired.')
      }

      // For any other event type, or if no specific action taken, return undefined to keep listening.
      return undefined
    },
  )

  // Show the QR / deep-link (opens Xumm on desktop & mobile)
  window.location.assign(created.next.always)
  // window.location.assign(created.next.always)
  // The `resolved` promise will be of type `unknown` if not explicitly typed by the SDK based on the callback.
  // We expect `{ hash: string }` upon successful resolution.
  const result = (await resolved) as { hash: string }
  // Wait until the callback above resolves (with hash) or throws an error.
  return result // result is now cast to { hash: string }
}

export const handleLogOutOfXumm = async () => {
  try {
    await xumm.logout()
  } catch (error) {
    console.error('Error during Xumm logout:', error)
    // Potentially re-throw or handle more gracefully if needed,
    // but for now, we'll just log it to prevent an uncaught error.
  }
}
