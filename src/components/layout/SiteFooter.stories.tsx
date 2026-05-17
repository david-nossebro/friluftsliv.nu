import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { SiteFooter } from './SiteFooter'

const meta = {
  title: 'Layout/SiteFooter',
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/naturen väntar\. vi öppnar dörren\./i)).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: /innehåll/i })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Utforska' })).toHaveAttribute('href', '/utforska')
    await expect(canvas.getByRole('link', { name: 'Karta' })).toHaveAttribute('href', '/karta')
    await expect(canvas.getByRole('link', { name: 'Vandring' })).toHaveAttribute(
      'href',
      '/utforska?tab=vandring'
    )
    await expect(canvas.getByRole('link', { name: 'Stugor' })).toHaveAttribute(
      'href',
      '/utforska?tab=stugor'
    )
    await expect(canvas.getByRole('link', { name: 'Naturområden' })).toHaveAttribute(
      'href',
      '/omraden'
    )
  },
}
