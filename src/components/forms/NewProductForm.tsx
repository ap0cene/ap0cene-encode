import React from 'react'
import { Box } from 'grommet'
import AutoForm from '../autoform/AutoForm'
import { newProductFormDefaults, productFormSchema } from './constants'

function NewProductForm() {
  const onSubmit = async (values: any) => {
    console.log(values)
    // UPLOAD TO NFT.STORAGE HERE
  }

  return (
    <Box>
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
