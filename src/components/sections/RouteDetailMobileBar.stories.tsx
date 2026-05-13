import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailMobileBar } from './RouteDetailMobileBar'
import { routes } from '@/data/routes'

const firstRoute = routes[0]

if (!firstRoute) {
  throw new Error('Expected at least one route fixture for RouteDetailMobileBar stories.')
}

const meta = {
  title: 'Sections/RouteDetailMobileBar',
  component: RouteDetailMobileBar,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteDetailMobileBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: firstRoute.title,
    distance: firstRoute.distance,
    duration: firstRoute.duration,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(firstRoute.title)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /dela/i })).toBeInTheDocument()
  },
}
