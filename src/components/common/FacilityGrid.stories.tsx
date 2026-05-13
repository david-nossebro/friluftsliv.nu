import type { Meta, StoryObj } from '@storybook/react'
import { Flame, Fish, CalendarCheck, Wifi, Droplets, Zap, Dog, Baby, Utensils } from 'lucide-react'
import { FacilityGrid } from './FacilityGrid'

const meta = {
  title: 'Common/FacilityGrid',
  component: FacilityGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof FacilityGrid>

export default meta
type Story = StoryObj<typeof meta>

export const CabinFacilities: Story = {
  args: {
    items: [
      { label: 'Vedspis', icon: Flame },
      { label: 'Fiske', icon: Fish },
      { label: 'Bokningsbar', icon: CalendarCheck },
      { label: 'Wifi', icon: Wifi },
      { label: 'Rinnande vatten', icon: Droplets },
      { label: 'Solenergi', icon: Zap },
    ],
  },
}

export const SuitableFor: Story = {
  args: {
    items: [
      { label: 'Hund välkommen', icon: Dog },
      { label: 'Barnvänlig', icon: Baby },
      { label: 'Kök finns', icon: Utensils },
    ],
  },
}
