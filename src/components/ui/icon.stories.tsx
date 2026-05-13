import type { Meta, StoryObj } from '@storybook/react'
import { Mountain, Map, Compass, Tent, Bike, Waves } from 'lucide-react'
import { Icon } from './icon'

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { icon: Mountain, size: 'md' },
}

export const AllSizes: Story = {
  args: { icon: Mountain },
  render: () => (
    <div className="flex items-end gap-4 text-pine">
      <Icon icon={Mountain} size="xs" />
      <Icon icon={Mountain} size="sm" />
      <Icon icon={Mountain} size="md" />
      <Icon icon={Mountain} size="lg" />
      <Icon icon={Mountain} size="xl" />
    </div>
  ),
}

export const ActivityIcons: Story = {
  args: { icon: Mountain },
  render: () => (
    <div className="flex items-center gap-4 text-pine">
      <Icon icon={Mountain} size="lg" />
      <Icon icon={Map} size="lg" />
      <Icon icon={Compass} size="lg" />
      <Icon icon={Tent} size="lg" />
      <Icon icon={Bike} size="lg" />
      <Icon icon={Waves} size="lg" />
    </div>
  ),
}
