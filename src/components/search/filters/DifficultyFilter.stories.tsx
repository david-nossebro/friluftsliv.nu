import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DifficultyFilter } from './DifficultyFilter'
import type { Difficulty } from '@/types'

function Wrapper({ initial }: { initial: Difficulty[] }) {
  const [value, setValue] = React.useState(initial)
  return (
    <div className="p-4 bg-snow max-w-[280px]">
      <DifficultyFilter value={value} onChange={setValue} />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/DifficultyFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { initial: [] } }
export const Easy: Story = { args: { initial: ['easy'] } }
export const AllSelected: Story = { args: { initial: ['easy', 'medium', 'hard'] } }
