import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { CabinFacilitiesFilter } from './CabinFacilitiesFilter'
import type { Facility } from '@/types'

function Wrapper({ initial }: { initial: Facility[] }) {
  const [value, setValue] = React.useState(initial)
  return (
    <div className="p-4 bg-snow max-w-[360px]">
      <CabinFacilitiesFilter value={value} onChange={setValue} />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/CabinFacilitiesFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { initial: [] } }
export const SeveralChecked: Story = {
  args: { initial: ['bastu', 'koksutrustning', 'wifi'] },
}
