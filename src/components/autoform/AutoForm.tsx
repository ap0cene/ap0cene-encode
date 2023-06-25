import React, { useState } from 'react'
import { Box, Button, FileInput } from 'grommet'
import styled from 'styled-components'
import _ from 'lodash'
import { NoneValue, ReadOnlyBox, ReadOnlyTitle } from './ViewComponents'
import ImagesField from './fields/ImagesField'
import TextField from './fields/TextField'
import TextAreaField from './fields/TextAreaField'
import AutoFormField from './AutoFormField'
import {
  bindInitialValuesToSchema,
  createInitialErrorsObject,
  createIntialValuesObject,
  evaluateRequiredField,
  evaluateValidators,
  generateValidators,
  isEmptyNestedObject,
  populateCompoundFieldsOnFormSchema,
} from './utils'
import CompoundField from './fields/CompoundField'
import CheckboxGroupField from './fields/CheckboxGroupField'
import SelectField from './fields/SelectField'
import CheckboxField from './fields/CheckboxField'
import DateField from './fields/DateField'
import CurrencyField from './fields/CurrencyField'

const RenderedFormContainer = styled(Box)`
  flex-flow: wrap;
`

export const renderFormElements = (
  formSchema: any,
  formState: any,
  setFormState: any,
  readOnlyMode: boolean,
  errors: any,
  setFormErrors: any,
  validators: any,
) => {
  const fieldMap = formSchema.map((field: any, i: number) => {
    const { id, name, help, validate, disabled, placeholder, formContent, hidden, condition, width, fields }: any =
      field

    const required = evaluateRequiredField(field.required, formState)

    if (condition && !condition(formState)) {
      return null
    }

    if (formContent && readOnlyMode) {
      return null
    }

    if (formContent && !readOnlyMode) {
      const key = `formContent-${i}`
      return (
        <Box key={key} pad={{ horizontal: 'small' }} width={width || '100%'}>
          {formContent}
        </Box>
      )
    }

    if (hidden) {
      return null
    }

    const transformFn = field.transform || _.identity

    if (readOnlyMode && _.isUndefined(formState[field.id])) {
      return (
        <ReadOnlyBox key={field.id}>
          <ReadOnlyTitle>{field.name}</ReadOnlyTitle>
          <NoneValue />
        </ReadOnlyBox>
      )
    }

    const readOnlyValueFn = field.readOnlyValueFormatter || _.identity
    const readOnlyFormattedValue = readOnlyValueFn(formState[field.id])

    return (() => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'url':
        case 'number':
          return (
            <TextField
              {...field}
              required={required}
              key={field.id}
              transformFn={transformFn}
              formState={formState}
              setFormState={setFormState}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
            />
          )
          break
        case 'textarea':
          return (
            <TextAreaField
              {...field}
              required={required}
              key={field.id}
              transformFn={transformFn}
              formState={formState}
              setFormState={setFormState}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
            />
          )
          break
        case 'date':
          return (
            <DateField
              key={id}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              id={id}
              name={name}
              formState={formState}
              required={required}
              help={help}
              validate={validate}
              placeholder={placeholder}
              disabled={disabled}
              setFormState={setFormState}
              width={width}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
              transformFn={transformFn}
            />
          )
          break
        case 'currency':
          return (
            <CurrencyField
              key={id}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              id={id}
              name={name}
              formState={formState}
              required={required}
              help={help}
              validate={validate}
              placeholder={placeholder}
              disabled={disabled}
              setFormState={setFormState}
              width={width}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
              transformFn={transformFn}
            />
          )
          break
        case 'checkbox':
          return (
            <CheckboxField
              {...field}
              required={required}
              key={id}
              transformFn={transformFn}
              formState={formState}
              setFormState={setFormState}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
            />
          )
          break
        case 'checkboxgroup':
          return (
            <CheckboxGroupField
              {...field}
              required={required}
              key={id}
              transformFn={transformFn}
              formState={formState}
              setFormState={setFormState}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
            />
          )
          break
        case 'select':
          return (
            <SelectField
              {...field}
              required={required}
              key={id}
              transformFn={transformFn}
              formState={formState}
              setFormState={setFormState}
              readOnlyMode={readOnlyMode}
              readOnlyFormattedValue={readOnlyFormattedValue}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
            />
          )

          break
        case 'file':
          return (
            <AutoFormField
              label={name}
              key={id}
              name={id}
              required={required}
              help={help}
              validate={validate}
              disabled={disabled}
            >
              <FileInput
                name={id}
                onChange={(event: any) => {
                  const fileList = event?.target?.files
                  setFormState({
                    ...formState,
                    [id]: fileList,
                  })
                }}
              />
            </AutoFormField>
          )
          break
        case 'images':
          return (
            <ImagesField
              key={id}
              readOnlyMode={readOnlyMode}
              id={id}
              name={name}
              formState={formState}
              required={required}
              help={help}
              validate={validate}
              disabled={disabled}
              setFormState={setFormState}
              width={width}
              errors={errors}
            />
          )
          break
        case 'compound':
          return (
            <CompoundField
              {...field}
              required={required}
              key={id}
              formState={formState}
              setFormState={setFormState}
              readOnlyMode={readOnlyMode}
              transformFn={transformFn}
              errors={errors}
              setFormErrors={setFormErrors}
              validators={validators}
            />
          )
          break
      }
    })()
  })

  return <RenderedFormContainer>{fieldMap}</RenderedFormContainer>
}

function AutoForm({
  formSchema: initialFormSchema,
  initialValues,
  onSubmit,
  readOnlyMode,
  onCancel,
}: {
  formSchema: Array<any>
  initialValues: Object
  onSubmit?: any
  readOnlyMode: boolean
  onCancel?: any
}) {
  const formSchemaWithCompoundFields = populateCompoundFieldsOnFormSchema(initialFormSchema)
  const formSchema = bindInitialValuesToSchema(formSchemaWithCompoundFields, initialValues)
  // @ts-ignore
  const initialFormState = createIntialValuesObject(formSchema)

  const [formState, setFormState] = useState(initialFormState)
  const [errors, setFormErrors] = useState(createInitialErrorsObject(formSchema))

  const validators = generateValidators(formSchema, formState)
  const [submitting, setSubmitting] = useState(false)

  const submitForm = async () => {
    const formErrors = evaluateValidators(validators, formState)
    if (!isEmptyNestedObject(formErrors)) {
      setFormErrors(formErrors)
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(formState)
    } catch (e) {
      console.error(e)
      setSubmitting(false)
    }
    setSubmitting(false)
  }

  return (
    <Box margin={{ top: 'medium' }}>
      {renderFormElements(formSchema, formState, setFormState, readOnlyMode, errors, setFormErrors, validators)}
      {readOnlyMode ? null : (
        <Box margin={{ top: 'medium' }} direction="row" justify="around">
          {onSubmit ? <Button primary onClick={() => submitForm()} label="Submit" disabled={submitting} /> : null}
          {onCancel ? (
            <Button
              secondary
              type="button"
              label="Cancel"
              disabled={submitting}
              onClick={() => {
                setFormState(initialFormState)
                onCancel()
              }}
            />
          ) : null}
        </Box>
      )}
    </Box>
  )
}

AutoForm.defaultProps = {
  onSubmit: null,
  onCancel: null,
}

export default AutoForm
