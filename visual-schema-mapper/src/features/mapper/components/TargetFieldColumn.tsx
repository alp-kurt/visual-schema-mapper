import { Card } from '@/components/ui/Card'
import { DroppableSlot } from './DroppableSlot'
import { SchemaField } from '../types'

interface TargetFieldColumnProps {
  fields: SchemaField[]
  sourceFields: SchemaField[]
  targetToSourceMap: Record<string, string>
  invalidTargetId: string | null
  onRemove: (targetFieldId: string) => void
}

const targetGridStyle = { gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }

const findMappedSource = (
  sourceFields: SchemaField[],
  targetToSourceMap: Record<string, string>,
  targetId: string,
) => sourceFields.find((field) => field.id === targetToSourceMap[targetId])

export const TargetFieldColumn = ({
  fields,
  sourceFields,
  targetToSourceMap,
  invalidTargetId,
  onRemove,
}: TargetFieldColumnProps) => (
  <section aria-labelledby="target-fields-title" className="h-full">
    <Card as="section" className="flex h-full flex-col gap-4 border-white/5 p-4">
      <header className="flex items-center justify-between">
        <h2 id="target-fields-title" className="text-lg font-semibold text-gray-50">
          Target Fields
        </h2>
        <p className="text-xs text-blue-200">Map each target to a compatible source</p>
      </header>
      <ul className="grid gap-3" style={targetGridStyle}>
        {fields.map((targetField) => {
          const mappedSource: SchemaField | undefined = findMappedSource(
            sourceFields,
            targetToSourceMap,
            targetField.id,
          )

          return (
            <li key={targetField.id} className="list-none">
              <DroppableSlot
                target={targetField}
                mappedSource={mappedSource}
                isInvalid={invalidTargetId === targetField.id}
                onRemove={onRemove}
              />
            </li>
          )
        })}
      </ul>
    </Card>
  </section>
)
