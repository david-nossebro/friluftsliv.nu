import type { Meta, StoryObj } from '@storybook/react'
import { UtflyktDetailPage } from './UtflyktDetailPage'
import { utflykter } from '@/data'

const featuredUtflykt = utflykter[0]
const laterUtflykt = utflykter[2]

if (!featuredUtflykt || !laterUtflykt) {
  throw new Error('Utflykter data saknas för Storybook.')
}

const meta = {
  title: 'Sections/UtflyktDetailPage',
  component: UtflyktDetailPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof UtflyktDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    utflykt: featuredUtflykt,
    relatedUtflykter: utflykter.slice(1),
  },
}

export const WithoutRelated: Story = {
  args: {
    utflykt: laterUtflykt,
  },
}
