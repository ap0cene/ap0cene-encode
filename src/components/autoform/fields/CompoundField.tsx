import _ from 'lodash'
import { Box, Select, Text, TextInput } from 'grommet'
import React from 'react'
import styled from 'styled-components'
import { FieldError, NoneValue, ReadOnlyBox, ReadOnlyTitle, SubFieldsContainer } from '../ViewComponents'
import AutoFormField, { RequiredAstrix } from '../AutoFormField'

const StyledTextInput = styled(TextInput)`
  /* Chrome, Safari, Edge, Opera */

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`

// eslint-disable-next-line react/prefer-stateless-function
class InputField extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    const {
      field: { options },
    } = this.props
    // Don't call this.setState() here!
    this.state = { filteredOptions: options }
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { field, id, formState, setFormState, value, validateOnBlur, index } = this.props
    const { filteredOptions } = this.state
    const isObjectOptions = _.isObject(_.first(field.options))
    switch (field.type) {
      case 'select':
        return (
          <Select
            placeholder={field.placeholder}
            disabled={field.disabled}
            name={id}
            value={_.get(formState, `${id}.${field.id}`)}
            options={filteredOptions}
            onChange={(e) => {
              setFormState({
                ...formState,
                [id]: {
                  ...value,
                  [field.id]: e.value,
                },
              })
            }}
            onBlur={() => validateOnBlur(index)}
            onSearch={
              field.search
                ? (text) => {
                    // The line below escapes regular expression special characters:
                    // [ \ ^ $ . | ? * + ( )
                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')

                    // Create the regular expression with modified value which
                    // handles escaping special characters. Without escaping special
                    // characters, errors will appear in the console
                    const exp = new RegExp(escapedText, 'i')
                    if (_.isObject(_.first(field.options))) {
                      this.setState({ filteredOptions: field.options.filter((o: any) => exp.test(o.label)) })
                    } else {
                      this.setState({ filteredOptions: field.options.filter((o: any) => exp.test(o)) })
                    }
                  }
                : undefined
            }
            valueKey={isObjectOptions ? { key: 'value', reduce: true } : undefined}
            labelKey={isObjectOptions ? 'label' : undefined}
          />
        )
      default:
        return (
          <StyledTextInput
            placeholder={field.placeholder}
            disabled={field.disabled}
            type={field.type}
            name={id}
            value={_.get(formState, `${id}.${field.id}`)}
            onChange={(e) => {
              setFormState({
                ...formState,
                [id]: {
                  ...value,
                  [field.id]: e.target.value,
                },
              })
            }}
            onBlur={() => validateOnBlur(index)}
          />
        )
    }
  }
}

function CompoundField({
  id,
  name,
  formState,
  setFormState,
  readOnlyMode,
  required,
  help,
  validate,
  disabled,
  width,
  errors,
  setFormErrors,
  fields,
  validators,
}: // fieldsAlignment,
any) {
  const value = formState[id] || ''
  if (readOnlyMode) {
    return (
      <ReadOnlyBox key={id} width="100%">
        <ReadOnlyTitle>{name}</ReadOnlyTitle>
        <Box direction="row-responsive">
          {Object.keys(value).map((key, index) => {
            return (
              <Box key={key} margin={{ right: 'medium' }}>
                <Text>{formState[id][key] || <NoneValue />}</Text>
                <Text size="xsmall">{fields[index].name || key}</Text>
              </Box>
            )
          })}
        </Box>
      </ReadOnlyBox>
    )
  }

  const validateOnBlur = (index: number) => {
    const field = fields[index]
    setFormErrors({
      ...errors,
      [id]: {
        ...(errors[id] || {}),
        [field.id]: validators[id][field.id](formState[id][field.id]),
      },
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
    >
      <SubFieldsContainer direction="row">
        {fields.map((field: any, index: number) => {
          const fieldWidth = field.width || `${Math.floor(100 / fields.length) - 1}%`
          return (
            <Box key={field.id} width={fieldWidth}>
              <InputField
                field={field}
                id={id}
                formState={formState}
                setFormState={setFormState}
                value={value}
                validateOnBlur={validateOnBlur}
                index={index}
              />
              <FieldError>{_.get(errors, `${id}.${field.id}`)}</FieldError>
              <Text size="xsmall">
                {field.name || field.id} <RequiredAstrix>{field.required ? '*' : ''}</RequiredAstrix>
              </Text>
            </Box>
          )
        })}
      </SubFieldsContainer>
    </AutoFormField>
  )
}

export default CompoundField
