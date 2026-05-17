import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { LongHikeDetailPage } from './LongHikeDetailPage'
import { getStagesForLongHike, longHikes } from '@/data'

const mockLongHike = longHikes[0]

if (!mockLongHike) {
  throw new Error('Expected a seeded longhike fixture for LongHikeDetailPage stories.')
}

const stages = getStagesForLongHike(mockLongHike.id)

const meta = {
  title: 'Sections/LongHikeDetailPage',
  component: LongHikeDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof LongHikeDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    longHike: mockLongHike,
    stages,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: mockLongHike.title })).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Etapper i ordning' })).toBeInTheDocument()
    await expect(canvas.getByText('Upp')).toBeInTheDocument()
    await expect(canvas.getByText('Ned')).toBeInTheDocument()
  },
}
