import { isInstalled, getAddress, signTransaction } from '@gemwallet/api'

export const getAddressUsingGemWallet = async (): Promise<string | undefined> => {
  try {
    const {
      result: { isInstalled: isWalletInstalled },
    } = await isInstalled()

    if (!isWalletInstalled) {
      throw new Error('Gem Wallet is not installed')
    }

    const { result } = await getAddress()
    return result?.address
  } catch (error) {
    console.error('Error getting address from Gem wallet:', error)
    throw error
  }
}

export const signTransactionUsingGemWallet = async (transaction: any) => {
  try {
    const { result } = await signTransaction({ transaction })
    return result
  } catch (error) {
    console.error('Error signing transaction with Gem wallet:', error)
    throw error
  }
}
