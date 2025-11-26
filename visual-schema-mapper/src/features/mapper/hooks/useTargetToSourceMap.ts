import { useMemo } from 'react'

import { Mapping } from '../types'

export const useTargetToSourceMap = (mappings: Mapping[]) =>
  useMemo(() => {
    const mappingByTarget: Record<string, string> = {}

    mappings.forEach((mapping) => {
      mappingByTarget[mapping.targetId] = mapping.sourceId
    })

    return mappingByTarget
  }, [mappings])
