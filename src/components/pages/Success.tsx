import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Heading, Text } from 'grommet'

function SuccessPage() {
  const { hash } = useParams<{ hash: string }>()

  return (
    <Box pad="medium" align="center">
      <Heading level="2">NFT Minted Successfully!</Heading>
      <Text margin={{ top: 'medium' }}>Your transaction has been submitted to the XRP Ledger.</Text>
      <Text margin={{ top: 'small' }} weight="bold">
        Transaction Hash:
      </Text>
      <Text>{hash}</Text>
      {/* We can add more details or links here later */}
    </Box>
  )
}

export default SuccessPage
