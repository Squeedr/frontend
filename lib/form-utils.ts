import { useCallback, useState, useRef, useEffect } from "react"
import { useDebounce } from "./performance-utils"

interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

interface FormField<T> {
  value: T
  error: string | null
  touched: boolean
  rules?: ValidationRule<T>[]
}

type FormFields<T> = {
  [K in keyof T]: FormField<T[K]>
}

interface UseFormOptions<T> {
  initialValues: T
  validationRules?: {
    [K in keyof T]?: ValidationRule<T[K]>[]
  }
  onSubmit: (values: T) => void | Promise<void>
  debounceTime?: number
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  debounceTime = 300,
}: UseFormOptions<T>) {
  // Initialize form fields
  const [fields, setFields] = useState<FormFields<T>>(() => {
    const initialFields: Partial<FormFields<T>> = {}
    
    for (const key in initialValues) {
      initialFields[key as keyof T] = {
        value: initialValues[key],
        error: null,
        touched: false,
        rules: validationRules[key as keyof T],
      }
    }
    
    return initialFields as FormFields<T>
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const field = fields[name]
      if (!field || !field.rules) return null

      for (const rule of field.rules) {
        if (!rule.validate(value)) {
          return rule.message
        }
      }

      return null
    },
    [fields]
  )

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    let isValid = true
    const updatedFields = { ...fields }

    for (const key in fields) {
      const field = fields[key as keyof T]
      const error = validateField(key as keyof T, field.value)
      
      if (error) {
        isValid = false
        updatedFields[key as keyof T] = {
          ...field,
          error,
        }
      }
    }

    setFields(updatedFields)
    return isValid
  }, [fields, validateField])

  // Handle field change with debouncing
  const handleChange = useDebounce(
    useCallback(
      (name: keyof T, value: T[keyof T]) => {
        setFields((prevFields) => {
          const field = prevFields[name]
          const error = validateField(name, value)
          
          return {
            ...prevFields,
            [name]: {
              ...field,
              value,
              error,
              touched: true,
            },
          }
        })
        
        setIsDirty(true)
      },
      [validateField]
    ),
    debounceTime
  )

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => {
      setFields((prevFields) => {
        const field = prevFields[name]
        const error = validateField(name, field.value)
        
        return {
          ...prevFields,
          [name]: {
            ...field,
            error,
            touched: true,
          },
        }
      })
    },
    [validateField]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) {
        return
      }
      
      setIsSubmitting(true)
      
      try {
        const values = Object.keys(fields).reduce(
          (acc, key) => ({
            ...acc,
            [key]: fields[key as keyof T].value,
          }),
          {} as T
        )
        
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    },
    [fields, onSubmit, validateForm]
  )

  // Reset form
  const resetForm = useCallback(() => {
    setFields((prevFields) => {
      const resetFields: Partial<FormFields<T>> = {}
      
      for (const key in prevFields) {
        resetFields[key as keyof T] = {
          ...prevFields[key as keyof T],
          value: initialValues[key as keyof T],
          error: null,
          touched: false,
        }
      }
      
      return resetFields as FormFields<T>
    })
    
    setIsDirty(false)
    setIsSubmitting(false)
  }, [initialValues])

  // Set form values
  const setValues = useCallback(
    (values: Partial<T>) => {
      setFields((prevFields) => {
        const updatedFields = { ...prevFields }
        
        for (const key in values) {
          if (key in updatedFields) {
            const value = values[key as keyof T]
            if (value !== undefined) {
              const error = validateField(key as keyof T, value)
              
              updatedFields[key as keyof T] = {
                ...updatedFields[key as keyof T],
                value,
                error,
                touched: true,
              }
            }
          }
        }
        
        return updatedFields
      })
      
      setIsDirty(true)
    },
    [validateField]
  )

  // Get form values
  const getValues = useCallback((): T => {
    return Object.keys(fields).reduce(
      (acc, key) => ({
        ...acc,
        [key]: fields[key as keyof T].value,
      }),
      {} as T
    )
  }, [fields])

  return {
    fields,
    isSubmitting,
    isDirty,
    formRef,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    getValues,
    validateForm,
  }
} 