import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinDetailPage } from './CabinDetailPage'
import { CabinCardGrid } from './CabinCardGrid'
import { cabins } from '@/data/cabins'
import { toFacilityItems, toSuitableForItems } from '@/lib/facilityIcons'
import type { Cabin } from '@/types'

const mockCabin = cabins[0]
const facilityItems = toFacilityItems(mockCabin.facilities)
const suitableForItems = mockCabin.suitableFor ? toSuitableForItems(mockCabin.suitableFor) : []

const relatedCabins: Cabin[] = cabins
  .filter((c) => c.id !== mockCabin.id)
  .slice(0, 3)
  .map(({ id, title, region, amenities, pricePerNight, available, imageUrl }) => ({
    id,
    title,
    region,
    amenities,
    pricePerNight,
    available,
    imageUrl,
  }))

const meta = {
  title: 'Organisms/CabinDetailPage',
  component: CabinDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cabin: mockCabin,
    facilityItems,
    suitableForItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: mockCabin.title })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /boka stuga/i })).toBeInTheDocument()
  },
}

export const WithRelatedCabins: Story = {
  args: {
    cabin: mockCabin,
    facilityItems,
    suitableForItems,
    relatedCabins: (
      <CabinCardGrid
        title="Fler stugor i området"
        cabins={relatedCabins}
        showMoreHref="/utforska?tab=stugor"
      />
    ),
  },
}

export const NoImage: Story = {
  args: {
    cabin: {
      ...mockCabin,
      imageUrl: undefined,
      images: undefined,
    },
    facilityItems,
    suitableForItems,
  },
}

export const StaffedCabin: Story = {
  args: {
    cabin: cabins.find((c) => c.serviceType === 'betjänad') ?? cabins[1],
    facilityItems: toFacilityItems(
      (cabins.find((c) => c.serviceType === 'betjänad') ?? cabins[1]).facilities,
    ),
  },
}

export const Unavailable: Story = {
  args: {
    cabin: cabins.find((c) => !c.available) ?? cabins[3],
    facilityItems: toFacilityItems(
      (cabins.find((c) => !c.available) ?? cabins[3]).facilities,
    ),
  },
}
