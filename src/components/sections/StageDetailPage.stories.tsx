import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { StageDetailPage } from './StageDetailPage'
import { getAdjacentStages, getLongHikeForStage, stages } from '@/data'

const mockStage = stages[0]

if (!mockStage) {
  throw new Error('Expected a seeded stage fixture for StageDetailPage stories.')
}

const longHike = getLongHikeForStage(mockStage.id)

if (!longHike) {
  throw new Error('Expected a parent longhike fixture for StageDetailPage stories.')
}

const { nextStage } = getAdjacentStages(mockStage.id)

const meta = {
  title: 'Sections/StageDetailPage',
  component: StageDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof StageDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stage: mockStage,
    longHikeTitle: longHike.title,
    longHikeHref: `/langvandringar/${longHike.id}`,
    ...(nextStage ? { nextStage } : {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: mockStage.title })).toBeInTheDocument()
    await expect(canvas.getByText(mockStage.summary)).toBeInTheDocument()
    await expect(canvas.getByText('Upp')).toBeInTheDocument()
    await expect(canvas.getByText('Ned')).toBeInTheDocument()
  },
}
