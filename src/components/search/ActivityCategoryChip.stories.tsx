'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ActivityCategoryChip } from './ActivityCategoryChip'
import type { ActivityType } from '@/types'

const meta = {
  title: 'Search/ActivityCategoryChip',
  component: ActivityCategoryChip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    activity: {
      control: 'select',
      options: ['vandring', 'skidtur', 'topptur', 'cykeltur', 'paddeltur', 'stugtur'],
    },
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof ActivityCategoryChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { activity: 'vandring', active: false },
}

export const Active: Story = {
  args: { activity: 'vandring', active: true },
}

const AllActivitiesDemo = () => {
  const activities: ActivityType[] = ['vandring', 'skidtur', 'topptur', 'cykeltur', 'paddeltur', 'stugtur']
  const [active, setActive] = useState<ActivityType[]>([])
  return (
    <div className="flex flex-wrap gap-3">
      {activities.map((a) => (
        <ActivityCategoryChip
          key={a}
          activity={a}
          active={active.includes(a)}
          onClick={() =>
            setActive((prev) =>
              prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
            )
          }
        />
      ))}
    </div>
  )
}

export const AllActivities: Story = {
  args: { activity: 'vandring' },
  render: () => <AllActivitiesDemo />,
}
