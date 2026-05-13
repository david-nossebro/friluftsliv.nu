import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AboutContentHighlightsSection } from './AboutContentHighlightsSection'

const meta = {
  title: 'Organisms/AboutContentHighlightsSection',
  component: AboutContentHighlightsSection,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutContentHighlightsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /vad du hittar här/i })).toBeInTheDocument()
    await expect(canvas.getByText('Rutter')).toBeInTheDocument()
    await expect(canvas.getByText('Stugor')).toBeInTheDocument()
    await expect(canvas.getByText('Karta')).toBeInTheDocument()
  },
}

export const CustomItems: Story = {
  args: {
    items: [
      { title: 'Dagsturer', body: 'Snabba utflykter nära städer och byar.' },
      { title: 'Fjällstugor', body: 'Enkla och bokningsbara boenden längs leden.' },
      { title: 'Kartstöd', body: 'Överblick med filtrering direkt i kartan.' },
    ],
  },
}
