import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { AboutCtaSection } from './AboutCtaSection'

const meta = {
  title: 'Organisms/AboutCtaSection',
  component: AboutCtaSection,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutCtaSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /naturen väntar\./i })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /utforska turer/i })).toHaveAttribute('href', '/utforska')
    await expect(canvas.getByRole('link', { name: /öppna kartan/i })).toHaveAttribute('href', '/karta')
  },
}

export const AlternateCopy: Story = {
  args: {
    title: 'Börja i liten skala.\nKom längre nästa gång.',
    description: 'Utforska en led idag eller spara en stuga till nästa helg.',
  },
}
