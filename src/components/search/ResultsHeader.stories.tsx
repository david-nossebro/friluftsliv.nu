import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { ResultsHeader } from './ResultsHeader'
import { defaultFilterState, type FilterState } from '@/lib/exploreFilters'

function Wrapper({ initial, count }: { initial: FilterState; count: number }) {
  const [state, setState] = React.useState(initial)
  return (
    <div className="p-4 bg-snow max-w-[640px]">
      <ResultsHeader
        state={state}
        patch={(p) => setState((prev) => ({ ...prev, ...p }))}
        count={count}
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/ResultsHeader',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Zero: Story = {
  args: { initial: defaultFilterState, count: 0 },
}

export const FewWithoutActiveFilters: Story = {
  args: { initial: defaultFilterState, count: 3 },
}

export const ManyWithActivePills: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['easy', 'medium'],
      landskap: ['lappland', 'jamtland'],
      months: ['juni', 'juli'],
      dogsAllowed: true,
      hasCabinsAlong: true,
      routeShape: 'roundtrip',
      publicTransport: 'reachable',
      distanceMinKm: 5,
      distanceMaxKm: 80,
    },
    count: 14,
  },
}
