import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Sheet } from '@/components/ui/sheet'
import { FilterSheetPanel } from './FilterSheetPanel'
import {
  defaultFilterState,
  getApplicableFilters,
  type FilterState,
} from '@/lib/exploreFilters'
import type { ExploreTab } from '@/types'

function Wrapper({
  initial,
  tab = 'alla',
  surface = 'mobile',
  resultCount = 24,
}: {
  initial: FilterState
  tab?: ExploreTab
  surface?: 'mobile' | 'desktop'
  resultCount?: number
}) {
  const [state, setState] = React.useState({ ...initial, tab })

  const panel = (
    <div
      className={
        surface === 'desktop'
          ? 'h-[700px] w-[24rem] border border-mist-dark shadow-lg'
          : 'h-[85vh] max-w-sm'
      }
    >
      <FilterSheetPanel
        state={state}
        patch={(p) => setState((prev) => ({ ...prev, ...p }))}
        applicable={getApplicableFilters(tab)}
        resultCount={resultCount}
        onClose={() => {}}
        surface={surface}
      />
    </div>
  )

  // SheetTitle/SheetDescription require a Radix Dialog context (provided by Sheet).
  return <Sheet open>{panel}</Sheet>
}

const meta = {
  title: 'Search/Filters/FilterSheetPanel',
  component: Wrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  args: { initial: defaultFilterState, tab: 'alla', surface: 'mobile', resultCount: 24 },
}

export const Desktop: Story = {
  args: { initial: defaultFilterState, tab: 'alla', surface: 'desktop', resultCount: 24 },
}

export const MobileWithActiveFilters: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['easy', 'medium'],
      dogsAllowed: true,
      months: ['juni', 'juli'],
    },
    tab: 'vandring',
    surface: 'mobile',
    resultCount: 8,
  },
}

export const DesktopStugorTab: Story = {
  args: { initial: defaultFilterState, tab: 'stugor', surface: 'desktop', resultCount: 5 },
}
