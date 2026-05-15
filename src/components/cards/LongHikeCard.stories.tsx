import type { Meta, StoryObj } from '@storybook/react'
import { LongHikeCard } from './LongHikeCard'
import { longHikes } from '@/data'

const mockLongHike = longHikes[0]

if (!mockLongHike) {
  throw new Error('Expected a seeded longhike fixture for LongHikeCard stories.')
}

const meta = {
  title: 'Cards/LongHikeCard',
  component: LongHikeCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof LongHikeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    longHike: mockLongHike,
  },
}
