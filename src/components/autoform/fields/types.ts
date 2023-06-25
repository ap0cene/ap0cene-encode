export type FieldProps = {
  readOnlyMode: boolean
  readOnlyFormattedValue: string
  id: string
  name: string
  placeholder: string
  formState: any
  required: boolean
  help: string
  validate: any
  disabled: boolean
  setFormState: any
  setFormErrors: any
  width: any
  errors: any
  validators: any
  transformFn: (value: string) => string
}
