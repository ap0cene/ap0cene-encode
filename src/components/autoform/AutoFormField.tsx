import { Box, Text } from 'grommet'
import styled from 'styled-components'
import { FieldError } from './ViewComponents'
// import styled from 'styled-components'

export const AutoFormFieldContainer = styled(Box)`
  margin-top: 10px;
  margin-bottom: 10px;
  //background-color: #f9f9f9;
  padding-left: 10px;
  padding-right: 10px;
  //width: 100%;
`

export const RequiredAstrix = styled(Text)`
  color: red;
`

function AutoFormField({ label, help, children, width, required, error }: any) {
  return (
    <AutoFormFieldContainer direction="column" margin={{ bottom: 'medium' }} width={width || '100%'}>
      <Text size="large">
        {label} <RequiredAstrix>{required ? '*' : ''}</RequiredAstrix>
      </Text>
      <Box>{children}</Box>
      <FieldError>{error}</FieldError>
      <Text size="xsmall">{help}</Text>
    </AutoFormFieldContainer>
  )
}

export default AutoFormField
