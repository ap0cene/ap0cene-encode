import React, { createContext, useState, ReactNode, FC, useMemo, useEffect } from 'react'

// Define the types for your state
interface GlobalState {
  address: string
  authorities: {
    [key: string]: string
  }
  walletType: string
  verifiedChipPublicKey: string | null
  setAddress: (address: string) => void
  setWalletType: (walletType: string) => void
  setVerifiedChipPublicKey: (key: string | null) => void
  clearState: () => void
}

const defaultState: GlobalState = {
  authorities: {},
  address: '',
  walletType: '',
  verifiedChipPublicKey: null,
  setAddress: () => {},
  setWalletType: () => {},
  setVerifiedChipPublicKey: () => {},
  clearState: () => {},
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
  // Initialize state with values from localStorage or defaults
  const [address, setAddressState] = useState<string>(() => {
    const savedAddress = localStorage.getItem('address')
    return savedAddress || ''
  })

  const [walletType, setWalletTypeState] = useState<string>(() => {
    const savedWalletType = localStorage.getItem('walletType')
    return savedWalletType || ''
  })

  const [verifiedChipPublicKey, setVerifiedChipPublicKeyState] = useState<string | null>(null)

  // Custom setter that saves to localStorage
  const setAddress = (addr: string) => {
    setAddressState(addr)
    if (addr) {
      localStorage.setItem('address', addr)
    } else {
      localStorage.removeItem('address')
    }
  }

  // Custom setter that saves to localStorage
  const setWalletType = (type: string) => {
    setWalletTypeState(type)
    if (type) {
      localStorage.setItem('walletType', type)
    } else {
      localStorage.removeItem('walletType')
    }
  }

  // Setter for verifiedChipPublicKey (in-memory only)
  const setVerifiedChipPublicKey = (key: string | null) => {
    setVerifiedChipPublicKeyState(key)
  }

  // Function to clear all state
  const clearState = () => {
    setAddress('') // This also removes from localStorage
    setWalletType('') // This also removes from localStorage
  }

  // Effect to validate the saved wallet connection on app start
  useEffect(() => {
    // Only attempt to validate if both address and walletType exist
    const savedAddress = localStorage.getItem('address')
    const savedWalletType = localStorage.getItem('walletType')

    if (!savedAddress || !savedWalletType) {
      // If either is missing, clear both to avoid inconsistent state
      clearState()
    }
    // We don't actually verify the wallet here - that happens when the user interacts with wallet features
  }, [])

  const stateValue = useMemo(
    () => ({
      address,
      setAddress,
      walletType,
      setWalletType,
      verifiedChipPublicKey,
      setVerifiedChipPublicKey,
      clearState,
      authorities,
    }),
    [address, walletType, verifiedChipPublicKey, authorities],
  )

  return <GlobalStateContext.Provider value={stateValue}>{children}</GlobalStateContext.Provider>
}
