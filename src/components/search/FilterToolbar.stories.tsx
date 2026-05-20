import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { FilterToolbar } from './FilterToolbar'
import { Button } from '@/components/ui/button'
import { defaultFilterState, getApplicableFilters, type FilterState } from '@/lib/exploreFilters'

function Wrapper({ initial, count }: { initial: FilterState; count: number }) {
  const [state, setState] = React.useState(initial)
  return (
    <div className="p-6 bg-snow">
      <FilterToolbar
        state={state}
        patch={(p) => setState((prev) => ({ ...prev, ...p }))}
        reset={() => setState({ ...defaultFilterState, tab: state.tab, query: state.query })}
        applicable={getApplicableFilters(initial.tab)}
        count={count}
        mobileTrigger={
          <Button type="button" variant="secondary" size="md">
            Filtrera
          </Button>
        }
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/FilterToolbar',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { initial: defaultFilterState, count: 42 },
}

export const WithActivePills: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['easy', 'medium'],
      landskap: ['lappland'],
      months: ['juni', 'juli'],
      dogsAllowed: true,
    },
    count: 9,
  },
}

export const ManyPills: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['easy', 'medium', 'hard'],
      landskap: ['skane', 'lappland', 'jamtland', 'dalarna'],
      months: ['juni', 'juli', 'augusti'],
      dogsAllowed: true,
      hasCabinsAlong: true,
      routeShape: 'roundtrip',
      publicTransport: true,
      distanceMinKm: 5,
      distanceMaxKm: 80,
      durationMin: 6,
      durationMax: 72,
    },
    count: 3,
  },
}
