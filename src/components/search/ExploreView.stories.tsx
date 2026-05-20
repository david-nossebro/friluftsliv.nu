import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ExploreView } from './ExploreView'
import { defaultFilterState } from '@/lib/exploreFilters'
import { cabins, getAreaListItems, longHikes, routes, utflykter } from '@/data'

const meta = {
  title: 'Search/ExploreView',
  component: ExploreView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreView>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  areas: getAreaListItems(),
  utflykter,
  routes,
  longHikes,
  cabins,
}

export const Default: Story = {
  args: baseArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expectedOrder = [
      'Utflykter',
      'Vandring',
      'Fjällvandring',
      'Långvandring',
      'Kanot',
      'Skidturer',
      'Stugor',
      'Nationalparker',
      'Naturreservat',
    ]

    const sectionHeadings = canvas
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent?.trim())
      .filter((heading): heading is string => expectedOrder.includes(heading ?? ''))

    await expect(sectionHeadings).toEqual(expectedOrder)
  },
}

export const PreFilteredHiking: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, tab: 'vandring' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Hoppa direkt till den typ av vandring du vill utforska.')).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /fjällvandring/i })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /långvandring/i })).toBeInTheDocument()
  },
}

export const MobileFilters: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: baseArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /kategori: alla/i }))
    await userEvent.click(canvas.getByRole('button', { name: 'Vandring' }))
  },
}

export const PreFilteredCanoe: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, tab: 'kanot' },
  },
}

export const PreFilteredUtflykter: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, tab: 'utflykter' },
  },
}

export const ProtectedAreasOnly: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, tab: 'nationalparker' },
  },
}

export const NoResults: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, query: 'finns inte' },
  },
}

export const QueryFromHeaderSearch: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, query: 'Abisko' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText(/Abisko/i)).toBeTruthy()
  },
}

export const DesktopFiltersCollapsed: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, tab: 'vandring' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)

    await expect(canvas.getByRole('button', { name: /öppna filter/i })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /öppna filter/i }))
    await expect(page.getByRole('heading', { name: 'Filter' })).toBeInTheDocument()
    await expect(page.getByRole('button', { name: /stäng filter/i })).toBeInTheDocument()
  },
}

export const WithLandskapFilter: Story = {
  args: {
    ...baseArgs,
    initialState: { ...defaultFilterState, landskap: ['lappland'] },
  },
}

export const WithLandskapSelected: Story = {
  args: {
    ...baseArgs,
    initialState: {
      ...defaultFilterState,
      landskap: ['skane', 'gotland', 'dalarna'],
    },
  },
}

export const WithNearMeActive: Story = {
  args: {
    ...baseArgs,
    initialState: {
      ...defaultFilterState,
      nearMe: true,
      // Preserved while Nära mig is on; reactivates when toggled off.
      landskap: ['skane'],
    },
  },
}

export const WithDifficultyAndDogs: Story = {
  args: {
    ...baseArgs,
    initialState: {
      ...defaultFilterState,
      difficulty: ['easy', 'medium'],
      dogsAllowed: true,
    },
  },
}
