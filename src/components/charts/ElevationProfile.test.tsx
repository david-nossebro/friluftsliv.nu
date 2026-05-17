import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { ElevationProfile } from './ElevationProfile'
import { routes } from '@/data/routes'

const kungsleden = routes.find((r) => r.id === 'kungsleden-abisko-nikkaluokta')!

describe('ElevationProfile — a11y', () => {
  it('has no axe violations in default state', async () => {
    const { container } = render(
      <ElevationProfile track={kungsleden.gpxTrack!} activityType="vandring" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('shows a compact ascent and descent summary', () => {
    const { container } = render(
      <ElevationProfile track={kungsleden.gpxTrack!} activityType="vandring" />,
    )

    expect(screen.getByText('Upp')).toBeInTheDocument()
    expect(screen.getByText('Ned')).toBeInTheDocument()
    expect(screen.queryByText('Vandring')).not.toBeInTheDocument()
    expect(screen.queryByText(/höjd:.*höjdmeter.*km/i)).toBeNull()
    expect(container.querySelector('defs')).toBeNull()
    expect(container.querySelectorAll('[data-steepness-column="true"]').length).toBeGreaterThan(40)
  })
})
