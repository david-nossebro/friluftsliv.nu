import type { Meta, StoryObj } from '@storybook/react'
import { ActivityShortcuts } from './ActivityShortcuts'

const meta = {
  title: 'Organisms/ActivityShortcuts',
  component: ActivityShortcuts,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ActivityShortcuts>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomTitle: Story = {
  args: { title: 'Vad lockar dig ut?' },
}
