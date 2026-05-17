import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { SeasonFilter } from './SeasonFilter'
import type { Month } from '@/types'

function Wrapper({ initial }: { initial: Month[] }) {
  const [value, setValue] = React.useState(initial)
  return (
    <div className="p-4 bg-snow max-w-[320px]">
      <SeasonFilter value={value} onChange={setValue} />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/SeasonFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { initial: [] } }
export const Summer: Story = { args: { initial: ['juni', 'juli', 'augusti'] } }
export const Winter: Story = { args: { initial: ['december', 'januari', 'februari'] } }
