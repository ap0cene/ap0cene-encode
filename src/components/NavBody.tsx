import { Routes, Route } from 'react-router-dom'
import { Box } from 'grommet'
import styled from 'styled-components'
import React from 'react'
import NewProductForm from './forms/NewProductForm'
import NewNFTForm from './forms/NewNFTForm'

const BodyContainer = styled(Box)`
  align-items: center;
`

const BodyBox = styled(Box)`
  height: 100%;
  max-width: 1080px;
  width: 100%;
  //border: 1px solid black;
`

const Container = styled(Box)`
  position: relative;
  flex: 1;
`

function NavBody() {
  return (
    <BodyContainer>
      <BodyBox direction="row">
        <Container margin="large">
          <Routes>
            <Route path="/" element={<NewProductForm />} />
            <Route path="/mint/:ipfsHash" element={<NewNFTForm />} />
          </Routes>
        </Container>
      </BodyBox>
    </BodyContainer>
  )
}

export default NavBody
