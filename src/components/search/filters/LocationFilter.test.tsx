import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { LocationFilter } from './LocationFilter'

describe('LocationFilter', () => {
  it('shows only landskap when none are selected', () => {
    render(<LocationFilter landskap={[]} excludedKommun={[]} onChange={() => {}} />)
    expect(screen.queryByText(/^Kommun/)).not.toBeInTheDocument()
    expect(screen.getByText('Skåne')).toBeInTheDocument()
  })

  it('shows kommun list when at least one landskap is selected', () => {
    render(
      <LocationFilter
        landskap={['skane']}
        excludedKommun={[]}
        onChange={() => {}}
      />,
    )
    expect(screen.getByText(/^Kommun/)).toBeInTheDocument()
    expect(screen.getByText('Klippan')).toBeInTheDocument()
  })

  it('has no axe violations in collapsed state', async () => {
    const { container } = render(
      <LocationFilter landskap={[]} excludedKommun={[]} onChange={() => {}} />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
