import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AboutPageView } from './AboutPageView'

const meta = {
  title: 'Organisms/AboutPageView',
  component: AboutPageView,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutPageView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const DefaultTested: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /vi hjälper dig hitta vägen ut/i })).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: /det här tror vi på/i })).toBeInTheDocument()
  },
}
