import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouteMapSection } from './RouteMapSection'
import { routes } from '@/data/routes'

const kungsleden = routes.find((r) => r.id === 'kungsleden-abisko-nikkaluokta')
const vasaloppet = routes.find((r) => r.id === 'vasaloppsleden-vinter')
const dalsland = routes.find((r) => r.id === 'dalslands-kanal-bengtsfors-baldersnas')

if (!kungsleden || !vasaloppet || !dalsland) {
  throw new Error('Expected seed fixtures for RouteMapSection stories.')
}

const featureLayers = kungsleden.coordinates
  ? [
      {
        type: 'start',
        label: kungsleden.region,
        color: '#2C4A3E',
        markers: [
          {
            id: kungsleden.id,
            position: kungsleden.coordinates,
            type: 'start',
            label: kungsleden.title,
            description: kungsleden.region,
          },
        ],
      },
    ]
  : undefined

const meta = {
  title: 'Sections/RouteMapSection',
  component: RouteMapSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof RouteMapSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Rutten på karta',
    description: 'Se var rutten går innan du packar — det gör det lättare att planera dagen.',
    ariaLabel: `Karta för ${kungsleden.title}`,
    ...(kungsleden.coordinates ? { center: kungsleden.coordinates, zoom: 8 } : {}),
    ...(featureLayers ? { featureLayers } : {}),
    ...(kungsleden.gpxTrack ? { tracks: [kungsleden.gpxTrack] } : {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Rutten på karta' })).toBeInTheDocument()
  },
}

export const WithActions: Story = {
  args: {
    ...Default.args,
    actions: (
      <>
        <Button asChild variant="secondary" size="md">
          <a href={kungsleden.gpxUrl ?? '/example.gpx'} download>
            <Download size={15} />
            Ladda ned GPX
          </a>
        </Button>
        <Button variant="ghost" size="md">
          <Share2 size={15} />
          Dela rutten
        </Button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: /ladda ned gpx/i })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /dela rutten/i })).toBeInTheDocument()
  },
}

export const WithoutDescription: Story = {
  args: {
    title: 'Översikt på karta',
    ariaLabel: 'Karta',
  },
}

export const WithElevation: Story = {
  args: {
    ...Default.args,
    activityType: 'vandring',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Rutten på karta' })).toBeInTheDocument()
    await expect(canvas.getByRole('slider', { name: /höjdprofil/i })).toBeInTheDocument()
    await expect(canvas.getByText('Upp')).toBeInTheDocument()
    await expect(canvas.getByText('Ned')).toBeInTheDocument()
  },
}

export const WithoutElevation: Story = {
  args: {
    title: 'Rutten på karta',
    description: 'Paddling i flacka vatten — ingen höjdprofil att visa.',
    ariaLabel: `Karta för ${dalsland.title}`,
    activityType: 'paddeltur',
    ...(dalsland.coordinates ? { center: dalsland.coordinates, zoom: 10 } : {}),
    ...(dalsland.gpxTrack ? { tracks: [dalsland.gpxTrack] } : {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Rutten på karta' })).toBeInTheDocument()
    await expect(canvas.queryByRole('slider', { name: /höjdprofil/i })).toBeNull()
  },
}

export const SkiActivity: Story = {
  args: {
    title: 'Rutten på karta',
    description: 'Skidled i Dalarna — linjen följer Vasaloppssträckan.',
    ariaLabel: `Karta för ${vasaloppet.title}`,
    activityType: 'skidtur',
    ...(vasaloppet.coordinates ? { center: vasaloppet.coordinates, zoom: 8 } : {}),
    ...(vasaloppet.gpxTrack ? { tracks: [vasaloppet.gpxTrack] } : {}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Rutten på karta' })).toBeInTheDocument()
    const figure = canvasElement.querySelector('figure[data-activity="skidtur"]')
    await expect(figure).not.toBeNull()
  },
}
