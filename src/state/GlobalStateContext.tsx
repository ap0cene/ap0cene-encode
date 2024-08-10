import React, { createContext, useState, ReactNode, FC, useMemo } from 'react'

// Define the types for your state
interface GlobalState {
  address: string
  authorities: {
    [key: string]: string
  }
  walletType: string
  setAddress: (address: string) => void
  setWalletType: (walletType: string) => void
}

const defaultState: GlobalState = {
  authorities: {},
  address: '',
  walletType: '',
  setAddress: () => {},
  setWalletType: () => {},
}

// Create the context with an initial value of `undefined`
// We'll provide this value in the provider.
export const GlobalStateContext = createContext<GlobalState>(defaultState)

// Define a type for the provider's props
interface GlobalStateProviderProps {
  children: ReactNode
}

const authorities = {
  rLF6fKrcs5DPF6mVVa8WzhsTAwLa4fwc8B: 'Ap0cene',
}

// Create a provider component with the correct type annotation
export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [address, setAddress] = useState<string>('')
  const [walletType, setWalletType] = useState<string>('')

  const stateValue = useMemo(
    () => ({ address, setAddress, walletType, setWalletType, authorities }),
    [address, setAddress, walletType, setWalletType, authorities],
  )

  return <GlobalStateContext.Provider value={stateValue}>{children}</GlobalStateContext.Provider>
}
