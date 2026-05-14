import type { Meta, StoryObj } from '@storybook/react'
import { ExploreGrid, type ExploreItem } from './ExploreGrid'

const mockItems: ExploreItem[] = [
  {
    kind: 'area',
    data: {
      id: '1',
      title: 'Sarek nationalpark',
      kind: 'nationalpark',
      region: 'Norrbotten, Lappland',
      summary: 'Vidsträckta fjäll och tystnad.',
      description: 'Ett stort fjällområde för längre turer.',
      imageUrl: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=560&q=70&auto=format',
    },
    routeCount: 4,
    cabinCount: 1,
  },
  { kind: 'route', data: { id: '2', title: 'Kungsleden — Abisko', region: 'Norrbotten', activityType: 'vandring', exploreCategory: 'fjallvandring', distance: 110, elevation: 2400, duration: 300, difficulty: 'medium', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=520&q=70&auto=format' } },
  { kind: 'cabin', data: { id: '3', title: 'Abiskojaure STF', region: 'Abisko', amenities: ['Sovplatser', 'Kök'], pricePerNight: 350, available: true, imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=560&q=70&auto=format' } },
  {
    kind: 'area',
    data: {
      id: '4',
      title: 'Nackareservatet',
      kind: 'naturreservat',
      region: 'Stockholms län',
      summary: 'Skog och sjöar nära stan.',
      description: 'Ett lättillgängligt reservat för dagsvandring.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=560&q=70&auto=format',
    },
    routeCount: 2,
    cabinCount: 0,
  },
  { kind: 'route', data: { id: '5', title: 'Sörmlandsleden', region: 'Södermanland', activityType: 'vandring', exploreCategory: 'vandring', distance: 12, elevation: 120, duration: 180, difficulty: 'easy' } },
  { kind: 'cabin', data: { id: '6', title: 'Sylarna Fjällstation', region: 'Jämtland', amenities: ['Restaurang', 'Bastu'], pricePerNight: 595, available: true } },
]

const meta = {
  title: 'Search/ExploreGrid',
  component: ExploreGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreGrid>

export default meta
type Story = StoryObj<typeof meta>

export const MixedContent: Story = {
  args: { items: mockItems },
}

export const Empty: Story = {
  args: { items: [] },
}

export const AreasOnly: Story = {
  args: {
    items: mockItems.filter((i) => i.kind === 'area'),
  },
}
