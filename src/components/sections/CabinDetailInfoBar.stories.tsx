import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinDetailInfoBar } from './CabinDetailInfoBar'
import { cabins } from '@/data/cabins'

const meta = {
  title: 'Sections/CabinDetailInfoBar',
  component: CabinDetailInfoBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinDetailInfoBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cabin: cabins[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Kapacitet')).toBeInTheDocument()
    await expect(canvas.getByText('Öppen')).toBeInTheDocument()
    await expect(canvas.getByText('Tillgång')).toBeInTheDocument()
  },
}

export const UnlockedWithoutPrice: Story = {
  args: {
    cabin: {
      ...cabins[0],
      pricePerNight: undefined,
      isLocked: false,
    },
  },
}
