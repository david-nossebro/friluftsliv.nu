import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { LocationFilter } from './LocationFilter'
import type { Landskap } from '@/types'

function Wrapper({
  initialLandskap,
  initialExcluded,
}: {
  initialLandskap: Landskap[]
  initialExcluded: string[]
}) {
  const [landskap, setLandskap] = React.useState(initialLandskap)
  const [excluded, setExcluded] = React.useState(initialExcluded)
  return (
    <div className="p-4 bg-snow max-w-[360px]">
      <LocationFilter
        landskap={landskap}
        excludedKommun={excluded}
        onChange={(l, ex) => {
          setLandskap(l)
          setExcluded(ex)
        }}
      />
    </div>
  )
}

const meta = {
  title: 'Search/Filters/LocationFilter',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { initialLandskap: [], initialExcluded: [] },
}

export const OneLandskap: Story = {
  args: { initialLandskap: ['skane'], initialExcluded: [] },
}

export const SeveralLandskapWithExclusion: Story = {
  args: {
    initialLandskap: ['lappland', 'norrbotten'],
    initialExcluded: ['Kiruna'],
  },
}
