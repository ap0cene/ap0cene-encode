import React, { useContext, useEffect } from 'react'
import { Box, Heading, Text, Button } from 'grommet'
// import { execHaloCmdWeb } from '@arx-research/libhalo/api/web'
// import publicKeyToAddress from 'ethereum-public-key-to-address'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { mintToken } from '../../lib/nftUtils'
import AutoForm from '../autoform/AutoForm'
import { productFormSchema } from './constants'
import { IPFS_GATEWAY_PREFIX } from '../../constants'
import { GlobalStateContext } from '../../state/GlobalStateContext'
import Modal from '../utility/Modal'
import ErrorBanner from '../utility/ErrorBanner'
import { ProductMetadata } from '../../types/productTypes'

const CodeBox = styled(Box)`
  white-space: pre;
  overflow-x: scroll;
`

function NewNFTForm() {
  const params = useParams()
  const { walletType } = useContext(GlobalStateContext)
  const { ipfsHash } = params as { ipfsHash: string }
  const navigate = useNavigate()
  const [metadata, setMetadata] = React.useState<ProductMetadata>()
  const [tx, setTx] = React.useState<any>()
  const [minting, setMinting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // here we use useEffect to fetch the metadata from IPFS
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${IPFS_GATEWAY_PREFIX}${ipfsHash}`)
        setMetadata(response.data)
      } catch (err) {
        setError('Failed to load metadata from IPFS')
      }
    }
    fetchMetadata()
  }, [ipfsHash])

  // Redirect on successful mint
  useEffect(() => {
    if (tx && tx.hash) {
      navigate(`/success/${tx.hash}`)
    }
  }, [tx, navigate])

  if (!metadata) {
    return <Box>Loading metadata...</Box>
  }

  async function mintXRPLNFT() {
    setMinting(true)
    setError(null)
    // Ensure metadata is defined before proceeding
    if (!metadata) {
      setError('Metadata not loaded yet.')
      setMinting(false)
      return
    }
    try {
      const txResult: any = await mintToken(ipfsHash, metadata.chipPublicKey, walletType)
      setTx(txResult)
    } catch (err: any) {
      // Handle user rejection
      if (err.message?.includes('User rejected')) {
        setError('Transaction was cancelled by user')
      } else if (err.message?.includes('not installed')) {
        setError('Wallet is not installed or not accessible')
      } else {
        setError(err.message || 'Failed to mint NFT. Please try again.')
      }
    } finally {
      setMinting(false)
    }
  }

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
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <Button
        margin={{ vertical: 'large' }}
        onClick={() => {
          mintXRPLNFT()
        }}
        label="Mint NFT on XRPL"
        disabled={minting}
      />
      <Modal show={minting} text="Minting NFT on XRPL, please confirm in your wallet" />
      {txBox}
    </Box>
  )
}

export default NewNFTForm
