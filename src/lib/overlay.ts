import * as React from 'react'
import { focusFirstElement } from '@/lib/a11y'

export function useBodyScrollLock(isLocked: boolean) {
  React.useEffect(() => {
    if (!isLocked) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isLocked])
}

interface UseFocusManagedOverlayOptions<T extends HTMLElement> {
  isOpen: boolean
  containerRef: React.RefObject<T | null>
  onDismiss: () => void
}

export function useFocusManagedOverlay<T extends HTMLElement>({
  isOpen,
  containerRef,
  onDismiss,
}: UseFocusManagedOverlayOptions<T>) {
  useBodyScrollLock(isOpen)

  React.useEffect(() => {
    if (!isOpen || !containerRef.current) {
      return
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    focusFirstElement(containerRef.current)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onDismiss()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [containerRef, isOpen, onDismiss])
}
