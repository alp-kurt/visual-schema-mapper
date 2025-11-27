import { PageHeader } from '@/components/ui/PageHeader'

interface MapperHeaderProps {
  mappedCount: number
  onSave: () => Promise<void>
  isSaving: boolean
}

export const MapperHeader = ({ mappedCount, onSave, isSaving }: MapperHeaderProps) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <PageHeader title="Visual Schema Mapper" subtitle="Drag source fields into the target schema" />
    <div className="flex items-center gap-3">
      <p className="text-sm text-blue-200">{mappedCount} mapped</p>
      <button
        type="button"
        onClick={onSave}
        disabled={mappedCount === 0 || isSaving}
        className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-brand-orange/30 transition enabled:shadow-lg enabled:hover:bg-brand-orange/90 disabled:cursor-not-allowed disabled:bg-brand-orange/40"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  </div>
)
