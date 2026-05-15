import type { Meta, StoryObj } from '@storybook/react'
import { LongHikeCardGrid } from './LongHikeCardGrid'
import { longHikes } from '@/data'

const meta = {
  title: 'Cards/LongHikeCardGrid',
  component: LongHikeCardGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof LongHikeCardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    longHikes,
  },
}
