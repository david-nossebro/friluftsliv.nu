import type { Meta, StoryObj } from '@storybook/react'
import { HomePageView } from './HomePageView'
import { defaultSuggestions, getFeaturedCabins, getFeaturedRoutes } from '@/data'

const meta = {
  title: 'Organisms/HomePageView',
  component: HomePageView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof HomePageView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    suggestions: defaultSuggestions,
    featuredRoutes: getFeaturedRoutes(8),
    featuredCabins: getFeaturedCabins(4),
  },
}

export const CalmHero: Story = {
  args: {
    suggestions: defaultSuggestions,
    featuredRoutes: getFeaturedRoutes(4),
    featuredCabins: getFeaturedCabins(4),
    heroHeadline: 'Sök bland Sveriges leder, stugor och naturområden',
    heroImageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=70&auto=format',
  },
}