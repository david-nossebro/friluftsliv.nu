import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { MapView } from './MapView'
import type { MapFeatureLayer } from '@/types'

const mockLayers: MapFeatureLayer[] = [
  {
    type: 'route',
    label: 'Rutter',
    color: '#2C4A3E',
    markers: [
      {
        id: 'kungsleden',
        position: { lat: 68.353, lng: 18.82 },
        type: 'route',
        label: 'Kungsleden',
        description: 'Lappland',
      },
      {
        id: 'tyresta',
        position: { lat: 59.167, lng: 18.278 },
        type: 'route',
        label: 'Tyresta runt',
        description: 'Stockholms län',
      },
      {
        id: 'soderasen',
        position: { lat: 56.042, lng: 13.238 },
        type: 'route',
        label: 'Söderåsen',
        description: 'Skåne',
      },
    ],
  },
  {
    type: 'cabin',
    label: 'Stugor',
    color: '#D97B4F',
    markers: [
      {
        id: 'sylarna',
        position: { lat: 63.042, lng: 12.215 },
        type: 'cabin',
        label: 'Sylarna fjällstation',
        description: 'Jämtland',
      },
      {
        id: 'helags',
        position: { lat: 62.918, lng: 12.447 },
        type: 'cabin',
        label: 'Helags fjällstation',
        description: 'Härjedalen',
      },
    ],
  },
]

const meta = {
  title: 'Map/MapView',
  component: MapView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MapView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { featureLayers: mockLayers },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(
      canvas.getByRole('searchbox', { name: /sök plats/i }),
      'Jämtland',
    )

    await expect(canvas.getByRole('button', { name: /visa 1 resultat/i })).toBeInTheDocument()
  },
}

export const ZoomedToJamtland: Story = {
  args: {
    featureLayers: mockLayers,
    initialCenter: { lat: 63.0, lng: 13.0 },
    initialZoom: 8,
  },
}
