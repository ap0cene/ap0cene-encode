import { Box, Header, Text } from 'grommet'
import React from 'react'
import styled from 'styled-components'

const LeftHeaderBox = styled(Box)`
  align-items: center;
`

const HeaderText = styled(Text)`
  cursor: pointer;
`

function PageHeader() {
  return (
    <Header border="bottom" pad="medium">
      <LeftHeaderBox direction="row" alignContent="center">
        <HeaderText size="xlarge" textAlign="center">
          Ap0cene XRPL phygital NFT
        </HeaderText>
      </LeftHeaderBox>
    </Header>
  )
}

export default PageHeader
