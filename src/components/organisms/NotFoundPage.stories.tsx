import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { NotFoundPage } from './NotFoundPage'

const meta = {
  title: 'Organisms/NotFoundPage',
  component: NotFoundPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof NotFoundPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /stigen tar slut här/i })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /tillbaka till start/i })).toHaveAttribute('href', '/')
    await expect(canvas.getByRole('link', { name: /utforska turer/i })).toHaveAttribute('href', '/utforska')
  },
}
