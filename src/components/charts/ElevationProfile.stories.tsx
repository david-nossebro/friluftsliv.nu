import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from '@storybook/test'
import { ElevationProfile } from './ElevationProfile'
import { routes } from '@/data/routes'
import type { MapPosition } from '@/types'

const kungsleden = routes.find((r) => r.id === 'kungsleden-abisko-nikkaluokta')
const vasaloppet = routes.find((r) => r.id === 'vasaloppsleden-vinter')
const dalsland = routes.find((r) => r.id === 'dalslands-kanal-bengtsfors-baldersnas')

if (!kungsleden?.gpxTrack || !vasaloppet?.gpxTrack || !dalsland?.gpxTrack) {
  throw new Error('Expected seed fixtures for ElevationProfile stories.')
}

const flatTrack: MapPosition[] = dalsland.gpxTrack

const meta = {
  title: 'Charts/ElevationProfile',
  component: ElevationProfile,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ElevationProfile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    track: kungsleden.gpxTrack,
    activityType: 'vandring',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('slider', { name: /höjdprofil/i }),
    ).toBeInTheDocument()
    await expect(canvas.getByText('Upp')).toBeInTheDocument()
    await expect(canvas.getByText('Ned')).toBeInTheDocument()
    await expect(canvas.queryByText('Vandring')).toBeNull()
    await expect(canvas.queryByText(/höjd:.*höjdmeter.*km/i)).toBeNull()
    await expect(canvasElement.querySelector('defs')).toBeNull()
    await expect(canvasElement.querySelectorAll('[data-steepness-column="true"]').length).toBeGreaterThan(40)
  },
}

export const KeyboardNavigation: Story = {
  args: {
    track: kungsleden.gpxTrack,
    activityType: 'vandring',
    onScrub: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const chart = canvas.getByRole('slider', { name: /höjdprofil/i })
    chart.focus()
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{ArrowRight}')
    await expect(args.onScrub).toHaveBeenCalled()
    const lastCall = (args.onScrub as ReturnType<typeof fn>).mock.calls.at(-1)
    await expect(typeof lastCall?.[0]).toBe('number')
  },
}

export const NoElevationData: Story = {
  args: {
    track: flatTrack,
    activityType: 'paddeltur',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // The component returns null when no per-point altitude exists.
    await expect(canvas.queryByRole('slider', { name: /höjdprofil/i })).toBeNull()
    await expect(canvas.queryByText(/höjdmeter/i)).toBeNull()
  },
}

export const SkiVariant: Story = {
  args: {
    track: vasaloppet.gpxTrack,
    activityType: 'skidtur',
    ariaLabel: 'Höjdprofil för Vasaloppsleden',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('slider', { name: 'Höjdprofil för Vasaloppsleden' }),
    ).toBeInTheDocument()
    // The figure carries a data-activity hook for downstream visual-regression tests.
    const figure = canvasElement.querySelector('figure[data-activity="skidtur"]')
    await expect(figure).not.toBeNull()
  },
}

export const ShortRoute: Story = {
  args: {
    track: routes.find((r) => r.id === 'hoga-kusten-skuleberget')!.gpxTrack!,
    activityType: 'vandring',
  },
}
