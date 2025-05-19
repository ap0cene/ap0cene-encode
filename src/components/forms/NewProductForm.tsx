import React, { useContext } from 'react'
import { Box, Heading, Text } from 'grommet'
import { Alert } from 'grommet-icons'
import { useNavigate } from 'react-router-dom'
import AutoForm from '../autoform/AutoForm'
import { newProductFormDefaults, productFormSchema } from './constants'
import { uploadFileToIPFS } from '../../lib/pinata'
import { cleanObject } from '../autoform/utils'
import { GlobalStateContext } from '../../state/GlobalStateContext'

function NewProductForm() {
  const navigate = useNavigate()
  const { verifiedChipPublicKey } = useContext(GlobalStateContext)
  console.log('Verified chip public key:', verifiedChipPublicKey)
  if (!verifiedChipPublicKey) {
    return (
      <Box pad="medium" background="status-error" round="small" direction="row" gap="medium" align="center">
        <Alert size="medium" />
        <Text>Verified chip public key not found in application state. Please scan a chip first via the homepage.</Text>
      </Box>
    )
  }

  const initialValues = {
    ...newProductFormDefaults,
    chipPublicKey: verifiedChipPublicKey,
  }

  const onSubmit = async (values: any) => {
    const cleanedValues = cleanObject(values)
    const blob = new Blob([JSON.stringify(cleanedValues, null, 2)], { type: 'application/json' })
    const file = new File([blob], 'product.txt', { type: 'text/plain' })
    const ipfsHash = await uploadFileToIPFS(file)
    navigate(`/mint/${ipfsHash}`)
  }

  return (
    <Box>
      <Heading level={3}>Step 1: Collect NFT Metadata</Heading>
      <AutoForm readOnlyMode={false} initialValues={initialValues} formSchema={productFormSchema} onSubmit={onSubmit} />
    </Box>
  )
}

export default NewProductForm
