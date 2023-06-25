import styled from 'styled-components'
import { Box, ResponsiveContext, Text } from 'grommet'
import React from 'react'

export const ReadOnlyTitleText = styled(Text)`
  min-width: 200px;
  width: 200px;
  text-align: ${({ size }) => (size === 'xsmall' ? 'left' : 'right')};
  font-weight: bold;
  margin-right: 20px;
`

export function ReadOnlyTitle({ children }: any) {
  const size = React.useContext(ResponsiveContext)
  if (size === 'xsmall') {
    return <ReadOnlyTitleText size="xsmall">{children}</ReadOnlyTitleText>
  }
  return <ReadOnlyTitleText>{children}</ReadOnlyTitleText>
}

export const ReadOnlyBoxElement = styled(Box)`
  align-items: baseline;
  //flex-direction: row;
  margin-bottom: 8px;
  margin-top: 8px;
  width: 100%;
`

export function ReadOnlyBox({ children }: any) {
  const size = React.useContext(ResponsiveContext)
  if (size === 'xsmall') {
    return <ReadOnlyBoxElement direction="column">{children}</ReadOnlyBoxElement>
  }
  return <ReadOnlyBoxElement direction="row">{children}</ReadOnlyBoxElement>
}

const FieldErrorContainer = styled(Box)`
  color: red;
  background-color: rgba(255, 0, 0, 0.14);
  border: 1px solid red;
  width: fit-content;
`

export function FieldError(props: any) {
  const { children } = props
  if (!children) {
    return null
  }

  return (
    <FieldErrorContainer {...props} round="xsmall" pad={{ horizontal: 'xsmall' }} margin={{ top: 'xxsmall' }}>
      <Text size="xsmall">{children}</Text>
    </FieldErrorContainer>
  )
}

export function NoneValue() {
  return (
    <Text size="small" weight="lighter" color="dark-4">
      <i>None</i>
    </Text>
  )
}

export const SubFieldsContainer = styled(Box)`
  column-gap: 15px;
`
