import React, { useContext, useEffect } from 'react'
import { Box, Heading, Text, Button } from 'grommet'
// import { execHaloCmdWeb } from '@arx-research/libhalo/api/web'
// import publicKeyToAddress from 'ethereum-public-key-to-address'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { mintToken } from './nftUtils'
import AutoForm from '../autoform/AutoForm'
import { productFormSchema } from './constants'
import { IPFS_GATEWAY_PREFIX } from '../../constants'
import { GlobalStateContext } from '../../state/GlobalStateContext'

const CodeBox = styled(Box)`
  white-space: pre;
  overflow-x: scroll;
`

const pk1 =
  '041C16E8876E67B49178B6E97509D33C02A5A555A39E8BCAE5EDFDC1862243BB4740D0B50105D288714EE1A55DC51CEDA975DF5853B756E277C503735ED2394D12'

function NewNFTForm() {
  const params = useParams()
  const { walletType } = useContext(GlobalStateContext)
  const { ipfsHash } = params as { ipfsHash: string }
  const [metadata, setMetadata] = React.useState()
  const [nfts, setNfts] = React.useState()
  const [tx, setTx] = React.useState()
  const [minting, setMinting] = React.useState(false)

  // here we use useEffect to fetch the metadata from IPFS
  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await axios.get(`${IPFS_GATEWAY_PREFIX}${ipfsHash}`)
      setMetadata(response.data)
    }
    fetchMetadata()
  }, [ipfsHash])

  if (!metadata) {
    return <Box>Loading metadata...</Box>
  }

  async function mintXRPLNFT() {
    setMinting(true)
    const response: any = await mintToken(ipfsHash, pk1, walletType)
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
