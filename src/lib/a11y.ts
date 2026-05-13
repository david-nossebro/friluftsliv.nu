import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0
}

export function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true' && isVisible(element)
  })
}

export function focusFirstElement(container: HTMLElement) {
  const [firstFocusable] = getFocusableElements(container)
  firstFocusable?.focus()
  return firstFocusable ?? null
}

export function trapFocus(container: HTMLElement, event: KeyboardEvent | ReactKeyboardEvent) {
  if (event.key !== 'Tab') {
    return
  }

  const focusable = getFocusableElements(container)
  if (focusable.length === 0) {
    event.preventDefault()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (!first || !last) {
    event.preventDefault()
    return
  }

  const activeElement = document.activeElement

  if (event.shiftKey) {
    if (activeElement === first || !container.contains(activeElement)) {
      event.preventDefault()
      last.focus()
    }
    return
  }

  if (activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
