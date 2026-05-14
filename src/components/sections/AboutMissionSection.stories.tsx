import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AboutMissionSection } from './AboutMissionSection'

const meta = {
  title: 'Sections/AboutMissionSection',
  component: AboutMissionSection,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutMissionSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /tanken bakom/i })).toBeInTheDocument()
    await expect(canvas.getByAltText(/svensk fjälldal/i)).toBeInTheDocument()
  },
}

export const ShortCopy: Story = {
  args: {
    paragraphs: [
      'Vi bygger för dig som vill komma ut, utan att fastna i förberedelserna.',
      'Det ska vara lätt att förstå vart du kan gå, sova och börja.',
    ],
  },
}
