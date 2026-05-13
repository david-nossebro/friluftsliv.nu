import type { Meta, StoryObj } from '@storybook/react'
import { MapLayout } from './MapLayout'
import { LeafletMap } from '@/components/molecules/LeafletMap'

const meta = {
  title: 'Layout/MapLayout',
  component: MapLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MapLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFilters: Story = {
  args: {
    sidebarProps: {
      filters: { activities: ['vandring'], difficulties: ['easy'], query: '' },
      resultCount: 23,
    },
  },
}

export const WithLeafletMap: Story = {
  args: {
    sidebarProps: {
      filters: { activities: [], difficulties: [], query: '' },
      resultCount: 16,
    },
    mapSlot: (
      <LeafletMap
        height="100%"
        showFullscreenToggle={false}
        className="h-full w-full rounded-none border-0"
      />
    ),
  },
}
