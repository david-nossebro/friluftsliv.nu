import type { Meta, StoryObj } from '@storybook/react'
import { MapLayerToggle } from './MapLayerToggle'
import { DEFAULT_MAP_LAYERS } from '@/types'
import * as React from 'react'

const meta = {
  title: 'Molecules/MapLayerToggle',
  component: MapLayerToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // Default args so Storybook's required-args checker is satisfied
  args: {
    layers: DEFAULT_MAP_LAYERS,
    activeLayerId: 'osm',
    onLayerChange: () => {},
  },
} satisfies Meta<typeof MapLayerToggle>

export default meta
type Story = StoryObj<typeof meta>

function Controlled({ initialLayerId = 'osm' }: { initialLayerId?: string }) {
  const [activeLayerId, setActiveLayerId] = React.useState(initialLayerId)
  return (
    <div className="relative p-8 bg-sky/20 rounded-xl">
      <p className="font-body text-xs text-stone mb-4 text-center">
        Aktiv lager: <strong>{activeLayerId}</strong>
      </p>
      <MapLayerToggle
        layers={DEFAULT_MAP_LAYERS}
        activeLayerId={activeLayerId}
        onLayerChange={setActiveLayerId}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const TopoActive: Story = {
  name: 'Topo Layer Active',
  render: () => <Controlled initialLayerId="topo" />,
}

export const SatelliteActive: Story = {
  name: 'Satellite Layer Active',
  render: () => <Controlled initialLayerId="satellite" />,
}

function TwoLayersDemo() {
  const [activeLayerId, setActiveLayerId] = React.useState('osm')
  return (
    <MapLayerToggle
      layers={DEFAULT_MAP_LAYERS.slice(0, 2)}
      activeLayerId={activeLayerId}
      onLayerChange={setActiveLayerId}
    />
  )
}

export const TwoLayers: Story = {
  name: 'Two Layers Only',
  render: () => <TwoLayersDemo />,
}
