import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ExploreView } from './ExploreView'
import { cabins, getAreaListItems, longHikes, routes } from '@/data'

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
    routes,
    longHikes,
    cabins,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expectedOrder = [
      'Vandring',
      'Fjällvandring',
      'Långvandring',
      'Kanotleder',
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

    await userEvent.click(canvas.getByRole('button', { name: 'Fjällvandring' }))
    await expect(canvas.getByText('Kungsleden — Abisko till Nikkaluokta')).toBeInTheDocument()
    await expect(canvas.queryByText('Söderåsen vandrarhem')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument()
  },
}

export const PreFilteredMountainHikes: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    longHikes,
    cabins,
    initialTab: 'fjallvandring',
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
    routes,
    longHikes,
    cabins,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /kategori: alla/i }))
    await userEvent.click(canvas.getByRole('button', { name: 'Fjällvandring' }))

    await expect(canvas.getByText('Kungsleden — Abisko till Nikkaluokta')).toBeInTheDocument()
    await expect(canvas.queryByText('Söderåsen vandrarhem')).not.toBeInTheDocument()
  },
}

export const PreFilteredLongDistanceHikes: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    longHikes,
    cabins,
    initialTab: 'langvandring',
  },
}

export const ProtectedAreasOnly: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    longHikes,
    cabins,
    initialTab: 'nationalparker',
  },
}

export const NoResults: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    longHikes,
    cabins,
    initialQuery: 'finns inte',
  },
}

export const QueryFromHeaderSearch: Story = {
  args: {
    areas: getAreaListItems(),
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
