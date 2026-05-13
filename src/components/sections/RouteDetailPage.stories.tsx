import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailPage } from './RouteDetailPage'
import { RouteCardGrid } from '@/components/cards/RouteCardGrid'
import { routes } from '@/data/routes'
import type { Route } from '@/types'

const mockRoute = routes[0]
const tyresta = routes.find((r) => r.id === 'tyresta-runt')

if (!mockRoute || !tyresta) {
  throw new Error('Expected seeded route fixtures for RouteDetailPage stories.')
}

const { imageUrl: _imageUrl, images: _images, ...mockRouteWithoutImages } = mockRoute

const relatedRoutes: Route[] = routes
  .filter((r) => r.id !== mockRoute.id)
  .slice(0, 3)
  .map(({ id, title, region, activityType, distance, elevation, duration, difficulty, imageUrl }) => ({
    id,
    title,
    region,
    activityType,
    distance,
    elevation,
    duration,
    difficulty,
    ...(imageUrl ? { imageUrl } : {}),
  }))

const meta = {
  title: 'Sections/RouteDetailPage',
  component: RouteDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { route: mockRoute },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: mockRoute.title })).toBeInTheDocument()
    await expect(canvas.getByText('Distans')).toBeInTheDocument()
  },
}

export const WithRelatedRoutes: Story = {
  args: {
    route: mockRoute,
    relatedRoutes: (
      <RouteCardGrid
        title="Liknande rutter i området"
        routes={relatedRoutes}
        showMoreHref="/utforska?tab=rutter"
      />
    ),
  },
}

export const NoImage: Story = {
  args: {
    route: mockRouteWithoutImages,
  },
}

export const EasyDayHike: Story = {
  args: { route: tyresta },
}
