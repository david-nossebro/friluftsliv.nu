import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { MapSidebar, type MapSidebarFilters } from './MapSidebar'

const meta = {
  title: 'Organisms/MapSidebar',
  component: MapSidebar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MapSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-[600px] flex">
      <MapSidebar resultCount={42} />
      <div className="flex-1 bg-mist flex items-center justify-center text-stone font-body text-sm">
        Karta
      </div>
    </div>
  ),
}

const WithFiltersDemo = () => {
  const [filters, setFilters] = useState<MapSidebarFilters>({
    activities: ['vandring', 'skidtur'],
    difficulties: ['medium'],
    query: 'Abisko',
  })

  return (
    <div className="h-[600px] flex">
      <MapSidebar
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={8}
      />
      <div className="flex-1 bg-mist flex items-center justify-center text-stone font-body text-sm">
        Aktiviteter: {filters.activities.length} · Svårighet: {filters.difficulties.length} · Söker: {filters.query || '—'}
      </div>
    </div>
  )
}

export const WithFilters: Story = {
  render: () => <WithFiltersDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Rensa' }))

    await expect(canvas.getByText(/aktiviteter: 0/i)).toBeInTheDocument()
    await expect(canvas.getByText(/svårighet: 0/i)).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Rensa' })).not.toBeInTheDocument()
  },
}

const MobileOpenDemo = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="relative h-[600px] overflow-hidden bg-mist">
      <MapSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        filters={{ activities: ['vandring'], difficulties: ['medium'], query: 'Abisko' }}
        resultCount={8}
      />
      <div className="absolute inset-0 flex items-center justify-center text-stone font-body text-sm">
        Panel: {isOpen ? 'öppen' : 'stängd'}
      </div>
    </div>
  )
}

export const MobileOpen: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => <MobileOpenDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /stäng filter/i }))

    await expect(canvas.getByText(/panel: stängd/i)).toBeInTheDocument()
  },
}
