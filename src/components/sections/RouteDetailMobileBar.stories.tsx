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
  decorators: [
    (Story) => (
      // Push the bar into view in Storybook — the real component hides until
      // the user has scrolled past the hero, but inside a story we want it
      // visible immediately for inspection.
      <div style={{ minHeight: '120vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RouteDetailMobileBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: firstRoute.title,
    gpxUrl: '#',
  },
  play: async ({ canvasElement }) => {
    // The bar starts hidden (slides in once the user scrolls past the hero),
    // so assert rendered DOM text rather than role-based queries that read the
    // accessibility tree.
    const canvas = within(canvasElement)
    await expect(canvas.getByText(firstRoute.title)).toBeInTheDocument()
    await expect(canvas.getByLabelText(/dela/i)).toBeInTheDocument()
  },
}

export const WithoutGpx: Story = {
  args: {
    title: firstRoute.title,
  },
}
