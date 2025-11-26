import { DndContext } from '@dnd-kit/core'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DraggableField } from './DraggableField'
import { SchemaField } from '@/features/mapper/types'

const renderWithDnd = (field: SchemaField) => {
  return render(
    <DndContext>
      <DraggableField field={field} />
    </DndContext>,
  )
}

describe('DraggableField', () => {
  const stringField: SchemaField = {
    id: 'name',
    label: 'Name',
    type: 'string',
    required: true,
  }

  it('renders the text label', () => {
    renderWithDnd(stringField)

    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('applies the correct badge color for string type', () => {
    renderWithDnd(stringField)

    const badges = screen.getAllByText('string')
    badges.forEach((badge) => {
      expect(badge).toHaveClass('bg-brand-blue/80')
      expect(badge).toHaveClass('text-gray-200')
    })
  })
})
