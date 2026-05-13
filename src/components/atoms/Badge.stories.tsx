import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['pine', 'moss', 'sky', 'earth', 'ember', 'outline', 'mist'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Fjällvandring', variant: 'mist' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="pine">Pine</Badge>
      <Badge variant="moss">Moss</Badge>
      <Badge variant="sky">Sky</Badge>
      <Badge variant="earth">Earth</Badge>
      <Badge variant="ember">Ember</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="mist">Mist</Badge>
    </div>
  ),
}

export const ActivityTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="moss">Vandring</Badge>
      <Badge variant="earth">Cykeltur</Badge>
      <Badge variant="pine">Stugtur</Badge>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="moss" size="sm">Vandring</Badge>
      <Badge variant="sky" size="sm">Paddeltur</Badge>
      <Badge variant="ember" size="sm">Ny</Badge>
    </div>
  ),
}
