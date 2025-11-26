import { useDroppable } from '@dnd-kit/core'
import { memo } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SchemaField } from '@/features/mapper/types'

const typeVariantMap: Record<SchemaField['type'], 'string' | 'number' | 'boolean' | 'date'> = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'date',
}

interface DroppableSlotProps {
  target: SchemaField
  mappedSource?: SchemaField
  isInvalid?: boolean
  onRemove: (targetId: string) => void
}

/**
 * Target-side slot that highlights when a source field hovers and renders a mapped pill when connected.
 */
const DroppableSlotComponent = ({ target, mappedSource, isInvalid = false, onRemove }: DroppableSlotProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: target.id })

  const baseClasses =
    'flex flex-col gap-2 border-2 border-dashed px-4 py-3 transition min-h-[96px] justify-center bg-dark-card'
  const activeHoverClasses = isOver ? 'border-brand-orange/60 shadow-inner bg-white/5' : 'border-brand-blue/30'
  const invalidStateClasses = isInvalid ? 'border-red-500 ring-2 ring-red-500/40' : ''

  return (
    <Card
      ref={setNodeRef}
      data-testid={`target-${target.id}`}
      className={`${baseClasses} ${activeHoverClasses} ${invalidStateClasses}`}
    >
      <div className="flex items-center justify-between text-sm font-semibold text-gray-50">
        <span>{target.label}</span>
        {target.required ? <span className="text-xs font-bold text-brand-orange">*</span> : null}
      </div>
      {mappedSource ? (
        <Card className="flex items-center justify-between border border-white/10 bg-dark-card/80 px-3 py-2 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-50">{mappedSource.label}</span>
            <span className="text-xs text-blue-200">{mappedSource.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={typeVariantMap[mappedSource.type]}>{mappedSource.type}</Badge>
            <button
              type="button"
              onClick={() => onRemove(target.id)}
              className="rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-gray-200 transition hover:border-brand-orange/60 hover:text-brand-orange"
            >
              ✕
            </button>
          </div>
        </Card>
      ) : (
        <p className="text-sm text-blue-200">Drop here</p>
      )}
    </Card>
  )
}

export const DroppableSlot = memo(DroppableSlotComponent)
