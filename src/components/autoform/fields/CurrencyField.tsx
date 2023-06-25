import { Text, TextInput } from 'grommet'
import React from 'react'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'
import { FieldProps } from './types'

function CurrencyField({
  id,
  name,
  placeholder,
  transformFn,
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
      <ReadOnlyBox key={id} width="100%">
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        <Text>{readOnlyFormattedValue}</Text>
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
      <TextInput
        disabled={disabled}
        type="number"
        name={id}
        value={value}
        placeholder={placeholder}
        icon={<Text>$</Text>}
        onChange={(e) => {
          const val = transformFn(e.target.value)
          setFormState({
            ...formState,
            [id]: val,
          })
        }}
        min={0}
        onBlur={(e) => {
          const transformedValue = Number(e.target.value).toFixed(2)
          setFormState({
            ...formState,
            [id]: transformedValue,
          })
          validateOnBlur()
        }}
      />
    </AutoFormField>
  )
}

export default CurrencyField
