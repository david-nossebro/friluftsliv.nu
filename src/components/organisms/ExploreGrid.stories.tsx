import type { Meta, StoryObj } from '@storybook/react'
import { ExploreGrid, type ExploreItem } from './ExploreGrid'

const mockItems: ExploreItem[] = [
  { kind: 'area',  data: { id: '1', title: 'Sarek nationalpark', routeCount: 48, imageUrl: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=560&q=70&auto=format' } },
  { kind: 'route', data: { id: '2', title: 'Kungsleden — Abisko', region: 'Norrbotten', activityType: 'vandring', distance: 110, elevation: 2400, duration: 300, difficulty: 'medium', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=520&q=70&auto=format' } },
  { kind: 'cabin', data: { id: '3', title: 'Abiskojaure STF', region: 'Abisko', amenities: ['Sovplatser', 'Kök'], pricePerNight: 350, available: true, imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=560&q=70&auto=format' } },
  { kind: 'area',  data: { id: '4', title: 'Kebnekaise fjällmassiv', routeCount: 34, imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=560&q=70&auto=format' } },
  { kind: 'route', data: { id: '5', title: 'Sörmlandsleden', region: 'Södermanland', activityType: 'vandring', distance: 12, elevation: 120, duration: 180, difficulty: 'easy' } },
  { kind: 'cabin', data: { id: '6', title: 'Sylarna Fjällstation', region: 'Jämtland', amenities: ['Restaurang', 'Bastu'], pricePerNight: 595, available: true } },
]

const meta = {
  title: 'Organisms/ExploreGrid',
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
