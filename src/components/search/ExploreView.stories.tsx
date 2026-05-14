import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ExploreView } from './ExploreView'
import { cabins, getAreaListItems, routes } from '@/data'

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
    cabins,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expectedOrder = [
      'Vandring',
      'Fjällvandring',
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
    await userEvent.type(
      canvas.getByRole('searchbox', { name: /sök stuga, tur eller område/i }),
      'Abisko',
    )

    await expect(canvas.getByText('Kungsleden — Abisko till Nikkaluokta')).toBeInTheDocument()
    await expect(canvas.queryByText('Söderåsen vandrarhem')).not.toBeInTheDocument()
  },
}

export const PreFilteredMountainHikes: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    cabins,
    initialTab: 'fjallvandring',
  },
}

export const ProtectedAreasOnly: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    cabins,
    initialTab: 'nationalparker',
  },
}

export const NoResults: Story = {
  args: {
    areas: getAreaListItems(),
    routes,
    cabins,
    initialQuery: 'finns inte',
  },
}
