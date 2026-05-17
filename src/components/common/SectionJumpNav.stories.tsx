import type { Meta, StoryObj } from '@storybook/react'
import { SectionJumpNav } from './SectionJumpNav'

const meta = {
  title: 'Common/SectionJumpNav',
  component: SectionJumpNav,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionJumpNav>

export default meta
type Story = StoryObj<typeof meta>

export const HikingSubtypes: Story = {
  args: {
    description: 'Hoppa direkt till den typ av vandring du vill utforska.',
    ariaLabel: 'Hoppa mellan vandringstyper',
    items: [
      { href: '#vandring', label: 'Vandring', count: 4 },
      { href: '#fjallvandring', label: 'Fjällvandring', count: 3 },
      { href: '#langvandring', label: 'Långvandring', count: 1 },
    ],
  },
}
