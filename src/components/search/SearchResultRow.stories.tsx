import type { Meta, StoryObj } from '@storybook/react'
import { SearchResultRow } from './SearchResultRow'

const meta = {
  title: 'Search/SearchResultRow',
  component: SearchResultRow,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchResultRow>

export default meta
type Story = StoryObj<typeof meta>

export const Route: Story = {
  args: {
    suggestion: { id: '1', name: 'Kungsleden — Abisko till Nikkaluokta', type: 'route', distance: 4.2 },
  },
}

export const Cabin: Story = {
  args: {
    suggestion: { id: '2', name: 'Abiskojaure STF fjällstuga', type: 'cabin', distance: 12.1 },
  },
}

export const SuggestionList: Story = {
  args: { suggestion: { id: '1', name: 'Kungsleden', type: 'route' } },
  render: () => (
    <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-mist-dark">
      <SearchResultRow suggestion={{ id: '1', name: 'Kungsleden', type: 'route', distance: 4.2 }} />
      <SearchResultRow suggestion={{ id: '2', name: 'Abiskojaure fjällstuga', type: 'cabin', distance: 12.1 }} />
      <SearchResultRow suggestion={{ id: '3', name: 'Sarek nationalpark', type: 'area' }} />
      <SearchResultRow suggestion={{ id: '4', name: 'Jämtland', type: 'region' }} />
    </div>
  ),
}
