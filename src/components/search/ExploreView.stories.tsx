import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ExploreView } from './ExploreView'
import type { ExploreItem } from './ExploreGrid'

const mockItems: ExploreItem[] = [
  { kind: 'area', data: { id: 'sarek', title: 'Sarek nationalpark', routeCount: 48, imageUrl: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=560&q=70&auto=format' } },
  { kind: 'area', data: { id: 'abisko', title: 'Abisko nationalpark', routeCount: 34, imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=560&q=70&auto=format' } },
  { kind: 'route', data: { id: 'kungsleden', title: 'Kungsleden — Abisko till Nikkaluokta', region: 'Lappland', activityType: 'vandring', distance: 105, elevation: 2400, duration: 6900, difficulty: 'hard', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=520&q=70&auto=format' } },
  { kind: 'route', data: { id: 'tyresta', title: 'Tyresta runt', region: 'Stockholms län', activityType: 'vandring', distance: 11.2, elevation: 140, duration: 240, difficulty: 'easy', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=520&q=70&auto=format' } },
  { kind: 'cabin', data: { id: 'sylarna', title: 'Sylarna fjällstation', region: 'Jämtland', amenities: ['Restaurang', 'Bastu'], pricePerNight: 695, available: true, imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=560&q=70&auto=format' } },
  { kind: 'cabin', data: { id: 'abiskojaure', title: 'Abiskojaure fjällstuga', region: 'Lappland', amenities: ['Vedspis'], pricePerNight: 395, available: true, imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=560&q=70&auto=format' } },
]

const meta = {
  title: 'Search/ExploreView',
  component: ExploreView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { items: mockItems },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Rutter' }))
    await userEvent.type(
      canvas.getByRole('searchbox', { name: /sök rutter, stugor och områden/i }),
      'Kungsleden',
    )

    await expect(canvas.getByText('Kungsleden — Abisko till Nikkaluokta')).toBeInTheDocument()
    await expect(canvas.queryByText('Sylarna fjällstation')).not.toBeInTheDocument()
  },
}

export const PreFilteredRoutes: Story = {
  args: { items: mockItems, initialTab: 'rutter' },
}

export const PreFilteredQuery: Story = {
  args: { items: mockItems, initialQuery: 'kungsleden' },
}

export const NoResults: Story = {
  args: { items: mockItems, initialQuery: 'finns inte' },
}
