import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { RouteDetailAccessSection } from './RouteDetailAccessSection'
import { routes } from '@/data/routes'

const routeWithBothAccessOptions = routes.find((route) => route.accessByCar && route.accessByTransport)
const routeWithCarAccess = routes.find((route) => route.accessByCar)

if (!routeWithBothAccessOptions?.accessByCar || !routeWithBothAccessOptions.accessByTransport || !routeWithCarAccess?.accessByCar) {
  throw new Error('Expected at least one route fixture for RouteDetailAccessSection stories.')
}

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
    accessByCar: routeWithBothAccessOptions.accessByCar,
    accessByTransport: routeWithBothAccessOptions.accessByTransport,
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
    accessByCar: routeWithCarAccess.accessByCar,
  },
}
