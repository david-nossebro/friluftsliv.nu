'use client'

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type FilterState,
  defaultFilterState,
  parseFilters,
  serializeFilters,
} from './exploreFilters'

const URL_DEBOUNCE_MS = 300

export interface UseExploreFiltersResult {
  state: FilterState
  setState: Dispatch<SetStateAction<FilterState>>
  patch: (partial: Partial<FilterState>) => void
  reset: () => void
}

/**
 * Source-of-truth: URL → React state. Mutations go through the hook and are
 * mirrored back to the URL via `router.replace` (debounced).
 */
export function useExploreFilters(initial: FilterState): UseExploreFiltersResult {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams?.toString() ?? ''

  const [state, setState] = useState<FilterState>(initial)
  const lastSerializedRef = useRef<string>(searchParamsString)
  const stateRef = useRef(state)
  stateRef.current = state

  // Absorb back/forward navigation when URL changes externally.
  useEffect(() => {
    if (searchParamsString === lastSerializedRef.current) return
    lastSerializedRef.current = searchParamsString
    const parsed = parseFilters(new URLSearchParams(searchParamsString))
    setState(parsed)
  }, [searchParamsString])

  // Mirror state → URL with debounce.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = window.setTimeout(() => {
      const next = serializeFilters(stateRef.current).toString()
      if (next === lastSerializedRef.current) return
      lastSerializedRef.current = next
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
    }, URL_DEBOUNCE_MS)

    return () => window.clearTimeout(handle)
  }, [state, pathname, router])

  const patch = useCallback((partial: Partial<FilterState>) => {
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  const reset = useCallback(() => {
    setState({ ...defaultFilterState, tab: stateRef.current.tab, query: stateRef.current.query })
  }, [])

  return { state, setState, patch, reset }
}
