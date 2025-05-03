import React from 'react'
import { Box, Text, Button } from 'grommet'
import { Close } from 'grommet-icons'
import styled from 'styled-components'

const ErrorBox = styled(Box)`
  background-color: #ff4040;
  color: white;
`

interface ErrorBannerProps {
  message: string
  onClose: () => void
}

function ErrorBanner({ message, onClose }: ErrorBannerProps): JSX.Element {
  return (
    <ErrorBox
      direction="row"
      align="center"
      justify="between"
      pad="medium"
      round="small"
      margin={{ vertical: 'small' }}
    >
      <Text weight="bold">{message}</Text>
      <Button icon={<Close size="medium" />} onClick={onClose} plain hoverIndicator />
    </ErrorBox>
  )
}

export default ErrorBanner
