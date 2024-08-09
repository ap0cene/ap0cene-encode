import React, { createContext, useState, ReactNode, FC, useMemo } from 'react'

// Define the types for your state
interface GlobalState {
  address: string
  walletType: string
  setAddress: (address: string) => void
  setWalletType: (walletType: string) => void
}

// Create the context with an initial value of `undefined`
// We'll provide this value in the provider.
export const GlobalStateContext = createContext<GlobalState | undefined>(undefined)

// Define a type for the provider's props
interface GlobalStateProviderProps {
  children: ReactNode
}

// Create a provider component with the correct type annotation
export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [address, setAddress] = useState<string>('')
  const [walletType, setWalletType] = useState<string>('')

  const stateValue = useMemo(
    () => ({ address, setAddress, walletType, setWalletType }),
    [address, setAddress, walletType, setWalletType],
  )

  return <GlobalStateContext.Provider value={stateValue}>{children}</GlobalStateContext.Provider>
}
