import { SchemaField, ValidationResult } from '@/features/mapper/types'

export const validateMapping = (
  sourceField: SchemaField,
  targetField: SchemaField,
): ValidationResult => {
  if (sourceField.type === targetField.type) {
    return { valid: true }
  }

  const isStringToDate = sourceField.type === 'string' && targetField.type === 'date'
  const isNumberToString = sourceField.type === 'number' && targetField.type === 'string'

  if (isStringToDate || isNumberToString) {
    return { valid: true }
  }

  return {
    valid: false,
    message: `Type mismatch: cannot map ${sourceField.type} to ${targetField.type}`,
  }
}

export const validateFieldCompatibility = validateMapping
