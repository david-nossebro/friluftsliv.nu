import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinDetailMobileBar } from './CabinDetailMobileBar'
import { cabins } from '@/data/cabins'

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
    title: cabins[0].title,
    beds: cabins[0].beds,
    pricePerNight: cabins[0].pricePerNight,
    openPeriod: cabins[0].openPeriod,
    bookingUrl: cabins[0].bookingUrl,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(cabins[0].title)).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /boka nu/i })).toHaveAttribute('href', cabins[0].bookingUrl)
  },
}

export const Closed: Story = {
  args: {
    title: cabins[3].title,
    beds: cabins[3].beds,
    openPeriod: cabins[3].openPeriod,
  },
}
