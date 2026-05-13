import type { Meta, StoryObj } from '@storybook/react'
import { DifficultyBadge } from './DifficultyBadge'

const meta = {
  title: 'Molecules/DifficultyBadge',
  component: DifficultyBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    difficulty: { control: 'select', options: ['easy', 'medium', 'hard'] },
  },
} satisfies Meta<typeof DifficultyBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Easy: Story = { args: { difficulty: 'easy' } }
export const Medium: Story = { args: { difficulty: 'medium' } }
export const Hard: Story = { args: { difficulty: 'hard' } }

export const AllDifficulties: Story = {
  args: { difficulty: 'easy' },
  render: () => (
    <div className="flex gap-2">
      <DifficultyBadge difficulty="easy" />
      <DifficultyBadge difficulty="medium" />
      <DifficultyBadge difficulty="hard" />
    </div>
  ),
}
