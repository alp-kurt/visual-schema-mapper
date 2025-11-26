import { useCallback } from 'react'
import toast from 'react-hot-toast'

import { Analytics } from '@/services/analytics'
import { Mapping } from '../types'

export const useSaveMappingsAction = (
  mappings: Mapping[],
  saveMappings: (mappings: Mapping[]) => Promise<unknown>,
) =>
  useCallback(async () => {
    if (mappings.length === 0) return

    try {
      await saveMappings(mappings)
      toast.success('Mappings saved')
      Analytics.track('MAPPINGS_SAVED', { count: mappings.length })
    } catch (error) {
      console.error('Failed to save mappings', error)
      toast.error('Could not save mappings')
    }
  }, [mappings, saveMappings])
