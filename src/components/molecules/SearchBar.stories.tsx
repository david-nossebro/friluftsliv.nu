'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from '@storybook/test'
import { SearchBar } from './SearchBar'
import type { SearchSuggestion } from '@/types'

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', name: 'Kungsleden', type: 'route', distance: 4.2 },
  { id: '2', name: 'Abiskojaure fjällstuga', type: 'cabin', distance: 12.1 },
  { id: '3', name: 'Sarek nationalpark', type: 'area' },
  { id: '4', name: 'Jämtland Härjedalen', type: 'region' },
]

const meta = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Autocomplete search input that keeps typing local, filters suggestions in-place, ' +
          'submits free text explicitly on Enter, and navigates separately on suggestion selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['md', 'lg'] },
  },
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Sök rutter, stugor eller platser...',
    size: 'md',
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <SearchBar {...args} />
    </div>
  ),
}

export const WithSuggestions: Story = {
  args: {
    suggestions: mockSuggestions,
    size: 'md',
    onSuggestionSelect: fn(),
  },
  render: (args) => (
    <div className="w-full max-w-sm pb-64">
      <SearchBar {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: /sök/i })

    await userEvent.type(input, 'kung')
    await expect(canvas.getByRole('listbox', { name: /sökförslag/i })).toBeInTheDocument()
    await expect(canvas.getByRole('option', { name: /kungsleden/i })).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}{Enter}')

    await expect(args.onSuggestionSelect).toHaveBeenCalledWith(mockSuggestions[0])
    await expect(canvas.getByDisplayValue('Kungsleden')).toBeInTheDocument()
  },
}

export const HeroSize: Story = {
  args: {
    placeholder: 'Var vill du ge dig ut?',
    suggestions: mockSuggestions,
    size: 'lg',
  },
  render: (args) => (
    <div className="w-full max-w-xl pb-64">
      <SearchBar {...args} />
    </div>
  ),
}

export const FreeTextSubmit: Story = {
  args: {
    placeholder: 'Sök efter en ny led...',
    onSubmit: fn(),
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <SearchBar {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox', { name: /sök/i })

    await userEvent.type(input, 'Padjelanta{Enter}')

    await expect(args.onSubmit).toHaveBeenCalledWith('Padjelanta')
  },
}
