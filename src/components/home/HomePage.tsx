import React, { useContext, useEffect, useState } from 'react'
import { Box, Heading, Text, Paragraph, Anchor, Button, Image } from 'grommet'
import { useNavigate } from 'react-router-dom'
import { GoogleWallet, Diamond, CloudDownload } from 'grommet-icons'
import { isInstalled, getAddress } from '@gemwallet/api'
import styled from 'styled-components'
import { GlobalStateContext } from '../../state/GlobalStateContext'

import xamanIcon from './xaman.png'
import { connectToXumm, handleLogOutOfXumm } from '../../utils/xaman'

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
      setWalletType('gem')
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

  const handleWalletConnectLogin = () => {
    // Add logic to handle Wallet Connect login
    // Example: setError('Wallet Connect login failed');
    setError('Wallet Connect not yet implemented')
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
  return (
    <Box>
      <Heading level={3}>Ap0cene Phygital NFT Encoding</Heading>
      <Box>
        <Text size="large">
          {`Before you can begin this process, you will need to have ap0cene Phygital NFT chips on hand to encode, if you have
          not aquired them yet, you can`}{' '}
          <Anchor href="https://apocene.co/store" target="_blank" label="Purchase Them Here" />.
        </Text>

        <WalletConnectBox />
      </Box>
    </Box>
  )
}

export default HomePage
