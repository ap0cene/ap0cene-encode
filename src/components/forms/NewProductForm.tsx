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
  const { pk1 } = useContext(GlobalStateContext)

  if (!pk1) {
    return (
      <Box pad="medium" background="status-error" round="small" direction="row" gap="medium" align="center">
        <Alert size="medium" />
        <Text>
          Chip public key not detected. This page has been reached through the wrong route. Please scan a new chip to
          start again.
        </Text>
      </Box>
    )
  }

  const initialValues = {
    ...newProductFormDefaults,
    chipPublicKey: pk1,
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
