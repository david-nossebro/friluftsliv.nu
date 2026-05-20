import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DurationFilter } from './DurationFilter'

function Wrapper({
  initialMinHours,
  initialMaxHours,
}: {
  initialMinHours: number
  initialMaxHours: number | null
}) {
  const [range, setRange] = React.useState<{ min: number; max: number | null }>({
    min: initialMinHours,
    max: initialMaxHours,
  })

  return (
    <div className="p-4 bg-snow max-w-[420px]">
      <DurationFilter
        minHours={range.min}
        maxHours={range.max}
        onChange={(min, max) => setRange({ min, max })}
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/DurationFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { initialMinHours: 0, initialMaxHours: null } }
export const HalfDay: Story = { args: { initialMinHours: 0, initialMaxHours: 6 } }
export const Weekend: Story = { args: { initialMinHours: 6, initialMaxHours: 48 } }
export const LongHike: Story = { args: { initialMinHours: 72, initialMaxHours: 144 } }
