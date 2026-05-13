import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinDetailMobileBar } from './CabinDetailMobileBar'
import { cabins } from '@/data/cabins'

const firstCabin = cabins[0]
const fourthCabin = cabins[3]

if (!firstCabin || !fourthCabin) {
  throw new Error('Expected seeded cabin fixtures for CabinDetailMobileBar stories.')
}

const meta = {
  title: 'Sections/CabinDetailMobileBar',
  component: CabinDetailMobileBar,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinDetailMobileBar>

export default meta
type Story = StoryObj<typeof meta>

export const Available: Story = {
  args: {
    title: firstCabin.title,
    beds: firstCabin.beds,
    ...(firstCabin.pricePerNight != null ? { pricePerNight: firstCabin.pricePerNight } : {}),
    ...(firstCabin.openPeriod ? { openPeriod: firstCabin.openPeriod } : {}),
    ...(firstCabin.bookingUrl ? { bookingUrl: firstCabin.bookingUrl } : {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(firstCabin.title)).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /boka nu/i })).toHaveAttribute(
      'href',
      firstCabin.bookingUrl,
    )
  },
}

export const Closed: Story = {
  args: {
    title: fourthCabin.title,
    beds: fourthCabin.beds,
    ...(fourthCabin.openPeriod ? { openPeriod: fourthCabin.openPeriod } : {}),
  },
}
