// add imports for xumm and xrpl library
import { Xumm } from 'xumm'
import { convertStringToHex } from 'xrpl'

const XUMM_API_KEY = '7358d19a-4a8e-4594-bb71-44132cab3ddc'
const XUMM_API_SECRET = '521037db-7c56-4d8a-adb3-0885d5bde0e7'

const xumm = new Xumm(XUMM_API_KEY)

// handle connecting to Xumm wallet
export const connectToXumm = async () => {
  return xumm.authorize()
}

// handle submitting a transaction using Xumm
export const signTransactionUsingXummWallet = async (txJSON: Record<string, any>) => {
  const myHeaders = new Headers()
  myHeaders.append('X-API-Secret', XUMM_API_SECRET)
  myHeaders.append('X-API-Key', XUMM_API_KEY)
  myHeaders.append('Content-Type', 'application/json')

  // set up payload for xumm
  const raw = JSON.stringify({
    options: {
      submit: 'true',
      multisign: 'false',
      expire: 300,
      return_url: {
        web: 'http://localhost:3000',
      },
    },
    custom_meta: {
      instruction: 'Please sign the transaction',
    },
    txjson: txJSON,
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  }

  const response = await fetch('/api/v1/platform/payload', requestOptions)

  return response.json()
}

export const handleLogOutOfXumm = async () => {
  await xumm.logout()
}
