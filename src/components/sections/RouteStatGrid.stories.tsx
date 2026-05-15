import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteStatGrid } from './RouteStatGrid'
import { buildLongHikeStats, buildRouteStats } from '@/lib/routeStats'
import { routes } from '@/data/routes'
import { longHikes, getStagesForLongHike } from '@/data'

const firstRoute = routes[0]
const firstLongHike = longHikes[0]

if (!firstRoute || !firstLongHike) {
  throw new Error('Expected seeded fixtures for RouteStatGrid stories.')
}

const stagesForFirst = getStagesForLongHike(firstLongHike.id)

const meta = {
  title: 'Sections/RouteStatGrid',
  component: RouteStatGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteStatGrid>

export default meta
type Story = StoryObj<typeof meta>

export const SingleDayRoute: Story = {
  args: {
    stats: buildRouteStats(firstRoute),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Distans')).toBeInTheDocument()
    await expect(canvas.getByText('Höjdmeter')).toBeInTheDocument()
  },
}

export const LongHike: Story = {
  args: {
    stats: buildLongHikeStats(firstLongHike, stagesForFirst.length),
  },
}

export const ThreeStats: Story = {
  args: {
    stats: [
      { label: 'Distans', value: '14.5 km', sublabel: 'Enkel väg' },
      { label: 'Höjdmeter', value: '180 m' },
      { label: 'Tid', value: '4 h' },
    ],
  },
}
