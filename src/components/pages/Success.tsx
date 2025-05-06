import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text, Card, CardBody, Button, Paragraph } from 'grommet'
import { Checkmark, Shield, Scan } from 'grommet-icons'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`

const IconContainer = styled(Box)`
  margin-bottom: 20px;
`

function SuccessPage() {
  const { hash } = useParams<{ hash: string }>()

  return (
    <Box pad="large" align="center">
      <Box animation={{ type: 'fadeIn', duration: 800 }} align="center" width="large" margin={{ bottom: 'large' }}>
        <IconContainer>
          <Box round="full" background="status-ok" pad="medium" align="center" justify="center">
            <Checkmark size="large" color="white" />
          </Box>
        </IconContainer>

        <Heading level="1" margin={{ vertical: 'small' }} textAlign="center" color="#374151">
          NFT Minted Successfully!
        </Heading>
        <Text size="medium" textAlign="center" color="#6B7280">
          Your transaction has been confirmed on the XRP Ledger
        </Text>
      </Box>

      <StyledCard width="large" background="white">
        <CardBody pad="large">
          <Box direction="row" gap="medium" margin={{ bottom: 'medium' }} align="center">
            <Shield size="large" color="brand" />
            <Heading level="3" margin="none" color="#374151">
              Authentication Ready
            </Heading>
          </Box>

          <Paragraph size="medium" fill margin={{ vertical: 'medium' }} color="#4B5563">
            Now that this chip has been bound to this product metadata, anyone who scans it will be able to authenticate
            their product as legitimate. Scan the chip with any NFC compatible device, such as a smartphone or a USB-C
            reader attached to a laptop or desktop device to initiate the authentication flow.
          </Paragraph>

          <Box
            background="light-2"
            pad="medium"
            round="small"
            margin={{ top: 'medium', bottom: 'medium' }}
            width="100%"
          >
            <Box direction="row" gap="medium" margin={{ bottom: 'small' }} align="center">
              <Scan size="medium" color="dark-3" />
              <Text weight="bold">What's Next?</Text>
            </Box>
            <Paragraph margin={{ vertical: 'xsmall' }} size="small" color="dark-3" style={{ maxWidth: 'none' }}>
              Scan another uninitialized ap0cene NFC chip to encode a new product.
            </Paragraph>
          </Box>
        </CardBody>
      </StyledCard>
    </Box>
  )
}

export default SuccessPage
