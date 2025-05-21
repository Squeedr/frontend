export type ValidationRule = {
  test: (value: any) => boolean
  message: string
}

export type FieldValidation = {
  [key: string]: ValidationRule[]
}

export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message
    }
  }
  return null
}

export function validateForm(values: Record<string, any>, validation: FieldValidation): Record<string, string | null> {
  const errors: Record<string, string | null> = {}

  Object.keys(validation).forEach((field) => {
    const fieldValue = values[field]
    const fieldRules = validation[field]
    errors[field] = validateField(fieldValue, fieldRules)
  })

  return errors
}

// Common validation rules
export const required = (message = "This field is required"): ValidationRule => ({
  test: (value) => value !== undefined && value !== null && value !== "",
  message,
})

export const email = (message = "Please enter a valid email address"): ValidationRule => ({
  test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message,
})

export const minLength = (length: number, message?: string): ValidationRule => ({
  test: (value) => value.length >= length,
  message: message || `Must be at least ${length} characters`,
})

export const maxLength = (length: number, message?: string): ValidationRule => ({
  test: (value) => value.length <= length,
  message: message || `Must be no more than ${length} characters`,
})

export const numeric = (message = "Must contain only numbers"): ValidationRule => ({
  test: (value) => /^\d+$/.test(value),
  message,
})

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  test: (value) => regex.test(value),
  message,
})
