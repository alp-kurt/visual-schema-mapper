import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { memo, useMemo } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SchemaField } from '@/features/mapper/types'

const typeVariantMap: Record<SchemaField['type'], 'string' | 'number' | 'boolean' | 'date'> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'date',
}

interface DraggableFieldProps {
  field: SchemaField
  isMapped?: boolean
  isDraggingHidden?: boolean
}

/**
 * Source-side field pill that can be dragged into a target slot.
 * Guard clauses and descriptive variable names keep the drag state legible at a glance.
 */
const DraggableFieldComponent = ({ field, isMapped = false, isDraggingHidden = false }: DraggableFieldProps) => {
  const { attributes: dragAttributes, listeners: dragListeners, setNodeRef, transform, isDragging } = useDraggable({
    id: field.id,
    disabled: isMapped,
  })

  const draggableStyle = useMemo(
    () => ({
      transform: isDragging ? undefined : CSS.Translate.toString(transform),
      opacity: isDraggingHidden ? 0 : 1,
    }),
    [isDragging, isDraggingHidden, transform],
  )

  const dragStateClasses = isMapped ? 'cursor-not-allowed opacity-50' : 'cursor-grab'

  return (
    <Card
      ref={setNodeRef}
      style={draggableStyle}
      {...dragListeners}
      {...dragAttributes}
      data-testid={`source-${field.id}`}
      className={`flex items-center justify-between px-3 py-2 transition hover:-translate-y-0.5 hover:shadow ${dragStateClasses}`}
    >
      <div className="flex flex-col text-sm font-medium text-gray-50">
        <span>{field.label}</span>
        <span className="text-xs text-blue-200">{field.id}</span>
      </div>
      <Badge variant={typeVariantMap[field.type]}>{field.type}</Badge>
    </Card>
  )
}

export const DraggableField = memo(DraggableFieldComponent)
