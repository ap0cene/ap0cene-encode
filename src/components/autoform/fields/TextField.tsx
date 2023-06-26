import { Anchor, Text, TextInput } from 'grommet'
import React from 'react'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'
import { FieldProps } from './types'

const defaultValues: any = {
  text: '',
  email: '',
  url: '',
  number: '',
}

type TextFieldProps = FieldProps & {
  icon: any
  type: string
}

function TextField({
  id,
  name,
  type,
  placeholder,
  transformFn,
  formState,
  required,
  help,
  validate,
  disabled,
  setFormState,
  icon,
  readOnlyMode,
  readOnlyFormattedValue,
  width,
  errors,
  setFormErrors,
  validators,
}: TextFieldProps) {
  const value = formState[id] || defaultValues[type]

  if (readOnlyMode) {
    return (
      <ReadOnlyBox key={id} width="100%">
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        {type === 'url' ? (
          <Anchor
            href={value}
            label={readOnlyFormattedValue}
            target="_blank"
            reverse
            onClick={(e) => e.stopPropagation()}
            weight="normal"
          />
        ) : (
          <Text>{readOnlyFormattedValue}</Text>
        )}
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
        type={type}
        name={id}
        value={value}
        placeholder={placeholder}
        icon={icon}
        onChange={(e) => {
          const val = transformFn(e.target.value)
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

export default TextField
