import type { Meta, StoryObj } from '@storybook/react'
import { AreaCardGrid } from './AreaCardGrid'
import { getAreaListItems } from '@/data'

const meta = {
  title: 'Cards/AreaCardGrid',
  component: AreaCardGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AreaCardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    areas: getAreaListItems(),
  },
}

export const Empty: Story = {
  args: {
    areas: [],
  },
}
