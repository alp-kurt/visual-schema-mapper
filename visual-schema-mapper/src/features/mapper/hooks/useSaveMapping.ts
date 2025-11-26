import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Mapping } from '@/features/mapper/types'

type SaveContext = {
  previousMappings?: Mapping[]
}

const saveMappings = async (mappings: Mapping[]): Promise<Mapping[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mappings
}

export const useSaveMapping = () => {
  const queryClient = useQueryClient()

  return useMutation<Mapping[], Error, Mapping[], SaveContext>({
    mutationKey: ['save-mappings'],
    mutationFn: saveMappings,
    onMutate: async (mappings) => {
      console.log('Optimistic Update: Saving...')
      await queryClient.cancelQueries({ queryKey: ['save-mappings'] })

      const previousMappings =
        queryClient.getQueryData<Mapping[]>(['save-mappings']) ?? []

      queryClient.setQueryData(['save-mappings'], mappings)

      return { previousMappings }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMappings) {
        queryClient.setQueryData(['save-mappings'], context.previousMappings)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['save-mappings'] })
    },
  })
}
