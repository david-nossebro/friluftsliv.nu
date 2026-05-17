import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import * as React from 'react'
import { FilterDrawer } from './FilterDrawer'
import {
  defaultFilterState,
  getApplicableFilters,
  type FilterState,
} from '@/lib/exploreFilters'
import type { ExploreTab } from '@/types'

function Wrapper({
  initial,
  tab = 'alla',
  resultCount = 12,
}: {
  initial: FilterState
  tab?: ExploreTab
  resultCount?: number
}) {
  const [state, setState] = React.useState({ ...initial, tab })
  return (
    <div className="p-6 bg-snow">
      <FilterDrawer
        state={state}
        patch={(p) => setState((prev) => ({ ...prev, ...p }))}
        applicable={getApplicableFilters(tab)}
        resultCount={resultCount}
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/FilterDrawer',
  component: Wrapper,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { initial: defaultFilterState, tab: 'alla', resultCount: 42 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /filtrera/i }))
    // After opening, exactly one close button should exist in the document.
    const closeButtons = within(document.body).getAllByRole('button', { name: /stäng/i })
    await expect(closeButtons).toHaveLength(1)
  },
}

export const WithActiveFilters: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['easy'],
      dogsAllowed: true,
      landskap: ['skane'],
    },
    tab: 'vandring',
    resultCount: 7,
  },
}

export const CabinContext: Story = {
  args: {
    initial: defaultFilterState,
    tab: 'stugor',
    resultCount: 18,
  },
}
