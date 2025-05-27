import React, { useContext, useMemo, useState } from 'react'
import { Box, Heading, Text, Image, ResponsiveContext, Anchor, Grid, Card, CardHeader, CardBody } from 'grommet'
import { StatusGood, StatusCritical, StatusUnknown, StatusWarning, StatusInfo } from 'grommet-icons'
import _ from 'lodash'
import { XrplNft } from '../../types/xrplTypes'
import { ProductMetadata } from '../../types/productTypes'
import { GlobalStateContext } from '../../state/GlobalStateContext'
import { productFormSchema } from '../forms/constants'
import { verifyHaloChipSignature, HaloQueryParams } from '../../lib/haloVerification'

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

interface VerificationSuccess {
  type: 'verified'
  chipPublicKeyFromScan: string // pk2 from chip, via URL
  scanCounter: number
  matchesMetadata: boolean // Does pk2 from URL match metadata.chipPublicKey?
}

interface VerificationFailure {
  type: 'failed'
  message: string
}

interface VerificationNotAttempted {
  type: 'not_attempted' // e.g. missing params or metadata key
  message: string
}

type VerificationOutcome = VerificationSuccess | VerificationFailure | VerificationNotAttempted

function NftDisplay({ nftData }: NftDisplayProps) {
  const { nft, metadata } = nftData
  const size = React.useContext(ResponsiveContext)
  const { authorities } = useContext(GlobalStateContext)

  const initialMainImageSrc =
    metadata.images && metadata.images.length > 0 ? metadata.images[0] : 'https://via.placeholder.com/600'
  const [currentMainImageSrc, setCurrentMainImageSrc] = useState(initialMainImageSrc)

  const verificationOutcome = useMemo((): VerificationOutcome => {
    if (typeof window === 'undefined') {
      return { type: 'not_attempted', message: 'Verification environment not available.' }
    }
    const queryParams = new URLSearchParams(window.location.search)
    const haloParams: HaloQueryParams = {
      pk2: queryParams.get('pk2') || undefined,
      rnd: queryParams.get('rnd') || undefined,
      rndsig: queryParams.get('rndsig') || undefined,
    }

    if (!haloParams.pk2 || !haloParams.rnd || !haloParams.rndsig) {
      return { type: 'not_attempted', message: 'NFC chip data (pk2, rnd, rndsig) not found in URL parameters.' }
    }

    if (!metadata.chipPublicKey) {
      return { type: 'not_attempted', message: 'Chip public key not found in product metadata for comparison.' }
    }

    try {
      // We still call this to get the scanCounter and to confirm signature validity for these specific params.
      // The primary chip verification (is this the *right* chip for this NFT?) happened before loading NftDisplay.
      const verificationResultFromParams = verifyHaloChipSignature(haloParams)

      // Ensure both keys are full keys starting with '04' and compare.
      // metadata.chipPublicKey should now always be the full key.
      // haloParams.pk2 is also expected to be the full key.
      const actualChipKeyFromScan = haloParams.pk2.toLowerCase() // pk2 from URL
      const expectedChipKeyFromMetadata = metadata.chipPublicKey.toLowerCase()

      // Defensive check: ensure metadata key starts with 04 if we expect it.
      // However, with the refactor, metadata.chipPublicKey should already be correct.
      if (!expectedChipKeyFromMetadata.startsWith('04')) {
        console.warn('metadata.chipPublicKey does not start with 04, comparison might be invalid')
        // Potentially return a specific error state or attempt to fix, but for now, log and proceed.
      }
      if (!actualChipKeyFromScan.startsWith('04')) {
        // This should not happen if pk2 is a valid uncompressed public key
        console.warn('pk2 from URL does not start with 04, comparison might be invalid')
      }

      const matchesMetadata = actualChipKeyFromScan === expectedChipKeyFromMetadata

      return {
        type: 'verified',
        chipPublicKeyFromScan: actualChipKeyFromScan, // from pk2 in URL
        scanCounter: verificationResultFromParams.scanCounter,
        matchesMetadata,
      }
    } catch (error: any) {
      // This error means rnd/rndsig didn't match pk2 from URL, so chip scan itself is invalid.
      return {
        type: 'failed',
        message: `Chip signature verification failed for URL parameters: ${error.message || 'Unknown error'}`,
      }
    }
  }, [metadata.chipPublicKey]) // Query params are implicitly dependencies via window.location

  const isRowLayout = size === 'medium' || size === 'large' || size === 'xlarge' || size === 'xxlarge'

  const issuerAddress = nft.issuer
  const issuerName = authorities[issuerAddress] || issuerAddress
  const issuerExplorerUrl = `https://bithomp.com/explorer/${issuerAddress}`

  const thumbnailImages = metadata.images || []

  const subtypeInfo = getSubtypeInfo(metadata)

  let verificationStatusIcon = <StatusUnknown size="xlarge" color="status-unknown" />
  let verificationStatusText = 'Verification Pending'
  let verificationStatusColor: string | undefined = 'status-unknown'
  let verificationDetailedMessage = ''

  if (verificationOutcome.type === 'verified') {
    if (verificationOutcome.matchesMetadata) {
      verificationStatusIcon = <StatusGood size="xlarge" color="status-ok" />
      verificationStatusText = 'Authentic'
      verificationStatusColor = 'status-ok'
      verificationDetailedMessage = `Chip signature verified. Scan count: ${verificationOutcome.scanCounter}. Matches expected product chip.`
    } else {
      verificationStatusIcon = <StatusWarning size="xlarge" color="status-warning" />
      verificationStatusText = 'Chip Mismatch'
      verificationStatusColor = 'status-warning'
      verificationDetailedMessage = `Chip signature verified, but the chip's public key (${verificationOutcome.chipPublicKeyFromScan.substring(
        0,
        12,
      )}...) does not match the expected product chip key. Scan count: ${verificationOutcome.scanCounter}.`
    }
  } else if (verificationOutcome.type === 'failed') {
    verificationStatusIcon = <StatusCritical size="xlarge" color="status-critical" />
    verificationStatusText = 'Verification Failed'
    verificationStatusColor = 'status-critical'
    verificationDetailedMessage = verificationOutcome.message
  } else if (verificationOutcome.type === 'not_attempted') {
    verificationStatusIcon = <StatusInfo size="xlarge" color="status-info" />
    verificationStatusText = 'Verification Not Performed'
    verificationStatusColor = 'status-info'
    verificationDetailedMessage = verificationOutcome.message
  }

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
            src={currentMainImageSrc}
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
            <Box
              key={`thumb-${index}`}
              border={{ color: 'border', size: 'small' }}
              round="xsmall"
              overflow="hidden"
              onClick={() => setCurrentMainImageSrc(src)}
              style={{ cursor: 'pointer' }}
            >
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

        <Card width="100%" background="light-1" elevation="small" round="small" margin={{ bottom: 'medium' }}>
          <CardHeader pad="medium">
            <Heading level="4" margin="none">
              Verification
            </Heading>
          </CardHeader>
          <CardBody pad="medium" align="center">
            <Box direction="row" align="center" gap="small" margin={{ bottom: 'medium' }}>
              {verificationStatusIcon}
              <Text weight="bold" size="large" color={verificationStatusColor}>
                {verificationStatusText}
              </Text>
            </Box>
            <Text size="small" textAlign="center" margin={{ bottom: 'medium' }}>
              {verificationDetailedMessage}
            </Text>

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
                    <Text weight="bold">Expected Chip Public Key (from IPFS):</Text>
                    <Text size="small" truncate title={metadata.chipPublicKey}>
                      {`${metadata.chipPublicKey.substring(0, 34)}...`}
                    </Text>
                  </Box>
                )}
                {verificationOutcome.type === 'verified' && (
                  <Box gap="xsmall">
                    <Text weight="bold">Scanned Chip Public Key (from URL):</Text>
                    <Text size="small" truncate title={verificationOutcome.chipPublicKeyFromScan}>
                      {`${verificationOutcome.chipPublicKeyFromScan.substring(0, 34)}...`}
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
              {metadata.itemWeight !== undefined && productFormSchema.find((f) => f.id === 'itemWeight') && (
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
