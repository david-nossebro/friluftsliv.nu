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
  const [query, setQuery] = useState('')
  return (
    <div>
      <ExploreFilters
        activeTab={tab}
        onTabChange={setTab}
        searchQuery={query}
        onSearchChange={setQuery}
      />
      <div className="p-6 text-stone font-body text-sm">
        Visar: {tab} · Söker: {query || '—'}
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Fjällvandring' }))
    await expect(canvas.getByText(/visar: fjallvandring/i)).toBeInTheDocument()

    await userEvent.type(
      canvas.getByRole('searchbox', { name: /sök stuga, tur eller område/i }),
      'Abisko',
    )
    await expect(canvas.getByText(/söker: Abisko/i)).toBeInTheDocument()
  },
}
