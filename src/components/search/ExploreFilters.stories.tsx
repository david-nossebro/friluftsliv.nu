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
  render: () => (
    <div className="w-[1200px] max-w-none">
      <InteractiveDemo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const visibleTabBar = canvas.queryByRole('group', { name: 'Filtrera innehåll' })

    if (visibleTabBar) {
      await userEvent.click(within(visibleTabBar).getByRole('button', { name: 'Vandring' }))
    } else {
      await userEvent.click(canvas.getByRole('button', { name: /kategori: alla/i }))
      await userEvent.click(canvas.getByRole('button', { name: 'Vandring' }))
    }

    await expect(canvas.getByText(/visar: vandring/i)).toBeInTheDocument()
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument()
  },
}

export const MobileDisclosure: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="max-w-sm">
      <InteractiveDemo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /kategori: alla/i }))
    await expect(canvas.getByRole('button', { name: 'Naturreservat' })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Vandring' }))
    await expect(canvas.getByText(/visar: vandring/i)).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Naturreservat' })).not.toBeInTheDocument()
  },
}

export const ConstrainedWidthDisclosure: Story = {
  render: () => (
    <div className="max-w-[720px]">
      <InteractiveDemo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: /kategori: alla/i })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /kategori: alla/i }))
    await userEvent.click(canvas.getByRole('button', { name: 'Kanot' }))

    await expect(canvas.getByText(/visar: kanot/i)).toBeInTheDocument()
  },
}
