import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AboutHeroSection } from './AboutHeroSection'

const meta = {
  title: 'Organisms/AboutHeroSection',
  component: AboutHeroSection,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutHeroSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /vi hjälper dig hitta vägen ut/i })).toBeInTheDocument()
    await expect(canvas.getByText(/friluftsliv\.nu är en plats för dig/i)).toBeInTheDocument()
  },
}

export const AutumnImage: Story = {
  args: {
    title: 'Fler människor ut i naturen',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80',
  },
}
