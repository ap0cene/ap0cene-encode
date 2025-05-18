import React, { useContext, useEffect, useState } from 'react'
import { Box, Heading, Text, Paragraph, Anchor, Button, Image, Spinner } from 'grommet'
import { useNavigate, useLocation } from 'react-router-dom'
import { GoogleWallet, Diamond, CloudDownload } from 'grommet-icons'
import { isInstalled, getAddress } from '@gemwallet/api'
import styled from 'styled-components'
import { GlobalStateContext } from '../../state/GlobalStateContext'
import { ProductMetadata } from '../../types/productTypes'
import { XrplNft } from '../../types/xrplTypes'

import xamanIcon from '../../assets/xaman.png'
import crossmarkIcon from '../../assets/crossmark.png'

import { connectToXumm, handleLogOutOfXumm } from '../../lib/walletUtils/xaman'
import { connectToCrossmark } from '../../lib/walletUtils/crossmark'
import { lookupAuthenticatedNFT } from '../../lib/nftUtils'
import NftDisplay from '../NftDisplay'

// Define type for NFT data
type NFTLookupResult = {
  nft: XrplNft
  owner: string
  metadata: ProductMetadata
} | null

function WalletConnectBox() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setAddress, setWalletType, authorities } = useContext(GlobalStateContext)
  const handleGemLogin = async () => {
    setError('')
    const installed = await isInstalled()
    if (!installed) {
      setError('Please install Gem Wallet to continue')
    } else {
      const { result } = await getAddress()
      const address = result?.address
      if (!address) {
        setError('address not available from gem')
        return
      }
      if (!authorities[address]) {
        setError(
          `${result?.address} is not enrolled as an authority in our system. Please email phygital@ap0cene.com to be enrolled.`,
        )
        return
      }
      setAddress(address)
      setWalletType('gemwallet')
      navigate('/product')
    }
  }

  const handleXamanLogin = async () => {
    const response = (await connectToXumm()) as any
    const address = response.me.account
    if (!authorities[address]) {
      setError(
        `${address} is not enrolled as an authority in our system. Please email phygital@ap0cene.com to be enrolled.`,
      )
      await handleLogOutOfXumm()
      return
    }
    setAddress(address)
    setWalletType('xaman')
    navigate('/product')
  }

  const handleCrossmarkConnection = async () => {
    const address = (await connectToCrossmark()) as any
    if (!authorities[address]) {
      setError(
        `${address} is not enrolled as an authority in our system. Please email phygital@ap0cene.com to be enrolled.`,
      )
      return
    }
    setAddress(address)
    setWalletType('crossmark')
    navigate('/product')
  }

  return (
    <Box fill align="center" justify="center" pad="large" background="light-2" margin={{ vertical: 'medium' }}>
      <Box
        width="medium"
        pad="medium"
        border={{ color: 'brand', size: 'small' }}
        round="small"
        background="white"
        elevation="medium"
      >
        <Text margin={{ bottom: 'medium' }} size="large">
          Please connect a wallet to continue
        </Text>

        <Button onClick={handleGemLogin} icon={<Diamond />} label="Gem" margin={{ bottom: 'small' }} primary />
        <Button
          onClick={handleXamanLogin}
          icon={<Image src={xamanIcon} alt="Xanum" width="24px" style={{ borderRadius: '5px' }} />}
          label="Xaman"
          margin={{ bottom: 'small' }}
          primary
        />
        <Button
          onClick={handleCrossmarkConnection}
          icon={<Image src={crossmarkIcon} alt="Xanum" width="24px" style={{ borderRadius: '5px' }} />}
          label="Crossmark"
          margin={{ bottom: 'small' }}
          primary
        />

        {error && (
          <Box margin={{ top: 'medium' }} pad="small" background="status-critical" round="small" align="center">
            <Text color="white" textAlign="center">
              {error}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

function Home() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pk1Param = searchParams.get('pk1')
  const { setPk1, authorities } = useContext(GlobalStateContext)
  const [isLoadingNFT, setIsLoadingNFT] = useState(false)
  const [nftData, setNftData] = useState<NFTLookupResult>(null)

  // Save pk1 to global state when it's present in URL and lookup NFT
  useEffect(() => {
    if (pk1Param) {
      setPk1(pk1Param)
      const lookupNFT = async () => {
        setIsLoadingNFT(true)
        setNftData(null) // Reset previous data
        try {
          // Extract addresses from the authorities object
          const knownAccounts = Object.keys(authorities)
          const result = await lookupAuthenticatedNFT(pk1Param, knownAccounts)
          setNftData(result)
          // TODO: Handle case where NFT is found (result is not null)
          // Maybe redirect to a specific page or display NFT info?
          if (result) {
            console.log('Found existing NFT:', result)
            // Placeholder: Display found NFT info
          }
        } catch (error) {
          console.error('Error looking up NFT:', error)
          // Handle error state if needed
        } finally {
          setIsLoadingNFT(false)
        }
      }
      lookupNFT()
    } else {
      // Reset state if pk1Param is not present
      setIsLoadingNFT(false)
      setNftData(null)
    }
  }, [pk1Param, setPk1, authorities]) // Added authorities to dependency array

  const renderContent = () => {
    if (!pk1Param) {
      // No chip scanned
      return (
        <Box background="light-2" pad="large" round="small" margin={{ top: 'medium' }}>
          <Text size="large">
            This page should be opened by scanning an ap0cene NFC authentication chip. Before you can begin this
            process, you will need to have ap0cene Phygital NFT chips on hand to encode, if you have not acquired them
            yet, you can <Anchor href="https://apocene.co/store" target="_blank" label="Purchase Them Here" />.
          </Text>
        </Box>
      )
    }

    if (isLoadingNFT) {
      // Loading NFT data
      return (
        <Box align="center" pad="large">
          <Spinner size="medium" />
          <Text margin={{ top: 'small' }}>Looking up existing NFT for this chip...</Text>
        </Box>
      )
    }

    if (nftData) {
      // NFT found - Display info (Placeholder)
      // TODO: Implement actual display or navigation logic here
      return <NftDisplay nftData={nftData} />
    }

    // NFT not found, proceed with encoding flow
    return (
      <>
        <Text size="large" margin={{ bottom: 'medium' }}>
          New ap0cene NFC authentication chip detected. To proceed with encoding, please connect your wallet.
        </Text>
        <WalletConnectBox />
      </>
    )
  }

  return (
    <Box>
      <Heading level={3}>Ap0cene Phygital NFT Encoding</Heading>
      <Box>{renderContent()}</Box>
    </Box>
  )
}

export default Home
