import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AreaDetailPage } from './AreaDetailPage'
import { getAreaById, getAreaRoutesByCategory, getCabinsForAreaId } from '@/data'

const area = getAreaById('soderasen')

if (!area) {
  throw new Error('Expected seeded area fixture for AreaDetailPage stories.')
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
    canoeRoutes: getAreaRoutesByCategory(area.id, 'kanotleder'),
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
    canoeRoutes: getAreaRoutesByCategory('nackareservatet', 'kanotleder'),
  },
}
