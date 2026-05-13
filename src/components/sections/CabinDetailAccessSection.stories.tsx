import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { CabinDetailAccessSection } from './CabinDetailAccessSection'
import { cabins } from '@/data/cabins'

const summerAndWinterCabin = cabins.find((c) => c.accessSummer && c.accessWinter)
const summerOnlyCabin = cabins.find((c) => c.accessSummer && !c.accessWinter)

if (!summerAndWinterCabin?.accessSummer || !summerAndWinterCabin.accessWinter || !summerOnlyCabin?.accessSummer) {
  throw new Error('Expected seeded cabin fixtures for CabinDetailAccessSection stories.')
}

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
    accessSummer: summerAndWinterCabin.accessSummer,
    accessWinter: summerAndWinterCabin.accessWinter,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sommar')).toBeInTheDocument()
    await expect(canvas.getByText('Vinter')).toBeInTheDocument()
  },
}

export const SummerOnly: Story = {
  args: {
    accessSummer: summerOnlyCabin.accessSummer,
  },
}
