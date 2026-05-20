import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { LandskapPicker } from './LandskapPicker'
import type { Landskap } from '@/types'

function Wrapper({
  initialLandskap,
  disabled = false,
}: {
  initialLandskap: Landskap[]
  disabled?: boolean
}) {
  const [landskap, setLandskap] = React.useState(initialLandskap)
  return (
    <div className="p-4 bg-snow max-w-[336px]">
      <LandskapPicker value={landskap} onChange={setLandskap} disabled={disabled} />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/LandskapPicker',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { initialLandskap: [] },
}

export const OneSelected: Story = {
  args: { initialLandskap: ['skane'] },
}

export const ManyAcrossLandsdelar: Story = {
  args: { initialLandskap: ['skane', 'gotland', 'dalarna', 'lappland'] },
}

export const Disabled: Story = {
  args: { initialLandskap: ['skane', 'dalarna'], disabled: true },
}
