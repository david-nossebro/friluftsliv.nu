import type { Meta, StoryObj } from '@storybook/react'
import { Compass, Heart, Leaf, Mountain, MoonStar } from 'lucide-react'
import { expect, within } from '@storybook/test'
import { AboutValuesSection, type AboutValue } from './AboutValuesSection'

const values: AboutValue[] = [
  {
    icon: Mountain,
    title: 'Jordnära',
    body: 'Vi delar information som du kan lita på inför nästa tur.',
  },
  {
    icon: Leaf,
    title: 'Inbjudande',
    body: 'Naturen ska kännas välkomnande oavsett erfarenhetsnivå.',
  },
  {
    icon: Compass,
    title: 'Tydlig',
    body: 'Tydligt markerade rutter, stugor och svar utan onödigt brus.',
  },
  {
    icon: MoonStar,
    title: 'Lugn',
    body: 'Vi låter naturen vara huvudpersonen och visar bara vägen.',
  },
  {
    icon: Heart,
    title: 'Meningsfull',
    body: 'Allt vi bygger ska hjälpa fler människor ut i naturen oftare.',
  },
]

const meta = {
  title: 'Organisms/AboutValuesSection',
  component: AboutValuesSection,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutValuesSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { values },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /det här tror vi på/i })).toBeInTheDocument()
    await expect(canvas.getByText('Jordnära')).toBeInTheDocument()
    await expect(canvas.getByText('Meningsfull')).toBeInTheDocument()
  },
}

export const ThreeValues: Story = {
  args: {
    values: values.slice(0, 3),
  },
}
