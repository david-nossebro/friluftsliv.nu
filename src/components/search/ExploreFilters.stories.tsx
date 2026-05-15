'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { useState } from 'react'
import { ExploreFilters } from './ExploreFilters'
import type { ExploreTab } from '@/types'

const meta = {
  title: 'Search/ExploreFilters',
  component: ExploreFilters,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreFilters>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const InteractiveDemo = () => {
  const [tab, setTab] = useState<ExploreTab>('alla')
  return (
    <div>
      <ExploreFilters activeTab={tab} onTabChange={setTab} />
      <div className="p-6 font-body text-sm text-stone">Visar: {tab}</div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Långvandring' }))
    await expect(canvas.getByText(/visar: langvandring/i)).toBeInTheDocument()
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument()
  },
}
