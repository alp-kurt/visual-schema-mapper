import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useSchema } from './hooks/useSchema'
import { useSaveMapping } from './hooks/useSaveMapping'
import { useMapperStore } from './store/mapperStore'
import { Analytics } from '@/services/analytics'
import { MapperHeader } from './components/MapperHeader'
import { SourceFieldColumn } from './components/SourceFieldColumn'
import { TargetFieldColumn } from './components/TargetFieldColumn'
import { useTargetToSourceMap } from './hooks/useTargetToSourceMap'
import { useSaveMappingsAction } from './hooks/useSaveMappingsAction'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const MapperCanvas = () => {
  const { data: schema, isLoading: schemaLoading } = useSchema()
  const mappings = useMapperStore((state) => state.mappings)
  const addMapping = useMapperStore((state) => state.addMapping)
  const removeMapping = useMapperStore((state) => state.removeMapping)
  const { mutateAsync: saveMappings, isPending: savingMappings } = useSaveMapping()
  const sensors = useSensors(useSensor(PointerSensor))
  const [invalidTargetId, setInvalidTargetId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const targetToSourceMap = useTargetToSourceMap(mappings)

  const sourceFields = useMemo(() => schema?.sourceFields ?? [], [schema?.sourceFields])
  const targetFields = useMemo(() => schema?.targetFields ?? [], [schema?.targetFields])
  const activeSource = useMemo(
    () => sourceFields.find((field) => field.id === activeId) ?? null,
    [activeId, sourceFields],
  )
  const handleSaveMappings = useSaveMappingsAction(mappings, saveMappings)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  /**
   * Validate a drag-and-drop attempt and surface errors on the offending target slot.
   * Guard clauses exit early to keep the control flow obvious during drag interactions.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) return

    const activeSourceId = String(active.id)
    const targetId = String(over.id)

    const validation = addMapping(activeSourceId, targetId)

    if (!validation.valid) {
      setInvalidTargetId(targetId)
      setTimeout(() => setInvalidTargetId(null), 800)
      toast.error('Incompatible Types')
      return
    }

    setInvalidTargetId(null)
    Analytics.track('MAPPING_SUCCESS', { source: activeSourceId, target: targetId })
  }

  const handleDragCancel = () => setActiveId(null)

  if (schemaLoading) {
    return <LoadingSpinner label="Loading schema..." />
  }

  return (
    <div className="space-y-6">
      <MapperHeader mappedCount={mappings.length} onSave={handleSaveMappings} isSaving={savingMappings} />
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SourceFieldColumn fields={sourceFields} mappings={mappings} activeSourceId={activeId} />
          <TargetFieldColumn
            fields={targetFields}
            sourceFields={sourceFields}
            targetToSourceMap={targetToSourceMap}
            invalidTargetId={invalidTargetId}
            onRemove={removeMapping}
          />
        </div>
        <DragOverlay>
          {activeSource ? (
            <Card className="flex items-center justify-between px-4 py-4 shadow-2xl shadow-brand-orange/20 ring-2 ring-brand-orange/40">
              <div className="flex flex-col text-sm font-medium text-gray-50">
                <span>{activeSource.label}</span>
                <span className="text-xs text-blue-200">{activeSource.id}</span>
              </div>
              <Badge variant={activeSource.type}>{activeSource.type}</Badge>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
