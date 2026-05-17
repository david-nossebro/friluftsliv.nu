import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { FilterPanel } from './FilterPanel'
import {
  defaultFilterState,
  getApplicableFilters,
  type FilterState,
} from '@/lib/exploreFilters'
import type { ExploreTab } from '@/types'

function Wrapper({ initial, tab = 'alla' }: { initial: FilterState; tab?: ExploreTab }) {
  const [state, setState] = React.useState({ ...initial, tab })
  return (
    <div className="p-6 bg-snow">
      <div className="rounded-xl border border-mist-dark bg-white shadow-card p-5">
        <FilterPanel
          state={state}
          patch={(p) => setState((prev) => ({ ...prev, ...p }))}
          applicable={getApplicableFilters(tab)}
        />
      </div>
    </div>
  )
}

const meta = {
  title: 'Search/Filters/FilterPanel',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { initial: defaultFilterState, tab: 'alla' } }

export const VandringTab: Story = { args: { initial: defaultFilterState, tab: 'vandring' } }

export const StugorTab: Story = { args: { initial: defaultFilterState, tab: 'stugor' } }

export const AllFiltersActive: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['medium', 'hard'],
      routeShape: 'point-to-point',
      distanceMinKm: 20,
      distanceMaxKm: 150,
      landskap: ['lappland'],
      months: ['juni', 'juli', 'augusti'],
      publicTransport: 'reachable',
      dogsAllowed: true,
      hasCabinsAlong: true,
    },
    tab: 'vandring',
  },
}
