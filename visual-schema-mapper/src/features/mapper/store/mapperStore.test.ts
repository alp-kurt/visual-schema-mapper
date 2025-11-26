import { describe, expect, beforeEach, it } from 'vitest'

import { SOURCE_FIELDS, TARGET_FIELDS } from '@/features/mapper/api/mockData'
import { useMapperStore } from './mapperStore'

const resetStore = () => {
  useMapperStore.setState({ mappings: [] })
}

describe('useMapperStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('addMapping should update state when types match', () => {
    const result = useMapperStore.getState().addMapping('p_id', 'ean')

    expect(result.valid).toBe(true)
    expect(useMapperStore.getState().mappings).toContainEqual({ sourceId: 'p_id', targetId: 'ean' })
  })

  it('addMapping should not update state when types mismatch', () => {
    const stringSource = SOURCE_FIELDS.find((field) => field.type === 'string')!
    const numberTarget = TARGET_FIELDS.find((field) => field.type === 'number')!

    const result = useMapperStore.getState().addMapping(stringSource.id, numberTarget.id)

    expect(result.valid).toBe(false)
    expect(useMapperStore.getState().mappings).toHaveLength(0)
  })
})
