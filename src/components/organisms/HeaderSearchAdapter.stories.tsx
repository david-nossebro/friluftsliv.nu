import type { Meta, StoryObj } from '@storybook/react'
import { HeaderSearchAdapter } from './HeaderSearchAdapter'

const meta = {
  title: 'Organisms/HeaderSearchAdapter',
  component: HeaderSearchAdapter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Client adapter that wires the site header search input to Next.js navigation. ' +
          'Search submissions navigate to /utforska?q=…; suggestion selection navigates to the relevant detail page.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderSearchAdapter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ActiveKarta: Story = {
  args: { currentPath: '/karta' },
}
