import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within, waitFor } from '@storybook/test'
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
    <div className="min-h-[56rem] bg-snow">
      <div className="mx-auto flex max-w-[1200px] justify-end px-6 pt-8">
        <div className="relative z-[60] hidden items-center py-3 lg:flex">
          <FilterDrawer variant="desktop"
            state={state}
            patch={(p) => setState((prev) => ({ ...prev, ...p }))}
            applicable={getApplicableFilters(tab)}
            resultCount={resultCount}
          />
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: 'Search/Filters/FilterDrawer/Desktop',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { initial: defaultFilterState, tab: 'alla', resultCount: 42 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)

    await userEvent.click(canvas.getByRole('button', { name: /öppna filter/i }))
    await expect(page.getByRole('heading', { name: 'Filter' })).toBeInTheDocument()
    await expect(page.getByRole('button', { name: /visa 42 resultat/i })).toBeInTheDocument()

    // Regression: pressing the same trigger while open must close the drawer,
    // not reopen it (Radix DismissableLayer must ignore the trigger element).
    await userEvent.click(canvas.getByRole('button', { name: /stäng filter/i }))
    await waitFor(() =>
      expect(page.queryByRole('heading', { name: 'Filter' })).not.toBeInTheDocument(),
    )
  },
}

export const WithActiveFilters: Story = {
  args: {
    initial: {
      ...defaultFilterState,
      difficulty: ['easy', 'medium'],
      dogsAllowed: true,
      months: ['juni', 'juli'],
      landskap: ['skane', 'dalarna'],
    },
    tab: 'vandring',
    resultCount: 8,
  },
}

export const WithNearMeActive: Story = {
  args: {
    initial: { ...defaultFilterState, nearMe: true, landskap: ['skane'] },
    tab: 'alla',
    resultCount: 5,
  },
}
