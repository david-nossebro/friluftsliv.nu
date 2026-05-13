import type { Meta, StoryObj } from '@storybook/react'
import { AreaCard } from './AreaCard'
import type { Area } from '@/types'

const mockArea: Area = {
  id: '1',
  title: 'Sarek nationalpark',
  routeCount: 48,
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

export const Default: Story = {
  args: { area: mockArea },
  render: (args) => (
    <div className="w-full max-w-[280px]">
      <AreaCard {...args} />
    </div>
  ),
}

export const NoImage: Story = {
  args: { area: { ...mockArea, imageUrl: undefined } },
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
      {[
        { id: '1', title: 'Sarek nationalpark', routeCount: 48, imageUrl: 'https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=560&q=70&auto=format' },
        { id: '2', title: 'Kebnekaise fjällmassiv', routeCount: 34, imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=560&q=70&auto=format' },
        { id: '3', title: 'Gotska Sandön', routeCount: 12, imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=560&q=70&auto=format' },
      ].map((area) => (
        <AreaCard key={area.id} area={area} />
      ))}
    </div>
  ),
}
