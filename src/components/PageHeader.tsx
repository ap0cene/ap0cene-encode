import { Box, Header, Text } from 'grommet'
import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const LeftHeaderBox = styled(Box)`
  align-items: center;
`

const HeaderText = styled(Text)`
  cursor: pointer;
`

function PageHeader() {
  const navigate = useNavigate()
  return (
    <Header border="bottom" pad="medium">
      <LeftHeaderBox direction="row" alignContent="center">
        <HeaderText size="xlarge" textAlign="center" onClick={() => navigate('/')}>
          Ap0cene XRPL phygital NFT
        </HeaderText>
      </LeftHeaderBox>
    </Header>
  )
}

export default PageHeader
