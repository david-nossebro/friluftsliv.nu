'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FilterChip } from './filter-chip'

const meta = {
  title: 'UI/FilterChip',
  component: FilterChip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof FilterChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Vandring', active: false },
}

export const Active: Story = {
  args: { label: 'Vandring', active: true },
}

const ActivityFiltersDemo = () => {
  const [active, setActive] = useState<string[]>(['vandring'])
  const activities = ['Vandring', 'Skidtur', 'Topptur', 'Cykeltur', 'Paddeltur', 'Stugtur']
  return (
    <div className="flex flex-wrap gap-2">
      {activities.map((a) => (
        <FilterChip
          key={a}
          label={a}
          active={active.includes(a.toLowerCase())}
          onClick={() =>
            setActive((prev) =>
              prev.includes(a.toLowerCase())
                ? prev.filter((x) => x !== a.toLowerCase())
                : [...prev, a.toLowerCase()]
            )
          }
        />
      ))}
    </div>
  )
}

export const ActivityFilters: Story = {
  args: { label: '' },
  render: () => <ActivityFiltersDemo />,
}
