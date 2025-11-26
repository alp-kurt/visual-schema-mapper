import { describe, expect, it } from 'vitest'

import { validateMapping } from './validators'
import { SchemaField } from '@/features/mapper/types'

const createField = (id: string, label: string, type: SchemaField['type']): SchemaField => ({
  id,
  label,
  type,
  required: false,
})

describe('validateMapping', () => {
  it('should return valid true for matching String -> String', () => {
    const source = createField('sourceString', 'Source String', 'string')
    const target = createField('targetString', 'Target String', 'string')

    const result = validateMapping(source, target)

    expect(result.valid).toBe(true)
  })

  it('should return valid false for String -> Number (Tradebyte rule)', () => {
    const source = createField('sourceString', 'Source String', 'string')
    const target = createField('targetNumber', 'Target Number', 'number')

    const result = validateMapping(source, target)

    expect(result.valid).toBe(false)
    expect(result.message).toContain('cannot map string to number')
  })

  it('should return valid true for Number -> String (safe casting)', () => {
    const source = createField('sourceNumber', 'Source Number', 'number')
    const target = createField('targetString', 'Target String', 'string')

    const result = validateMapping(source, target)

    expect(result.valid).toBe(true)
  })
})
