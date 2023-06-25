import { DateInput, Text } from 'grommet'
import React from 'react'
import styled from 'styled-components'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'
import { FieldProps } from './types'

const ReadOnlyTextArea = styled(Text)`
  white-space: pre-wrap;
  max-width: 100%;
`

function DateField({
  id,
  name,
  placeholder,
  formState,
  required,
  help,
  validate,
  disabled,
  setFormState,
  readOnlyMode,
  readOnlyFormattedValue,
  width,
  errors,
  setFormErrors,
  validators,
}: FieldProps) {
  const value = formState[id] || ''

  if (readOnlyMode) {
    return (
      <ReadOnlyBox key={id} width={width || '100%'}>
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        <ReadOnlyTextArea>{readOnlyFormattedValue}</ReadOnlyTextArea>
      </ReadOnlyBox>
    )
  }

  const validateOnBlur = () => {
    setFormErrors({
      ...errors,
      [id]: validators[id](value),
    })
  }

  return (
    <AutoFormField
      label={name}
      key={id}
      name={id}
      required={required}
      help={help}
      validate={validate}
      disabled={disabled}
      width={width}
      error={errors[id]}
    >
      <DateInput
        disabled={disabled}
        format="mm/dd/yyyy"
        name={id}
        value={formState[id]}
        placeholder={placeholder}
        onChange={(e: any) => {
          setFormState({
            ...formState,
            [id]: e.value,
          })
        }}
        onBlur={validateOnBlur}
      />
    </AutoFormField>
  )
}

export default DateField
