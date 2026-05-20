import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { ResultsHeader } from './ResultsHeader'
import { defaultFilterState, getApplicableFilters, type FilterState } from '@/lib/exploreFilters'

function Wrapper({ initial, count }: { initial: FilterState; count: number }) {
  const [state, setState] = React.useState(initial)
  return (
    <div className="p-4 bg-snow max-w-[640px]">
      <ResultsHeader
        state={state}
        patch={(p) => setState((prev) => ({ ...prev, ...p }))}
        reset={() => setState({ ...defaultFilterState, tab: state.tab, query: state.query })}
        applicable={getApplicableFilters(initial.tab)}
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
      hikeType: ['fjallvandring', 'langvandring'],
      landskap: ['lappland', 'jamtland'],
      months: ['juni', 'juli'],
      dogsAllowed: true,
      hasCabinsAlong: true,
      routeShape: 'roundtrip',
      publicTransport: true,
      distanceMinKm: 5,
      distanceMaxKm: 80,
      durationMin: 6,
      durationMax: 72,
    },
    count: 14,
  },
}
