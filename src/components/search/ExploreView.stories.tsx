import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ExploreView } from './ExploreView'
import { cabins, getAreaListItems, longHikes, routes, utflykter } from '@/data'

const meta = {
  title: 'Search/ExploreView',
  component: ExploreView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
  },
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

    await userEvent.click(canvas.getByRole('button', { name: 'Vandring' }))
    await expect(canvas.getAllByText('Kungsleden — Abisko till Nikkaluokta')).toHaveLength(2)
    await expect(canvas.getByRole('heading', { name: 'Långvandring' })).toBeInTheDocument()
    await expect(canvas.queryByText('Söderåsen vandrarhem')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument()
  },
}

export const PreFilteredHiking: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
    initialTab: 'vandring',
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
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /kategori: alla/i }))
    await userEvent.click(canvas.getByRole('button', { name: 'Vandring' }))

    await expect(canvas.getAllByText('Kungsleden — Abisko till Nikkaluokta')).toHaveLength(2)
    await expect(canvas.getByRole('heading', { name: 'Långvandring' })).toBeInTheDocument()
    await expect(canvas.queryByText('Söderåsen vandrarhem')).not.toBeInTheDocument()
  },
}

export const PreFilteredCanoe: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
    initialTab: 'kanot',
  },
}

export const PreFilteredUtflykter: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
    initialTab: 'utflykter',
  },
}

export const ProtectedAreasOnly: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
    initialTab: 'nationalparker',
  },
}

export const NoResults: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
    initialQuery: 'finns inte',
  },
}

export const QueryFromHeaderSearch: Story = {
  args: {
    areas: getAreaListItems(),
    utflykter,
    routes,
    longHikes,
    cabins,
    initialQuery: 'Abisko',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByText('Kungsleden — Abisko till Nikkaluokta')).toHaveLength(2)
    await expect(canvas.getByRole('heading', { name: 'Långvandring' })).toBeInTheDocument()
    await expect(canvas.queryByText('Söderåsen vandrarhem')).not.toBeInTheDocument()
  },
}
