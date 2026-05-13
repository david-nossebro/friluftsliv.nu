import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinBookingCard } from './CabinBookingCard'
import { cabins } from '@/data/cabins'

const firstCabin = cabins[0]
const bookableCabin = cabins.find((c) => c.pricePerNight != null && Boolean(c.bookingUrl))

if (!firstCabin || !bookableCabin?.bookingUrl || bookableCabin.pricePerNight == null) {
  throw new Error('Expected seeded cabin fixtures for CabinBookingCard stories.')
}

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
    pricePerNight: bookableCabin.pricePerNight,
    bookingUrl: bookableCabin.bookingUrl,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: /boka stuga/i })).toHaveAttribute(
      'href',
      bookableCabin.bookingUrl,
    )
    await expect(canvas.getByRole('button', { name: /dela stugan/i })).toBeInTheDocument()
  },
}

export const Unavailable: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: /boka stuga/i })).toBeDisabled()
  },
}
