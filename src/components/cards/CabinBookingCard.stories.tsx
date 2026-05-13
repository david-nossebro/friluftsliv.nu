import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinBookingCard } from './CabinBookingCard'
import { cabins } from '@/data/cabins'

const meta = {
  title: 'Cards/CabinBookingCard',
  component: CabinBookingCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinBookingCard>

export default meta
type Story = StoryObj<typeof meta>

export const Available: Story = {
  args: {
    pricePerNight: cabins[0].pricePerNight,
    bookingUrl: cabins[0].bookingUrl,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: /boka stuga/i })).toHaveAttribute('href', cabins[0].bookingUrl)
    await expect(canvas.getByRole('button', { name: /dela stugan/i })).toBeInTheDocument()
  },
}

export const Unavailable: Story = {
  args: {
    pricePerNight: undefined,
    bookingUrl: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: /boka stuga/i })).toBeDisabled()
  },
}
