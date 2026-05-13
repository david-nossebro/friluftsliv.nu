import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinDetailAccessSection } from './CabinDetailAccessSection'
import { cabins } from '@/data/cabins'

const meta = {
  title: 'Sections/CabinDetailAccessSection',
  component: CabinDetailAccessSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CabinDetailAccessSection>

export default meta
type Story = StoryObj<typeof meta>

export const SummerAndWinter: Story = {
  args: {
    accessSummer: cabins[0].accessSummer,
    accessWinter: cabins[0].accessWinter,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sommar')).toBeInTheDocument()
    await expect(canvas.getByText('Vinter')).toBeInTheDocument()
  },
}

export const SummerOnly: Story = {
  args: {
    accessSummer: cabins[5].accessSummer,
  },
}
