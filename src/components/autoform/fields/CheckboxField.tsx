import { CheckBox, Text } from 'grommet'
import React from 'react'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'

function CheckboxField({
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
  width,
  errors,
  setFormErrors,
  validators,
  label,
}: any) {
  const value = formState[id] || false

  if (readOnlyMode) {
    return (
      <ReadOnlyBox key={id} width={width || '100%'}>
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        <Text>{value.toString()}</Text>
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
      <CheckBox
        disabled={disabled}
        name={id}
        label={label}
        checked={formState[id]}
        placeholder={placeholder}
        onChange={(e) => {
          const val = transformFn(e.target.checked)
          setFormState({
            ...formState,
            [id]: val,
          })
        }}
        onBlur={validateOnBlur}
      />
    </AutoFormField>
  )
}

export default CheckboxField
