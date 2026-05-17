import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { AreaDetailPage } from './AreaDetailPage'
import { getAreaById, getAreaRoutesByCategory, getCabinsForAreaId } from '@/data'

const area = getAreaById('soderasen')
const groupedArea = getAreaById('abisko')

if (!area) {
  throw new Error('Expected seeded area fixture for AreaDetailPage stories.')
}

if (!groupedArea) {
  throw new Error('Expected seeded Abisko fixture for grouped hiking story.')
}

const meta = {
  title: 'Sections/AreaDetailPage',
  component: AreaDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AreaDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    area,
    cabins: getCabinsForAreaId(area.id),
    hikingRoutes: getAreaRoutesByCategory(area.id, 'vandring'),
    mountainRoutes: getAreaRoutesByCategory(area.id, 'fjallvandring'),
    canoeRoutes: getAreaRoutesByCategory(area.id, 'kanot'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: area.title })).toBeInTheDocument()
    await expect(canvas.getByText('Utforska i området')).toBeInTheDocument()
  },
}

export const NatureReserve: Story = {
  args: {
    area: getAreaById('nackareservatet') ?? area,
    cabins: getCabinsForAreaId('nackareservatet'),
    hikingRoutes: getAreaRoutesByCategory('nackareservatet', 'vandring'),
    mountainRoutes: getAreaRoutesByCategory('nackareservatet', 'fjallvandring'),
    canoeRoutes: getAreaRoutesByCategory('nackareservatet', 'kanot'),
  },
}

export const GroupedHikingPreview: Story = {
  args: {
    area: groupedArea,
    cabins: getCabinsForAreaId(groupedArea.id),
    hikingRoutes: getAreaRoutesByCategory('soderasen', 'vandring'),
    mountainRoutes: getAreaRoutesByCategory(groupedArea.id, 'fjallvandring'),
    canoeRoutes: getAreaRoutesByCategory(groupedArea.id, 'kanot'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Vandring' }))
    await expect(
      canvas.getByText('Hoppa direkt till den typ av vandring du vill utforska i området.'),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /fjällvandring/i })).toBeInTheDocument()
  },
}
