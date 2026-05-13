import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailMobileBar } from './RouteDetailMobileBar'
import { routes } from '@/data/routes'

const meta = {
  title: 'Organisms/RouteDetailMobileBar',
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
    title: routes[0].title,
    distance: routes[0].distance,
    duration: routes[0].duration,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(routes[0].title)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /dela/i })).toBeInTheDocument()
  },
}
