import { render } from '@testing-library/react'
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
})
