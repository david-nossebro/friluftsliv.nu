import type { Meta, StoryObj } from '@storybook/react'
import { Route, TrendingUp, Clock } from 'lucide-react'
import { StatItem } from './StatItem'

const meta = {
  title: 'Molecules/StatItem',
  component: StatItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof StatItem>

export default meta
type Story = StoryObj<typeof meta>

export const Distance: Story = {
  args: { icon: Route, value: '12.4', unit: 'km', label: 'Distans' },
}

export const RouteStats: Story = {
  args: { icon: Route, value: '12.4' },
  render: () => (
    <div className="flex items-center gap-4">
      <StatItem icon={Route} value="12.4" unit="km" label="Distans" />
      <StatItem icon={TrendingUp} value="450" unit="m" label="Höjdmeter" />
      <StatItem icon={Clock} value="3.5" unit="h" label="Tid" />
    </div>
  ),
}
