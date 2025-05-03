import React, { useContext, useEffect, useState } from 'react'
import { Box, Heading, Text, Paragraph, Anchor, Button, Image } from 'grommet'
import { useNavigate, useLocation } from 'react-router-dom'
import { GoogleWallet, Diamond, CloudDownload } from 'grommet-icons'
import { isInstalled, getAddress } from '@gemwallet/api'
import styled from 'styled-components'
import { GlobalStateContext } from '../../state/GlobalStateContext'

import xamanIcon from './xaman.png'
import crossmarkIcon from './crossmark.png'

import { connectToXumm, handleLogOutOfXumm } from '../../walletUtils/xaman'
import { connectToCrossmark } from '../../walletUtils/crossmark'

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

function HomePage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pk1Param = searchParams.get('pk1')
  const { setPk1 } = useContext(GlobalStateContext)

  // Save pk1 to global state when it's present in URL
  useEffect(() => {
    if (pk1Param) {
      setPk1(pk1Param)
    }
  }, [pk1Param, setPk1])

  return (
    <Box>
      <Heading level={3}>Ap0cene Phygital NFT Encoding</Heading>
      <Box>
        {pk1Param ? (
          <>
            <Text size="large" margin={{ bottom: 'medium' }}>
              New ap0cene NFC authentication chip detected. To proceed with encoding, please connect your wallet.
            </Text>
            <WalletConnectBox />
          </>
        ) : (
          <Box background="light-2" pad="large" round="small" margin={{ top: 'medium' }}>
            <Text size="large">
              This page should be opened by scanning an ap0cene NFC authentication chip. Before you can begin this
              process, you will need to have ap0cene Phygital NFT chips on hand to encode, if you have not acquired them
              yet, you can <Anchor href="https://apocene.co/store" target="_blank" label="Purchase Them Here" />.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default HomePage
