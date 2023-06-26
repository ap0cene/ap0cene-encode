import React, { useEffect } from 'react'
import { Box, Heading, Text, Button } from 'grommet'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { mintToken } from './nftUtils'
import AutoForm from '../autoform/AutoForm'
import { productFormSchema } from './constants'

const CodeBox = styled(Box)`
  white-space: pre;
  overflow-x: scroll;
`

function NewNFTForm() {
  const params = useParams()
  const { ipfsHash } = params as { ipfsHash: string }
  const [metadata, setMetadata] = React.useState()
  const [nfts, setNfts] = React.useState()
  const [tx, setTx] = React.useState()
  const [minting, setMinting] = React.useState(false)

  // here we use useEffect to fetch the metadata from IPFS
  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`)
      setMetadata(response.data)
    }
    fetchMetadata()
  }, [ipfsHash])

  if (!metadata) {
    return <Box>Loading metadata...</Box>
  }

  async function mintXRPLNFT() {
    setMinting(true)
    const response: any = await mintToken(ipfsHash)
    setMinting(false)
    setTx(response.tx)
    setNfts(response.nfts)
  }

  const nftsBox = nfts && (
    <Box>
      <Text size="large">NFTs</Text>
      <CodeBox margin="medium" background="light-1">
        {JSON.stringify(nfts, null, 2)}
      </CodeBox>
    </Box>
  )

  const txBox = tx && (
    <Box>
      <Text size="large">Transaction</Text>
      <CodeBox margin="medium" background="light-1">
        {JSON.stringify(tx, null, 2)}
      </CodeBox>
    </Box>
  )

  return (
    <Box>
      <Heading level={3}>Step 2: Mint NFT on XRPL</Heading>
      <AutoForm readOnlyMode initialValues={metadata} formSchema={productFormSchema} />
      {/* <Text weight="bold">IPFS Hash {ipfsHash}</Text> */}
      <Button
        margin={{ vertical: 'large' }}
        onClick={() => {
          mintXRPLNFT()
        }}
        label="Mint NFT on XRPL"
        disabled={minting}
      />
      {minting && <Text>Minting NFT on XRPL...</Text>}
      {txBox}
      {nftsBox}
    </Box>
  )
}

export default NewNFTForm
