import type { Meta, StoryObj } from '@storybook/react'
import { LongHikeStageList } from './LongHikeStageList'
import { stages } from '@/data'

const meta = {
  title: 'Sections/LongHikeStageList',
  component: LongHikeStageList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof LongHikeStageList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stages: stages.slice(0, 3),
  },
}
