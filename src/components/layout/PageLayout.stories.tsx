import type { Meta, StoryObj } from '@storybook/react'
import { PageLayout } from './PageLayout'

const meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-12 text-center">
        <p className="font-display text-2xl text-pine">Sidinnehåll här</p>
      </div>
    ),
  },
}
