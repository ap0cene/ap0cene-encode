import sdk from '@crossmarkio/sdk'
import { connectToXumm, handleLogOutOfXumm, signTransactionUsingXummWallet } from './xaman'
import { connectToCrossmark, signTransactionUsingCrossmark } from './crossmark'
import { getAddressUsingGemWallet, submitTransactionUsingGemWallet } from './gem'

export const handleLogout = async (walletType: string) => {
  // Handle wallet-specific logout operations
  switch (walletType) {
    case 'xaman':
      await handleLogOutOfXumm()
      break
    case 'crossmark':
      // Crossmark doesn't have an explicit logout function in the SDK
      // State is cleared by the app itself
      try {
        // Try to disconnect by calling other methods if available
        console.log('Disconnecting from Crossmark')
        // We don't do anything specific here since Crossmark doesn't have a signOut method
      } catch (error) {
        console.error('Error with Crossmark:', error)
      }
      break
    case 'gemwallet':
      // GemWallet doesn't have an explicit logout function
      // State is cleared by the app itself
      break
    default:
      // No specific logout action for unknown wallet types
      break
  }

  // Return true to indicate logout was attempted
  return true
}

/**
 * Gets the wallet address based on the wallet type
 * @param walletType The type of wallet ('xaman', 'crossmark', or 'gemwallet')
 * @returns The wallet address as a string or null if unavailable
 */
export const getAccount = async (walletType: string): Promise<string | null> => {
  try {
    let xamanResponse: any
    let address: string | undefined
    let result: any

    switch (walletType) {
      case 'xaman':
        xamanResponse = await connectToXumm()
        if (xamanResponse && 'me' in xamanResponse && xamanResponse.me?.account) {
          return xamanResponse.me.account
        }
        return null

      case 'crossmark':
        // Try to get the address from SDK if user is already logged in
        address = sdk.methods.getAddress()
        if (!address) {
          // If not logged in, connect first
          address = await connectToCrossmark()
        }
        return address || null

      case 'gemwallet':
        address = await getAddressUsingGemWallet()
        return address || null

      default:
        console.error(`Unsupported wallet type: ${walletType}`)
        return null
    }
  } catch (error) {
    console.error(`Error getting account for wallet type ${walletType}:`, error)
    return null
  }
}

/**
 * Signs a transaction using the specified wallet type
 * @param walletType The type of wallet ('xaman', 'crossmark', or 'gemwallet')
 * @param transaction The transaction to sign
 * @returns The signed transaction result
 */
export const signTransaction = async (walletType: string, transaction: any) => {
  try {
    switch (walletType) {
      case 'xaman':
        return await signTransactionUsingXummWallet(transaction)

      case 'crossmark':
        return await signTransactionUsingCrossmark(transaction)

      case 'gemwallet':
        return await submitTransactionUsingGemWallet(transaction)

      default:
        throw new Error(`Unsupported wallet type: ${walletType}`)
    }
  } catch (error) {
    console.error(`Error signing transaction with ${walletType}:`, error)
    throw error
  }
}
