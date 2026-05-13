import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from '@storybook/test'
import { SiteHeader } from './SiteHeader'
import type { SearchSuggestion } from '@/types'

const sampleSuggestions: SearchSuggestion[] = [
  { id: '1', name: 'Kungsleden', type: 'route', distance: 105 },
  { id: '2', name: 'Abiskojaure fjällstuga', type: 'cabin' },
  { id: '3', name: 'Sarek nationalpark', type: 'area' },
  { id: '4', name: 'Lappland', type: 'region' },
]

const meta = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ActiveKarta: Story = {
  args: { currentPath: '/karta' },
}

export const ActiveUtforska: Story = {
  args: { currentPath: '/utforska' },
}

export const WithSearchSuggestions: Story = {
  args: {
    suggestions: sampleSuggestions,
    onSubmit: fn(),
    onSuggestionSelect: fn(),
  },
}

export const MobileMenu: Story = {
  args: {
    suggestions: sampleSuggestions,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /öppna meny/i }))
    await expect(canvas.getByRole('dialog')).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: /meny/i })).toBeInTheDocument()

    await userEvent.click(canvas.getAllByRole('button', { name: /stäng meny/i })[0])
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
  },
}
