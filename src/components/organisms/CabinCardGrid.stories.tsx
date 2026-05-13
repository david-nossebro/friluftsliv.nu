import type { Meta, StoryObj } from '@storybook/react'
import { CabinCardGrid } from './CabinCardGrid'
import type { Cabin } from '@/types'

const mockCabins: Cabin[] = [
  {
    id: '1',
    title: 'Abiskojaure STF Fjällstuga',
    region: 'Abisko, Norrbotten',
    amenities: ['Sovplatser', 'Kök', 'Torrtoalett'],
    pricePerNight: 350,
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=560&q=80',
  },
  {
    id: '2',
    title: 'Kebnekaise Fjällstation',
    region: 'Kebnekaise, Norrbotten',
    amenities: ['Sovplatser', 'Restaurang', 'Bastu', 'Utrustningsuthyrning'],
    pricePerNight: 890,
    available: false,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=560&q=80',
  },
  {
    id: '3',
    title: 'Sylarna STF Fjällstation',
    region: 'Jämtlandsfjällen',
    amenities: ['Sovplatser', 'Restaurang', 'Bastu'],
    pricePerNight: 595,
    available: true,
  },
]

const meta = {
  title: 'Organisms/CabinCardGrid',
  component: CabinCardGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinCardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { cabins: mockCabins },
}

export const WithShowMore: Story = {
  args: { cabins: mockCabins, showMoreHref: '/stugor' },
}
