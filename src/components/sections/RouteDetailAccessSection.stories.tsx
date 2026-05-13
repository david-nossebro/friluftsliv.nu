import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailAccessSection } from './RouteDetailAccessSection'
import { routes } from '@/data/routes'

const route = routes[0]

const meta = {
  title: 'Sections/RouteDetailAccessSection',
  component: RouteDetailAccessSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteDetailAccessSection>

export default meta
type Story = StoryObj<typeof meta>

export const WithBothOptions: Story = {
  args: {
    accessByCar: route.accessByCar,
    accessByTransport: route.accessByTransport,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: /hur du tar dig dit/i })).toBeInTheDocument()
    await expect(canvas.getByText('Med bil')).toBeInTheDocument()
    await expect(canvas.getByText('Kollektivtrafik')).toBeInTheDocument()
  },
}

export const CarOnly: Story = {
  args: {
    accessByCar: route.accessByCar,
  },
}
