import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, it, expect, vi } from 'vitest'
import { LandskapPicker } from './LandskapPicker'

const triggerRole = (pattern: RegExp) => ({
  role: 'button' as const,
  name: new RegExp(`landskap: ${pattern.source}`, 'i'),
})

describe('LandskapPicker', () => {
  it('shows "Alla landskap" by default', () => {
    render(<LandskapPicker value={[]} onChange={() => {}} />)
    const { role, name } = triggerRole(/alla landskap/)
    expect(screen.getByRole(role, { name })).toBeInTheDocument()
  })

  it('shows the single landskap label when exactly one is selected', () => {
    render(<LandskapPicker value={['skane']} onChange={() => {}} />)
    const { role, name } = triggerRole(/skåne/)
    expect(screen.getByRole(role, { name })).toBeInTheDocument()
  })

  it('shows "N landskap valda" when several are selected', () => {
    render(<LandskapPicker value={['skane', 'gotland', 'dalarna']} onChange={() => {}} />)
    const { role, name } = triggerRole(/3 landskap valda/)
    expect(screen.getByRole(role, { name })).toBeInTheDocument()
  })

  it('reveals the three landsdel groups when opened', async () => {
    const user = userEvent.setup()
    render(<LandskapPicker value={[]} onChange={() => {}} />)

    const { role, name } = triggerRole(/alla landskap/)
    await user.click(screen.getByRole(role, { name }))

    expect(screen.getByText('Götaland')).toBeInTheDocument()
    expect(screen.getByText('Svealand')).toBeInTheDocument()
    expect(screen.getByText('Norrland')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Sök landskap…')).toBeInTheDocument()
  })

  it('toggles a landskap when its row is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<LandskapPicker value={[]} onChange={onChange} />)

    const { role, name } = triggerRole(/alla landskap/)
    await user.click(screen.getByRole(role, { name }))
    await user.click(screen.getByRole('option', { name: /skåne/i }))

    expect(onChange).toHaveBeenCalledWith(['skane'])
  })

  it('removes a landskap when its chip × button is pressed', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<LandskapPicker value={['skane', 'gotland']} onChange={onChange} />)

    const list = screen.getByRole('list', { name: 'Valda landskap' })
    await user.click(within(list).getByRole('button', { name: /ta bort skåne/i }))

    expect(onChange).toHaveBeenCalledWith(['gotland'])
  })

  it('clears all selections via the Rensa button', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<LandskapPicker value={['skane', 'gotland']} onChange={onChange} />)

    const { role, name } = triggerRole(/2 landskap valda/)
    await user.click(screen.getByRole(role, { name }))
    await user.click(screen.getByRole('button', { name: 'Rensa' }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('disables the trigger and hides chips when disabled', () => {
    render(<LandskapPicker value={['skane']} onChange={() => {}} disabled />)

    const { role, name } = triggerRole(/skåne/)
    expect(screen.getByRole(role, { name })).toBeDisabled()
    expect(screen.getByText(/stäng av nära mig/i)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Valda landskap' })).not.toBeInTheDocument()
  })

  it('has no axe violations in default state', async () => {
    const { container } = render(<LandskapPicker value={[]} onChange={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations with selected chips', async () => {
    const { container } = render(
      <LandskapPicker value={['skane', 'dalarna']} onChange={() => {}} />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
