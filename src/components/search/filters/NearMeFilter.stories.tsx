import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { NearMeFilter } from './NearMeFilter'

function Wrapper({ initialActive, initialRadius }: { initialActive: boolean; initialRadius: number }) {
  const [active, setActive] = React.useState(initialActive)
  const [radius, setRadius] = React.useState(initialRadius)
  return (
    <div className="p-4 bg-snow max-w-[320px]">
      <NearMeFilter
        active={active}
        radiusKm={radius}
        onActiveChange={setActive}
        onRadiusChange={setRadius}
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/NearMeFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = { args: { initialActive: false, initialRadius: 25 } }
