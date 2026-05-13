import type { Meta, StoryObj } from '@storybook/react'
import { HomeHero } from './HomeHero'
import type { SearchSuggestion } from '@/types'

const sampleSuggestions: SearchSuggestion[] = [
  { id: 'route-kungsleden', name: 'Kungsleden — Abisko till Nikkaluokta', type: 'route', distance: 105 },
  { id: 'cabin-sylarna', name: 'Sylarna fjällstation', type: 'cabin' },
  { id: 'area-sarek', name: 'Sarek nationalpark', type: 'area' },
  { id: 'region-jamtland', name: 'Jämtland', type: 'region' },
]

const meta = {
  title: 'Organisms/HomeHero',
  component: HomeHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Client-side wrapper around HeroSearch that wires search submit and suggestion selection ' +
          'to Next.js navigation. Used as the homepage hero.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomeHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    suggestions: sampleSuggestions,
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80',
  },
}

export const WithoutImage: Story = {
  args: {
    suggestions: sampleSuggestions,
  },
}
