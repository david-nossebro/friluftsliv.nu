import type { Meta, StoryObj } from '@storybook/react'
import { CabinCard } from './CabinCard'
import type { Cabin } from '@/types'

const mockCabin: Cabin = {
  id: '1',
  title: 'Abiskojaure STF Fjällstuga',
  region: 'Abisko, Norrbotten',
  amenities: ['Sovplatser', 'Kök', 'Torrtoalett', 'Vedspis'],
  pricePerNight: 350,
  imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=560&q=70&auto=format',
}

const meta = {
  title: 'Cards/CabinCard',
  component: CabinCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinCard>

export default meta
type Story = StoryObj<typeof meta>

const { imageUrl: _imageUrl, ...mockCabinWithoutImage } = mockCabin
const { pricePerNight: _pricePerNight, ...mockCabinWithoutPrice } = mockCabin

export const Default: Story = {
  args: { cabin: mockCabin },
}

export const NoImage: Story = {
  args: { cabin: mockCabinWithoutImage },
}

export const NoPrice: Story = {
  args: { cabin: mockCabinWithoutPrice },
}

export const CardGrid: Story = {
  args: { cabin: mockCabin },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <CabinCard cabin={mockCabin} />
      <CabinCard cabin={{ ...mockCabin, id: '2', title: 'Kebnekaise Fjällstation', pricePerNight: 890 }} />
      <CabinCard cabin={{ ...mockCabin, id: '3', title: 'Sylarna STF Fjällstation', pricePerNight: 595, amenities: ['Sovplatser', 'Restaurang'] }} />
    </div>
  ),
}
