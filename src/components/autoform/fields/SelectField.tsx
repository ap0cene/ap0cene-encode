import { Text, Select } from 'grommet'
import React from 'react'
import _ from 'lodash'
import { ReadOnlyBox, ReadOnlyTitle } from '../ViewComponents'
import AutoFormField from '../AutoFormField'

class SelectField extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    const { options } = this.props
    // Don't call this.setState() here!
    this.state = { filteredOptions: options }
  }

  validateOnBlur = () => {
    const { id, validators, setFormErrors, formState, errors } = this.props
    setFormErrors({
      ...errors,
      [id]: validators[id](formState[id] || ''),
    })
  }

  onSearch = (text) => {
    const { options } = this.props
    // The line below escapes regular expression special characters:
    // [ \ ^ $ . | ? * + ( )
    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')

    // Create the regular expression with modified value which
    // handles escaping special characters. Without escaping special
    // characters, errors will appear in the console
    const exp = new RegExp(escapedText, 'i')
    if (_.isObject(_.first(options))) {
      this.setState({ filteredOptions: options.filter((o: any) => exp.test(o.label)) })
    } else {
      this.setState({ filteredOptions: options.filter((o: any) => exp.test(o)) })
    }
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const {
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
      options,
      search,
      errors,
    } = this.props
    const { filteredOptions } = this.state
    const isObjectOptions = _.isObject(_.first(options))

    if (readOnlyMode) {
      const readOnlyValue = isObjectOptions
        ? options.find((option) => option.value === formState[id]).label
        : formState[id]
      return (
        <ReadOnlyBox key={id} width={width || '100%'}>
          <ReadOnlyTitle>{name}</ReadOnlyTitle>
          <Text>{readOnlyValue}</Text>
        </ReadOnlyBox>
      )
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
        error={errors[id]}
      >
        <Select
          name={id}
          placeholder={placeholder}
          disabled={disabled}
          value={formState[id]}
          options={filteredOptions}
          valueKey={isObjectOptions ? { key: 'value', reduce: true } : undefined}
          labelKey={isObjectOptions ? 'label' : undefined}
          onChange={(e: any) => {
            setFormState({
              ...formState,
              [id]: transformFn(e.value),
            })
            this.validateOnBlur()
          }}
          onSearch={search ? this.onSearch : undefined}
          onBlur={this.validateOnBlur}
        />
      </AutoFormField>
    )
  }
}

export default SelectField
