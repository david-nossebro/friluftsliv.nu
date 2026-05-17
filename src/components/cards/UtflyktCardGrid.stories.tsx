import type { Meta, StoryObj } from '@storybook/react'
import { UtflyktCardGrid } from './UtflyktCardGrid'
import { utflykter } from '@/data'

const meta = {
  title: 'Cards/UtflyktCardGrid',
  component: UtflyktCardGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof UtflyktCardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    utflykter,
    description: 'Platser du kan välja för en halvdag eller heldag, med enkel start och tydlig känsla för dagen.',
  },
}

export const MobileScroll: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    utflykter,
    mobileLayout: 'scroll',
  },
}
