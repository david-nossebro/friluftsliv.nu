import type { Meta, StoryObj } from '@storybook/react'
import { UtflyktCard } from './UtflyktCard'
import { utflykter } from '@/data'

const featuredUtflykt = utflykter[0]
const nearbyUtflykt = utflykter[1]

if (!featuredUtflykt || !nearbyUtflykt) {
  throw new Error('Utflykter data saknas för Storybook.')
}

const meta = {
  title: 'Cards/UtflyktCard',
  component: UtflyktCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof UtflyktCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    utflykt: featuredUtflykt,
  },
}

export const MinimalHighlights: Story = {
  args: {
    utflykt: {
      ...nearbyUtflykt,
      highlights: ['Kollektivtrafik'],
    },
  },
}
