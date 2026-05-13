import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, it, expect } from 'vitest'
import { Button } from './button'

describe('Button — a11y', () => {
  it('has no axe violations in default state', async () => {
    const { container } = render(<Button>Save</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
