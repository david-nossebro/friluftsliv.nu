import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { DifficultyFilter } from './DifficultyFilter'

describe('DifficultyFilter — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<DifficultyFilter value={['easy']} onChange={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
