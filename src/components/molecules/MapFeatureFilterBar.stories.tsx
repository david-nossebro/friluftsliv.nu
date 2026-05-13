import type { Meta, StoryObj } from '@storybook/react'
import { MapFeatureFilterBar } from './MapFeatureFilterBar'
import * as React from 'react'

const SAMPLE_FILTERS = [
  { type: 'vandring', label: 'Vandring', icon: '🥾', count: 142 },
  { type: 'stuga', label: 'Stugor', icon: '🏡', count: 38 },
  { type: 'eldplats', label: 'Eldplatser', icon: '🔥', count: 67 },
  { type: 'badplats', label: 'Badplatser', icon: '🏊', count: 29 },
  { type: 'vindskydd', label: 'Vindskydd', icon: '⛺', count: 15 },
  { type: 'naturreservat', label: 'Naturreservat', icon: '🌿', count: 54 },
  { type: 'parkering', label: 'Parkering', icon: '🚗', count: 88 },
]

const meta = {
  title: 'Molecules/MapFeatureFilterBar',
  component: MapFeatureFilterBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  // Default args to satisfy Storybook's required-args check
  args: {
    filters: SAMPLE_FILTERS,
    activeTypes: [],
    onChange: () => {},
  },
} satisfies Meta<typeof MapFeatureFilterBar>

export default meta
type Story = StoryObj<typeof meta>

type FilterList = typeof SAMPLE_FILTERS

function Controlled({
  initialTypes = [],
  filters = SAMPLE_FILTERS,
  showStatus = true,
}: {
  initialTypes?: string[]
  filters?: FilterList
  showStatus?: boolean
}) {
  const [activeTypes, setActiveTypes] = React.useState<string[]>(initialTypes)
  return (
    <div className="bg-white/90 border-t border-mist-dark py-3">
      <MapFeatureFilterBar
        filters={filters}
        activeTypes={activeTypes}
        onChange={setActiveTypes}
      />
      {showStatus && (
        <p className="font-body text-2xs text-stone mt-2 px-4">
          Aktiva: {activeTypes.length === 0 ? 'alla' : activeTypes.join(', ')}
        </p>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <Controlled />,
}

export const WithSomeActive: Story = {
  name: 'Some Types Active',
  render: () => <Controlled initialTypes={['vandring', 'stuga']} />,
}

export const SingleActive: Story = {
  name: 'Single Type Active',
  render: () => <Controlled initialTypes={['eldplats']} />,
}

const FEW_FILTERS: FilterList = [
  { type: 'stuga', label: 'Stuga', icon: '🏡', count: 1 },
  { type: 'vandring', label: 'Rutter', icon: '🥾', count: 4 },
]

export const FewFilters: Story = {
  name: 'Few Filters (cabin detail)',
  render: () => <Controlled filters={FEW_FILTERS} showStatus={false} />,
}

const MANY_FILTERS: FilterList = [
  ...SAMPLE_FILTERS,
  { type: 'cykel', label: 'Cykelleder', icon: '🚴', count: 31 },
  { type: 'paddeltur', label: 'Paddelleder', icon: '🛶', count: 12 },
  { type: 'restaurang', label: 'Restauranger', icon: '🍽️', count: 22 },
]

export const ManyFilters: Story = {
  name: 'Many Filters (wraps on desktop)',
  decorators: [(Story) => <div className="w-full max-w-[800px]"><Story /></div>],
  render: () => <Controlled filters={MANY_FILTERS} showStatus={false} />,
}
