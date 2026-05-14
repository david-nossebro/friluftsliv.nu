import type { Meta, StoryObj } from '@storybook/react'
import { AreaCard } from './AreaCard'
import type { Area } from '@/types'

const mockArea: Area = {
  id: '1',
  title: 'Sarek nationalpark',
  kind: 'nationalpark',
  region: 'Norrbotten, Lappland',
  summary: 'Vidsträckta fjäll och långa turer långt från vägar.',
  description: 'Sarek är ett fjällområde för dig som vill bära allt du behöver och röra dig i ett stort, orört landskap.',
  imageUrl: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=560&q=70&auto=format',
}

const meta = {
  title: 'Cards/AreaCard',
  component: AreaCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof AreaCard>

export default meta
type Story = StoryObj<typeof meta>

const { imageUrl: _imageUrl, ...mockAreaWithoutImage } = mockArea

export const Default: Story = {
  args: { area: mockArea, routeCount: 48, cabinCount: 3 },
  render: (args) => (
    <div className="w-full max-w-[280px]">
      <AreaCard {...args} />
    </div>
  ),
}

export const NoImage: Story = {
  args: { area: mockAreaWithoutImage, routeCount: 48, cabinCount: 3 },
  render: (args) => (
    <div className="w-full max-w-[280px]">
      <AreaCard {...args} />
    </div>
  ),
}

export const AreaGrid: Story = {
  args: { area: mockArea },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {([
        {
          area: {
            id: '1',
            title: 'Sarek nationalpark',
            kind: 'nationalpark',
            region: 'Norrbotten, Lappland',
            summary: 'Stora fjällvidder för långa turer.',
            description: 'Ett vildmarksområde i norr.',
            imageUrl: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=560&q=70&auto=format',
          },
          routeCount: 48,
          cabinCount: 3,
        },
        {
          area: {
            id: '2',
            title: 'Nackareservatet',
            kind: 'naturreservat',
            region: 'Stockholms län',
            summary: 'Skog och sjöar nära stan.',
            description: 'Ett lättillgängligt reservat för dagsvandring.',
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=560&q=70&auto=format',
          },
          routeCount: 6,
          cabinCount: 0,
        },
        {
          area: {
            id: '3',
            title: 'Söderåsens nationalpark',
            kind: 'nationalpark',
            region: 'Skåne län',
            summary: 'Bokskog och sprickdalar i söder.',
            description: 'Ett omtyckt område för lugna turer.',
            imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=560&q=70&auto=format',
          },
          routeCount: 12,
          cabinCount: 1,
        },
      ] satisfies { area: Area; routeCount: number; cabinCount: number }[]).map(({ area, routeCount, cabinCount }) => (
        <AreaCard key={area.id} area={area} routeCount={routeCount} cabinCount={cabinCount} />
      ))}
    </div>
  ),
}
