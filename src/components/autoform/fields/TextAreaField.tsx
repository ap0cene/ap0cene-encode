import { Text, TextArea } from 'grommet'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'

const ReadOnlyTextArea = styled(Text)`
  white-space: pre-wrap;
  max-width: 100%;
`

function TextAreaField({
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
}: any) {
  const value = formState[id] || ''
  const textArea: any = React.useRef(null)

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

  const textAreaAdjust = () => {
    textArea.current.style.height = '1px'
    textArea.current.style.height = `${22 + textArea.current.scrollHeight}px`
  }

  useEffect(() => {
    textAreaAdjust()
  }, [])

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
      <TextArea
        ref={textArea}
        onKeyUp={textAreaAdjust}
        disabled={disabled}
        name={id}
        value={formState[id]}
        placeholder={placeholder}
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

export default TextAreaField
