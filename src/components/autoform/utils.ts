import _ from 'lodash'
import { addressFields } from './compoundFieldSchemas'

function bindInitialValuesToSchema(formSchema: Array<any>, initialValues: any): Array<any> {
  return formSchema.map((field) => {
    if (field.fields) {
      return {
        ...field,
        fields: bindInitialValuesToSchema(field.fields, initialValues[field.id] || {}),
      }
    }
    return {
      ...field,
      initialState: initialValues[field.id],
    }
  })
}

function createIntialValuesObject(formSchema: any) {
  return formSchema.reduce((acc: any, field: any) => {
    if (field.fields) {
      return {
        ...acc,
        [field.id]: createIntialValuesObject(field.fields),
      }
    }
    return {
      ...acc,
      [field.id]: field.initialState,
    }
  }, {})
}

function createInitialErrorsObject(formSchema: any) {
  return formSchema.reduce((acc: any, field: any) => {
    if (field.fields) {
      return {
        ...acc,
        [field.id]: createInitialErrorsObject(field.fields),
      }
    }
    return {
      ...acc,
      [field.id]: '',
    }
  }, {})
}

export function evaluateRequiredField(required: boolean | Function, formState: any) {
  if (_.isFunction(required)) {
    return required(formState)
  }
  return required
}

function generateValidator(field: any, formState: any) {
  return (value: any) => {
    // if the field has a condition and it isn't met we don't care about validation
    if (field.condition && !field.condition(formState)) {
      return ''
    }
    if (evaluateRequiredField(field.required, formState)) {
      if (field.type === 'checkboxgroup') {
        if (!value || value.length === 0) {
          return 'Required'
        }
      }
      if (_.isUndefined(value) || value === '') {
        return 'Required'
      }
    }
    if (field.validate) {
      const error = field.validate(value, formState)
      if (error) {
        return error
      }
    }
    return ''
  }
}

function generateValidators(formSchema: any, formState: any) {
  return formSchema.reduce((agg: any, field: any) => {
    const { id, fields } = field
    if (fields) {
      return {
        ...agg,
        [id]: generateValidators(fields, formState[id]),
      }
    }
    return {
      ...agg,
      [id]: generateValidator(field, formState),
    }
    return agg
  }, {})
}

function evaluateValidators(validators: any, formState: any): any {
  return Object.keys(validators).reduce((agg: any, key: string) => {
    if (typeof validators[key] === 'function') {
      return {
        ...agg,
        [key]: validators[key](formState[key]),
      }
    }
    return {
      ...agg,
      [key]: evaluateValidators(validators[key], formState[key]),
    }
  }, {})
}

function isEmptyNestedObject(obj: any): any {
  return Object.keys(obj).every((key) => {
    if (typeof obj[key] === 'object') {
      return isEmptyNestedObject(obj[key])
    }
    return obj[key] === ''
  })
}

function mapEnumAndLabelsToOptions(enumObject: any, labels: any) {
  return Object.keys(enumObject).map((key) => {
    return {
      label: labels[key],
      value: key,
    }
  })
}

// Turn enum into array
function mapEnumToOptions(enumObject: any): string[] {
  return Object.values(enumObject) as string[]
}

function populateCompoundFieldsOnFormSchema(formSchema: any) {
  return formSchema.map((field: any) => {
    if (field.type === 'address') {
      return {
        ...field,
        fields: addressFields.map((addressField) => ({
          ...addressField,
          condition: field.condition,
        })),
      }
    }
    return field
  })
}

// this function recursively removes all undefined values from an object
function cleanObject(obj) {
  if (_.isArray(obj) || typeof obj !== 'object' || obj === null) return obj

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => {
        if (_.isArray(v)) {
          return v.length > 0
        }
        return v !== undefined
      })
      .map(([k, v]) => [k, cleanObject(v)]),
  )
}

export {
  bindInitialValuesToSchema,
  createInitialErrorsObject,
  createIntialValuesObject,
  generateValidators,
  evaluateValidators,
  isEmptyNestedObject,
  mapEnumAndLabelsToOptions,
  mapEnumToOptions,
  populateCompoundFieldsOnFormSchema,
  cleanObject,
}
