import React from 'react'
import { Layer, Box, Text } from 'grommet'
import styled from 'styled-components'

const StyledLayer = styled(Layer)`
  background: rgba(0, 0, 0, 0.2);
`

const LoadingBox = styled(Box)`
  padding: 24px;
  text-align: center;
`

interface ModalProps {
  show: boolean
  text: string
}

function Modal({ show, text }: ModalProps): JSX.Element | null {
  if (!show) return null

  return (
    <StyledLayer modal full animation="fadeIn">
      <LoadingBox fill justify="center" align="center">
        <Box background="white" pad="medium" round="small">
          <Text size="xlarge" color="black" weight="bold">
            {text}
          </Text>
        </Box>
      </LoadingBox>
    </StyledLayer>
  )
}

export default Modal
