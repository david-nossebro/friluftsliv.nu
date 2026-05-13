import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from './Logo'

const meta = {
  title: 'Brand/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'reversed', 'mark-only', 'all-white'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default', size: 'md' },
}

export const Reversed: Story = {
  args: { variant: 'reversed', size: 'md' },
  parameters: { backgrounds: { default: 'pine' } },
}

export const MarkOnly: Story = {
  args: { variant: 'mark-only', size: 'lg' },
}

export const AllWhite: Story = {
  args: { variant: 'all-white', size: 'md' },
  parameters: { backgrounds: { default: 'pine' } },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
      <Logo size="xl" />
    </div>
  ),
}
