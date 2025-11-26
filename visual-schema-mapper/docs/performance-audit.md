# Mapper Performance Audit

## Top Issues (Ranked by Impact)

1. **Store subscriptions cause global re-renders (High).** `MapperCanvas` pulls the entire Zustand store (`mappings`, `addMapping`, `removeMapping`) without selectors, so the canvas and both columns re-render whenever *any* store property changes. The source column then recomputes `isMapped` for every field, and the target grid recalculates every mapped pill, amplifying unnecessary work as lists grow. 【F:src/features/mapper/MapperCanvas.tsx†L27-L114】
2. **No list virtualization for large schemas (High).** `SourceFieldColumn` renders every source field directly in a scrollable `<ul>` with no virtualization. A Tradebyte-scale feed (thousands of fields) would create thousands of DOM nodes and `DraggableField` instances, making drag move events janky. 【F:src/features/mapper/components/SourceFieldColumn.tsx†L11-L39】
3. **Inline props prevent memoization efficiency (Medium).** The source and target lists pass new inline objects on every render (`style={{ maxHeight: '70vh' }}`, `style={{ gridTemplateColumns: '...' }}`) and inline arrow callbacks inside map iterations, which break shallow props equality for memoized children and defeat `React.memo` optimizations in large lists. 【F:src/features/mapper/components/SourceFieldColumn.tsx†L20-L35】【F:src/features/mapper/components/TargetFieldColumn.tsx†L34-L53】

## Critical Fix – Narrow Zustand Selectors (Before vs After)

**Before (global subscription):**
```tsx
// MapperCanvas.tsx
const { mappings, addMapping, removeMapping } = useMapperStore()
const handleSaveMappings = useSaveMappingsAction(mappings, saveMappings)
```

**After (selector-based, stable callbacks):**
```tsx
// MapperCanvas.tsx
const mappings = useMapperStore((state) => state.mappings)
const addMapping = useMapperStore((state) => state.addMapping)
const removeMapping = useMapperStore((state) => state.removeMapping)
const handleSaveMappings = useSaveMappingsAction(mappings, saveMappings)
```
Each component now re-renders only when its *own* slice changes (e.g., `TargetFieldColumn` only re-renders when `mappings` change), eliminating canvas-level churn during drag events.

## Virtualization Strategy (Source Column)

Use `@tanstack/react-virtual` to window the source list so only visible items render:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

const parentRef = useRef<HTMLUListElement | null>(null)
const rowVirtualizer = useVirtualizer({
  count: fields.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 64, // avg row height
})

<ul
  ref={parentRef}
  className="scrollbar-hide overflow-y-auto pr-1"
  style={{ maxHeight: '70vh', position: 'relative', height: rowVirtualizer.getTotalSize() }}
>
  {rowVirtualizer.getVirtualItems().map(({ key, index, start, size }) => {
    const field = fields[index]
    const isMapped = mappings.some((mapping) => mapping.sourceId === field.id)
    return (
      <li
        key={key}
        className="absolute left-0 right-0"
        style={{ transform: `translateY(${start}px)`, height: `${size}px` }}
      >
        <DraggableField field={field} isMapped={isMapped} />
      </li>
    )
  })}
</ul>
```
This keeps the DOM to ~20–40 visible rows while supporting thousands of source fields.
