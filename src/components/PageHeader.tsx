import { Box, Header, Text, Menu, Image } from 'grommet'
import React, { useContext } from 'react'
import { Diamond } from 'grommet-icons'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { GlobalStateContext } from '../state/GlobalStateContext'
import { handleLogout } from '../lib/walletUtils'
import xamanIcon from './home/xaman.png'
import crossmarkIcon from './home/crossmark.png'

const LeftHeaderBox = styled(Box)`
  align-items: center;
`

const HeaderText = styled(Text)`
  cursor: pointer;
`

const RightHeaderBox = styled(Box)`
  align-items: center;
`

const WalletInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

const WalletIcon = styled(Image)`
  width: 24px;
  height: 24px;
`

function PageHeader() {
  const navigate = useNavigate()
  const { address, walletType, authorities, clearState } = useContext(GlobalStateContext)

  const handleLogoutClick = async () => {
    // Handle the appropriate logout based on wallet type
    await handleLogout(walletType)

    // Clear the global state (including localStorage via clearState)
    clearState()

    // Navigate to the landing page
    navigate('/')
  }

  // Get the user's name from authorities if they are logged in
  const userName = address && authorities[address] ? authorities[address] : ''

  // Get the appropriate wallet icon based on wallet type
  const getWalletIcon = () => {
    switch (walletType) {
      case 'xaman':
        return <WalletIcon src={xamanIcon} alt="Xaman Wallet" />
      case 'crossmark':
        return <WalletIcon src={crossmarkIcon} alt="Crossmark Wallet" />
      case 'gemwallet':
        return <Diamond size="medium" />
      default:
        return null
    }
  }

  return (
    <Header border="bottom" pad="medium" justify="between">
      <LeftHeaderBox direction="row" alignContent="center">
        <HeaderText size="xlarge" textAlign="center" onClick={() => navigate('/')}>
          Ap0cene XRPL phygital NFT
        </HeaderText>
      </LeftHeaderBox>

      {/* Right side with user info and logout */}
      {address ? (
        <RightHeaderBox>
          <Menu
            dropAlign={{ top: 'bottom', right: 'right' }}
            label={
              <WalletInfo direction="row">
                {getWalletIcon()}
                <Text>{userName}</Text>
              </WalletInfo>
            }
            items={[
              {
                label: 'Logout',
                onClick: handleLogoutClick,
              },
            ]}
          />
        </RightHeaderBox>
      ) : (
        // Empty box to maintain layout when not logged in
        <Box />
      )}
    </Header>
  )
}

export default PageHeader
