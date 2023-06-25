import { Text, CheckBoxGroup } from 'grommet'
import React from 'react'
import _ from 'lodash'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'

function CheckboxGroupField({
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
  options,
}: any) {
  const value = formState[id] || []
  const isObjectOptions = _.isObject(_.first(options))

  if (readOnlyMode) {
    const readOnlyValue = isObjectOptions
      ? formState[id].map((v) => options.find((option) => option.value === v).label)
      : formState[id]
    return (
      <ReadOnlyBox key={id} width={width || '100%'}>
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        <Text>{readOnlyValue.join(', ')}</Text>
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
      <CheckBoxGroup
        disabled={disabled}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={(e: any) => {
          setFormState({
            ...formState,
            [id]: transformFn(e.value),
          })
        }}
        onBlur={validateOnBlur}
        options={options}
      />
    </AutoFormField>
  )
}

export default CheckboxGroupField
