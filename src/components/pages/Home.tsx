import React, { useContext, useEffect, useState } from 'react'
import { Box, Heading, Text, Paragraph, Anchor, Button, Image, Spinner } from 'grommet'
import { useNavigate, useLocation } from 'react-router-dom'
import { GoogleWallet, Diamond, CloudDownload, StatusCritical } from 'grommet-icons'
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
import { verifyHaloChipSignature, HaloQueryParams } from '../../utils/haloVerification'

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
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)

  const pk2Param = searchParams.get('pk2')
  const rndParam = searchParams.get('rnd')
  const rndsigParam = searchParams.get('rndsig')

  const { authorities, setVerifiedChipPublicKey, verifiedChipPublicKey } = useContext(GlobalStateContext)
  const [isLoadingNFT, setIsLoadingNFT] = useState(false)
  const [nftData, setNftData] = useState<NFTLookupResult>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  useEffect(() => {
    if (pk2Param && rndParam && rndsigParam) {
      setVerificationError(null)
      const haloParams: HaloQueryParams = {
        pk2: pk2Param,
        rnd: rndParam,
        rndsig: rndsigParam,
      }
      try {
        const verificationResult = verifyHaloChipSignature(haloParams)
        const chipKey = verificationResult.publicKey2
        if (chipKey === pk2Param.toLowerCase()) {
          setVerifiedChipPublicKey(chipKey)
        } else {
          setVerificationError('Key from chip signature does not match key in URL.')
          setVerifiedChipPublicKey(null)
        }
      } catch (error) {
        console.error('Chip verification failed:', error)
        setVerificationError('Chip verification failed.')
        setVerifiedChipPublicKey(null)
      }
    }
  }, [pk2Param, rndParam, rndsigParam])

  useEffect(() => {
    if (verifiedChipPublicKey) {
      setIsLoadingNFT(true)
      setNftData(null)

      try {
        const lookupNFT = async () => {
          try {
            const knownAccounts = Object.keys(authorities)
            const result = await lookupAuthenticatedNFT(verifiedChipPublicKey, knownAccounts)
            setNftData(result)
            if (result) {
              console.log('Found existing NFT with verified chip key:', result)
            } else {
              console.log('No NFT found for verified chip key:', verifiedChipPublicKey)
            }
          } catch (error) {
            console.error('Error looking up NFT:', error)
            setVerificationError('Error looking up NFT after chip verification.')
          } finally {
            setIsLoadingNFT(false)
          }
        }
        lookupNFT()
      } catch (error: any) {
        console.log('Error looking up NFT:', error)
        setIsLoadingNFT(false)
        setNftData(null)
      }
    }
  }, [verifiedChipPublicKey, authorities])

  const renderContent = () => {
    console.log('isLoadingNFT', isLoadingNFT)
    if (isLoadingNFT) {
      return (
        <Box align="center" pad="large">
          <Spinner size="medium" />
          <Text margin={{ top: 'small' }}>Verifying chip and looking up NFT...</Text>
        </Box>
      )
    }

    if (verificationError) {
      return (
        <Box pad="medium" align="center">
          <StatusCritical color="status-critical" size="large" />
          <Text margin={{ top: 'medium' }} color="status-critical">
            {verificationError}
          </Text>
          <Text size="small" margin={{ top: 'small' }}>
            Please try scanning the chip again.
          </Text>
        </Box>
      )
    }

    if (nftData) {
      return <NftDisplay nftData={nftData} />
    }

    if (pk2Param && rndParam && rndsigParam && !verificationError && !isLoadingNFT && !nftData) {
      return (
        <>
          <Text size="large" margin={{ bottom: 'medium' }}>
            Verified chip. No existing NFT found. To create one, please connect your wallet.
          </Text>
          <WalletConnectBox />
        </>
      )
    }

    return (
      <Box background="light-2" pad="large" round="small" margin={{ top: 'medium' }}>
        <Text size="large">
          This page should be opened by scanning an ap0cene NFC authentication chip. Before you can begin this process,
          you will need to have ap0cene Phygital NFT chips on hand to encode, if you have not acquired them yet, you can{' '}
          <Anchor href="https://ap0cene.co/store" target="_blank" label="Purchase Them Here" />.
        </Text>
      </Box>
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
