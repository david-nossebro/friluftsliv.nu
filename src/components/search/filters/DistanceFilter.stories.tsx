import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DistanceFilter } from './DistanceFilter'

function Wrapper({ initialMin, initialMax }: { initialMin: number; initialMax: number | null }) {
  const [range, setRange] = React.useState<{ min: number; max: number | null }>({
    min: initialMin,
    max: initialMax,
  })
  return (
    <div className="p-4 bg-snow max-w-[320px]">
      <DistanceFilter
        min={range.min}
        max={range.max}
        onCommit={(min, max) => setRange({ min, max })}
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/DistanceFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { initialMin: 0, initialMax: null } }
export const Short: Story = { args: { initialMin: 0, initialMax: 10 } }
export const LongRoutes: Story = { args: { initialMin: 100, initialMax: null } }
