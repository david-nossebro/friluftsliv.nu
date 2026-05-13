import type { Meta, StoryObj } from '@storybook/react'
import { HeroSearch } from './HeroSearch'
import type { SearchSuggestion } from '@/types'

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', name: 'Kungsleden', type: 'route', distance: 4.2 },
  { id: '2', name: 'Abiskojaure fjällstuga', type: 'cabin', distance: 12.1 },
  { id: '3', name: 'Sarek nationalpark', type: 'area' },
]

const meta = {
  title: 'Search/HeroSearch',
  component: HeroSearch,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof HeroSearch>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=70&auto=format',
    suggestions: mockSuggestions,
  },
}

export const NoImage: Story = {
  args: { suggestions: mockSuggestions },
}

export const WithSubheadline: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=70&auto=format',
    subheadline: 'Planera övernattningen. Packa ryggsäcken. Ge dig av.',
    suggestions: mockSuggestions,
  },
}
