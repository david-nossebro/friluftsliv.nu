import type { Meta, StoryObj } from '@storybook/react'
import { MapPromo } from './MapPromo'

const meta = {
  title: 'Organisms/MapPromo',
  component: MapPromo,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MapPromo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomContent: Story = {
  args: {
    title: 'Starta turen i kartan',
    description: 'Planera, spara och dela dina rutter direkt i vår interaktiva karta.',
  },
}
