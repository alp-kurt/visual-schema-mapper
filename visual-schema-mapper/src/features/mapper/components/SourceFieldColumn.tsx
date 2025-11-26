import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import { Card } from '@/components/ui/Card'
import { DraggableField } from './DraggableField'
import { Mapping, SchemaField } from '../types'

interface SourceFieldColumnProps {
  fields: SchemaField[]
  mappings: Mapping[]
  activeSourceId?: string | null
}

const scrollContainerClasses = 'scrollbar-hide relative max-h-[70vh] overflow-y-auto pr-1'

export const SourceFieldColumn = ({ fields, mappings, activeSourceId }: SourceFieldColumnProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null)

  const rowVirtualizer = useVirtualizer({
    count: fields.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const mappedSourceIds = useMemo(
    () => new Set(mappings.map((mapping) => mapping.sourceId)),
    [mappings],
  )

  return (
    <section aria-labelledby="source-fields-title" className="h-full">
      <Card as="section" className="flex h-full flex-col gap-4 border-white/5 p-4 shadow-inner">
        <header className="flex items-center justify-between">
          <h2 id="source-fields-title" className="text-lg font-semibold text-gray-50">
            Source Fields
          </h2>
          <p className="text-xs text-blue-200">{fields.length} available</p>
        </header>

        <div ref={parentRef} className={scrollContainerClasses} role="list">
          <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
            {virtualItems.map((virtualRow) => {
              const field = fields[virtualRow.index]
              if (!field) return null
              const isMapped = mappedSourceIds.has(field.id)
              const isActive = activeSourceId === field.id

              return (
                <div
                  key={field.id}
                  ref={rowVirtualizer.measureElement}
                  role="listitem"
                  className="absolute left-0 top-0 w-full list-none pb-3"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  {isActive ? (
                    <div className="rounded-lg border border-dashed border-brand-orange/50 bg-dark-card/70 px-3 py-2 text-sm text-brand-orange/80">
                      {field.label}
                    </div>
                  ) : null}
                  <DraggableField field={field} isMapped={isMapped} isDraggingHidden={isActive} />
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </section>
  )
}
