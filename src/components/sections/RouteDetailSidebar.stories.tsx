import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailSidebar } from './RouteDetailSidebar'
import { routes } from '@/data/routes'

const meta = {
  title: 'Sections/RouteDetailSidebar',
  component: RouteDetailSidebar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteDetailSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    route: routes[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: /ladda ned gpx/i })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /dela rutten/i })).toBeInTheDocument()
  },
}

export const WithoutDownload: Story = {
  args: {
    route: {
      ...routes[0],
      gpxUrl: undefined,
    },
  },
}
