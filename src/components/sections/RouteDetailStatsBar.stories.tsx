import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailStatsBar } from './RouteDetailStatsBar'
import { routes } from '@/data/routes'

const meta = {
  title: 'Sections/RouteDetailStatsBar',
  component: RouteDetailStatsBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteDetailStatsBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    route: routes[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Distans')).toBeInTheDocument()
    await expect(canvas.getByText('Höjdmeter')).toBeInTheDocument()
    await expect(canvas.getByText('Säsong')).toBeInTheDocument()
  },
}

export const RoundTrip: Story = {
  args: {
    route: routes.find((route) => route.isRoundTrip)!,
  },
}
