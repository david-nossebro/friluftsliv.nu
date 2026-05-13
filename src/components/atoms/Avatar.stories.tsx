import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Erik Svensson',
    size: 'md',
  },
}

export const WithFallback: Story = {
  args: { alt: 'Erik Svensson', size: 'md' },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar alt="Anna Lindqvist" size="sm" />
      <Avatar alt="Anna Lindqvist" size="md" />
      <Avatar alt="Anna Lindqvist" size="lg" />
    </div>
  ),
}
