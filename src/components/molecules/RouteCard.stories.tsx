import type { Meta, StoryObj } from '@storybook/react'
import { RouteCard } from './RouteCard'
import type { Route } from '@/types'

const mockRoute: Route = {
  id: '1',
  title: 'Kungsleden — Abisko till Nikkaluokta',
  region: 'Lapplandsfjällen, Norrbotten',
  activityType: 'vandring',
  distance: 110,
  elevation: 2400,
  duration: 300,
  difficulty: 'medium',
}

const meta = {
  title: 'Molecules/RouteCard',
  component: RouteCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { route: mockRoute },
}

export const NoImage: Story = {
  args: { route: { ...mockRoute, imageUrl: undefined } },
}

export const Easy: Story = {
  args: {
    route: {
      ...mockRoute,
      title: 'Sörmlandsleden — Gnesta till Trosa',
      difficulty: 'easy',
      distance: 12.4,
      elevation: 120,
      duration: 210,
      activityType: 'vandring',
    },
  },
}

export const Hard: Story = {
  args: {
    route: {
      ...mockRoute,
      title: 'Besseggen — Jotunheimen',
      difficulty: 'hard',
      activityType: 'topptur',
    },
  },
}

export const CardGrid: Story = {
  args: { route: mockRoute },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {(['vandring', 'skidtur', 'cykeltur'] as const).map((type, i) => (
        <RouteCard
          key={type}
          route={{
            ...mockRoute,
            id: String(i),
            activityType: type,
            difficulty: (['easy', 'medium', 'hard'] as const)[i],
            title: ['Sörmlandsleden', 'Kebnekaise vintertour', 'Gotlandsleden'][i],
          }}
        />
      ))}
    </div>
  ),
}
