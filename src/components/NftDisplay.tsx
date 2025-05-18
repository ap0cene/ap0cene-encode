import React, { useContext } from 'react'
import { Box, Heading, Text, Image, ResponsiveContext, Anchor, Grid, Card, CardHeader, CardBody } from 'grommet'
import { StatusGood, StatusCritical } from 'grommet-icons'
import _ from 'lodash'
import { XrplNft } from '../types/xrplTypes'
import { ProductMetadata } from '../types/productTypes'
import { GlobalStateContext } from '../state/GlobalStateContext'
import AutoForm from './autoform/AutoForm'
import { productFormSchema } from './forms/constants'

// Define type for NFT data based on Home.tsx
type NFTLookupResult = {
  nft: XrplNft
  owner: string
  metadata: ProductMetadata
} | null

interface NftDisplayProps {
  nftData: NonNullable<NFTLookupResult> // Ensuring nftData is not null here
}

// Helper function to find a field's display name from the schema
function getFieldName(fieldId: string): string {
  const field = productFormSchema.find((f) => f.id === fieldId)
  return field?.name || _.startCase(fieldId)
}

// Helper to get subtype information
function getSubtypeInfo(metadata: ProductMetadata): { name: string; value: string } | null {
  const productType = metadata.type
  if (!productType) return null

  // Iterate over productFormSchema to find the relevant subtype field
  // This relies on subtype fields in productFormSchema having a 'condition'
  // or a name pattern like "Sub-Type, [ProductType]"
  // For simplicity, we'll look for a field whose id matches typical patterns like `${productType.toLowerCase()}Subtype`
  // or check against `productTypesFormSchema` entries if that was imported and structured for this.

  // A more robust way if productTypesFormSchema is not directly used here:
  // We can find the schema definition for the specific subtype based on productType
  const subtypeFieldSchema = productFormSchema.find(
    (field) => field.name?.startsWith('Sub-Type,') && metadata[field.id as keyof ProductMetadata],
  )

  if (subtypeFieldSchema) {
    const subtypeValue = metadata[subtypeFieldSchema.id as keyof ProductMetadata]
    if (Array.isArray(subtypeValue)) {
      return { name: subtypeFieldSchema.name || 'Sub-Type', value: subtypeValue.join(', ') }
    }
    return { name: subtypeFieldSchema.name || 'Sub-Type', value: String(subtypeValue) }
  }
  // Fallback for simpler cases like metadata.bagsSubtype
  const simpleSubtypeKey = `${String(productType).toLowerCase()}Subtype` as keyof ProductMetadata
  if (metadata[simpleSubtypeKey]) {
    const value = metadata[simpleSubtypeKey]
    if (Array.isArray(value)) {
      return { name: _.startCase(`${productType} Sub-type`), value: value.join(', ') }
    }
    return { name: _.startCase(`${productType} Sub-type`), value: String(value) }
  }

  return null
}

function NftDisplay({ nftData }: NftDisplayProps) {
  const { nft, metadata } = nftData
  const size = React.useContext(ResponsiveContext)
  const { authorities } = useContext(GlobalStateContext)

  const isRowLayout = size === 'medium' || size === 'large' || size === 'xlarge' || size === 'xxlarge'

  const issuerAddress = nft.issuer
  const issuerName = authorities[issuerAddress] || issuerAddress
  const issuerExplorerUrl = `https://bithomp.com/explorer/${issuerAddress}`

  const mainImageSrc =
    metadata.images && metadata.images.length > 0 ? metadata.images[0] : 'https://via.placeholder.com/600'
  const thumbnailImages = metadata.images || []

  const subtypeInfo = getSubtypeInfo(metadata)

  return (
    <Box
      direction={isRowLayout ? 'row' : 'column'}
      gap="large"
      pad="medium"
      background="background-back"
      round="small"
      margin={{ vertical: 'medium' }}
    >
      <Box width={isRowLayout ? '45%' : '100%'} gap="small" align="center">
        <Box
          width="100%"
          background="light-2"
          round="xsmall"
          align="center"
          justify="center"
          style={{ aspectRatio: '1 / 1', maxWidth: '600px', position: 'relative', overflow: 'hidden' }}
        >
          <Image
            fit="contain"
            src={mainImageSrc}
            alt={metadata.title || 'NFT Image'}
            style={{ borderRadius: 'xsmall', maxWidth: '100%', maxHeight: '100%' }}
          />
          <Box
            background="brand"
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            round="small"
            style={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <Text color="white" size="small">
              Phygital NFT
            </Text>
          </Box>
        </Box>
        <Box direction="row" gap="small" wrap justify="center" style={{ marginTop: '10px' }}>
          {thumbnailImages.map((src, index) => (
            <Box key={`thumb-${index}`} border={{ color: 'border', size: 'small' }} round="xsmall" overflow="hidden">
              <Image
                src={src}
                alt={`thumbnail ${index + 1}`}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box flex gap="medium" width={isRowLayout ? '55%' : '100%'}>
        <Heading level={2} margin={{ top: 'none', bottom: 'small' }}>
          {metadata.title || 'Untitled Product'}
        </Heading>

        <Box direction="row" gap="small" wrap margin={{ bottom: 'medium' }}>
          {metadata.gender && metadata.gender.length > 0 && (
            <Box background="light-3" round="large" pad={{ horizontal: 'medium', vertical: 'small' }}>
              <Text size="small">{metadata.gender.join(', ')}</Text>
            </Box>
          )}
          {subtypeInfo && subtypeInfo.value && (
            <Box background="light-3" round="large" pad={{ horizontal: 'medium', vertical: 'small' }}>
              <Text size="small">{subtypeInfo.value}</Text>
            </Box>
          )}
          {metadata.color && (
            <Box background="light-3" round="large" pad={{ horizontal: 'medium', vertical: 'small' }}>
              <Text size="small">{String(metadata.color)}</Text>
            </Box>
          )}
          {metadata.itemWeight && (
            <Box background="light-3" round="large" pad={{ horizontal: 'medium', vertical: 'small' }}>
              <Text size="small">{`${metadata.itemWeight} kg`}</Text>
            </Box>
          )}
        </Box>

        {metadata.copy && (
          <Card width="100%" background="light-1" elevation="small" round="small" margin={{ bottom: 'medium' }}>
            <CardHeader pad="medium">
              <Heading level="4" margin="none">
                Product Description
              </Heading>
            </CardHeader>
            <CardBody pad={{ horizontal: 'medium', bottom: 'medium' }}>
              <Text>{metadata.copy}</Text>
            </CardBody>
          </Card>
        )}

        {/* Verification Card - NEW */}
        <Card width="100%" background="light-1" elevation="small" round="small" margin={{ bottom: 'medium' }}>
          <CardHeader pad="medium">
            <Heading level="4" margin="none">
              Verification
            </Heading>
          </CardHeader>
          <CardBody pad="medium" align="center">
            {/* Placeholder for actual verification logic - assuming 'isVerified' state later */}
            <Box direction="row" align="center" gap="small" margin={{ bottom: 'medium' }}>
              <StatusGood size="xlarge" color="status-ok" />
              <Text weight="bold" size="large">
                This item is authentic.
              </Text>
            </Box>

            <Box fill="horizontal">
              <Grid columns={{ count: 2, size: 'auto' }} gap="medium">
                <Box gap="xsmall">
                  <Text weight="bold">Issuer:</Text>
                  <Anchor href={issuerExplorerUrl} target="_blank" rel="noopener noreferrer">
                    <Text>{issuerName}</Text>
                  </Anchor>
                </Box>
                <Box gap="xsmall">
                  <Text weight="bold">NFT ID:</Text>
                  <Text size="small" truncate>
                    {nft.nft_id}
                  </Text>
                </Box>
                {metadata.chipPublicKey && (
                  <Box gap="xsmall">
                    <Text weight="bold">{getFieldName('chipPublicKey')}:</Text>
                    <Text size="small" truncate>
                      {String(metadata.chipPublicKey)}
                    </Text>
                  </Box>
                )}
              </Grid>
            </Box>
          </CardBody>
        </Card>

        <Card width="100%" background="light-1" elevation="small" round="small">
          <CardHeader pad="medium">
            <Heading level="4" margin="none">
              NFT Details
            </Heading>
          </CardHeader>
          <CardBody pad="medium">
            <Grid columns={{ count: 2, size: 'auto' }} gap="medium">
              {metadata.type && (
                <Box gap="xsmall">
                  <Text weight="bold">{getFieldName('type')}:</Text>
                  <Text>{String(metadata.type)}</Text>
                </Box>
              )}
              {subtypeInfo && subtypeInfo.value && (
                <Box gap="xsmall">
                  <Text weight="bold">{subtypeInfo.name}:</Text>
                  <Text>{subtypeInfo.value}</Text>
                </Box>
              )}
              {metadata.color && (
                <Box gap="xsmall">
                  <Text weight="bold">{getFieldName('color')}:</Text>
                  <Text>{String(metadata.color)}</Text>
                </Box>
              )}
              {!metadata.itemWeight &&
                productFormSchema.find((f) => f.id === 'itemWeight') &&
                metadata.itemWeight !== undefined && (
                  <Box gap="xsmall">
                    <Text weight="bold">{getFieldName('itemWeight')}:</Text>
                    <Text>{metadata.itemWeight} kg</Text>
                  </Box>
                )}
            </Grid>
          </CardBody>
        </Card>
      </Box>
    </Box>
  )
}

export default NftDisplay
