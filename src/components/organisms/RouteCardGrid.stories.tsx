import type { Meta, StoryObj } from '@storybook/react'
import { RouteCardGrid } from './RouteCardGrid'
import type { Route } from '@/types'

const mockRoutes: Route[] = [
  {
    id: '1',
    title: 'Kungsleden — Abisko till Nikkaluokta',
    region: 'Lapplandsfjällen, Norrbotten',
    activityType: 'vandring',
    distance: 110,
    elevation: 2400,
    duration: 300,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=520&q=70&auto=format',
  },
  {
    id: '2',
    title: 'Sörmlandsleden — Gnesta etapp',
    region: 'Södermanland',
    activityType: 'vandring',
    distance: 12.4,
    elevation: 120,
    duration: 180,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=520&q=70&auto=format',
  },
  {
    id: '3',
    title: 'Kebnekaise — vintervandring',
    region: 'Kebnekaise, Norrbotten',
    activityType: 'topptur',
    distance: 19,
    elevation: 1450,
    duration: 540,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=520&q=70&auto=format',
  },
  {
    id: '4',
    title: 'Gotlandsleden — rundtur',
    region: 'Gotland',
    activityType: 'cykeltur',
    distance: 186,
    elevation: 800,
    duration: 1440,
    difficulty: 'medium',
  },
]

const meta = {
  title: 'Organisms/RouteCardGrid',
  component: RouteCardGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteCardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { routes: mockRoutes },
}

export const WithShowMore: Story = {
  args: { routes: mockRoutes, showMoreHref: '/rutter' },
}
