import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { ImageGallery } from './ImageGallery'
import { Badge } from '@/components/atoms/Badge'
import { DifficultyBadge } from './DifficultyBadge'

const heroUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=70&auto=format'
const thumbUrls = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70&auto=format',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70&auto=format',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=70&auto=format',
]

const meta = {
  title: 'Molecules/ImageGallery',
  component: ImageGallery,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: heroUrl,
    alt: 'Bergslandskap i solnedgång',
  },
}

export const WithGallery: Story = {
  args: {
    src: heroUrl,
    alt: 'Bergslandskap i solnedgång',
    images: thumbUrls,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const secondImageButton = canvas.getByRole('button', { name: /visa bild 2/i })

    await userEvent.click(secondImageButton)

    await expect(secondImageButton).toHaveAttribute('aria-pressed', 'true')
  },
}

export const WithRouteOverlay: Story = {
  args: {
    src: heroUrl,
    alt: 'Vandring längs Kungsleden',
    images: thumbUrls,
    overlay: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="pine" size="sm">Vandring</Badge>
          <DifficultyBadge difficulty="medium" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
          Höga Kusten — Skuleberget topptur
        </h1>
        <p className="font-body text-sm text-snow/75">Västernorrland</p>
      </div>
    ),
  },
}

export const WithCabinOverlay: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1449495169669-7b118f960251?w=1200&q=70&auto=format',
    alt: 'Sylarna fjällstation i sommarljuset',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=70&auto=format',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=70&auto=format',
    ],
    overlay: (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="mist" size="sm">Betjänad</Badge>
          <Badge variant="moss" size="sm">Tillgänglig</Badge>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-light text-snow leading-tight">
          Sylarna fjällstation
        </h1>
        <p className="font-body text-sm text-snow/75">Jämtland</p>
      </div>
    ),
  },
}
