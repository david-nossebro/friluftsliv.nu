import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { HikeTypeFilter } from './HikeTypeFilter'
import type { HikeType } from '@/types'

function Wrapper({ initial }: { initial: HikeType[] }) {
  const [value, setValue] = React.useState(initial)
  return (
    <div className="p-6 bg-snow">
      <HikeTypeFilter value={value} onChange={setValue} />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/HikeTypeFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { initial: [] } }

export const FjallSelected: Story = { args: { initial: ['fjallvandring'] } }

export const MultipleSelected: Story = { args: { initial: ['vandring', 'langvandring'] } }
