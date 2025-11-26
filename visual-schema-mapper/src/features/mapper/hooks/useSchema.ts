import { useQuery } from '@tanstack/react-query'

import { SOURCE_FIELDS, TARGET_FIELDS } from '@/features/mapper/api/mockData'
import { SchemaField } from '@/features/mapper/types'

type SchemaResponse = {
  sourceFields: SchemaField[]
  targetFields: SchemaField[]
}

const fetchSchema = async (): Promise<SchemaResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    sourceFields: SOURCE_FIELDS,
    targetFields: TARGET_FIELDS,
  }
}

export const useSchema = () =>
  useQuery({
    queryKey: ['schema-fields'],
    queryFn: fetchSchema,
  })
