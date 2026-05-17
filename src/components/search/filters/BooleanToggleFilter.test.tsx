import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { BooleanToggleFilter } from './BooleanToggleFilter'

describe('BooleanToggleFilter — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <BooleanToggleFilter
        label="Hund välkommen"
        description="Visa bara turer där hund är okej."
        value={false}
        onChange={() => {}}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
