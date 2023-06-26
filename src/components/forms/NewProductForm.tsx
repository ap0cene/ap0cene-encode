import React from 'react'
import { Box, Heading } from 'grommet'
import { useNavigate } from 'react-router-dom'
import AutoForm from '../autoform/AutoForm'
import { newProductFormDefaults, productFormSchema } from './constants'
import { nftStorageClient } from '../../lib/nftStorage'
import { cleanObject } from '../autoform/utils'

function NewProductForm() {
  const navigate = useNavigate()
  const onSubmit = async (values: any) => {
    const cleanedValues = cleanObject(values)
    const blob = new Blob([JSON.stringify(cleanedValues, null, 2)], { type: 'application/json' })
    const ipfsHash = await nftStorageClient.storeBlob(blob)
    navigate(`/mint/${ipfsHash}`)
  }

  return (
    <Box>
      <Heading level={3}>Step 1: Collect NFT Metadata</Heading>
      <AutoForm
        readOnlyMode={false}
        initialValues={newProductFormDefaults}
        formSchema={productFormSchema}
        onSubmit={onSubmit}
      />
    </Box>
  )
}

export default NewProductForm
