import { create } from 'zustand'

import { SOURCE_FIELDS, TARGET_FIELDS } from '@/features/mapper/api/mockData'
import { Mapping, ValidationResult } from '@/features/mapper/types'
import { validateMapping } from '@/features/mapper/utils/validators'
import { Analytics } from '@/services/analytics'

interface MapperStoreState {
  /** Current relationships between source and target schema fields. */
  mappings: Mapping[];
  /**
   * Create or replace a mapping for a target field.
   * Only one source can map to a target, so new mappings overwrite the target's previous pair.
   */
  addMapping: (sourceFieldId: string, targetFieldId: string) => ValidationResult;
  /** Remove the mapping associated with the provided target field. */
  removeMapping: (targetFieldId: string) => void;
}

/**
 * Find source and target schema fields by id.
 * Keeping lookups outside the store reduces inline branching when mapping.
 */
const resolveFieldsById = (sourceFieldId: string, targetFieldId: string) => ({
  sourceField: SOURCE_FIELDS.find((field) => field.id === sourceFieldId),
  targetField: TARGET_FIELDS.find((field) => field.id === targetFieldId),
})

/**
 * Ensure only a single mapping exists per target by filtering and appending the new pair.
 */
const upsertTargetMapping = (currentMappings: Mapping[], mapping: Mapping) => [
  ...currentMappings.filter((existing) => existing.targetId !== mapping.targetId),
  mapping,
]

export const useMapperStore = create<MapperStoreState>((set) => ({
  mappings: [],
  addMapping: (sourceFieldId, targetFieldId) => {
    const { sourceField, targetField } = resolveFieldsById(sourceFieldId, targetFieldId)

    if (!sourceField || !targetField) {
      return { valid: false, message: 'Source or target field not found' }
    }

    const validationResult = validateMapping(sourceField, targetField)

    if (!validationResult.valid) {
      Analytics.track('VALIDATION_ERROR', {
        source: sourceField.type,
        target: targetField.type,
      })
      return validationResult
    }

    const updatedMapping = { sourceId: sourceFieldId, targetId: targetFieldId }

    set((state) => ({ mappings: upsertTargetMapping(state.mappings, updatedMapping) }))

    return { valid: true }
  },
  removeMapping: (targetFieldId) => {
    set((state) => ({
      mappings: state.mappings.filter((mapping) => mapping.targetId !== targetFieldId),
    }))
  },
}))
