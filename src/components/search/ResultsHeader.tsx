'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  type FilterState,
  countActiveFilters,
  defaultFilterState,
  buildPills,
} from '@/lib/exploreFilters'

export interface ResultsHeaderProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  count: number
  showCount?: boolean | undefined
  className?: string
}

export function ResultsHeader({
  state,
  patch,
  count,
  showCount = true,
  className,
}: ResultsHeaderProps) {
  const activeCount = countActiveFilters(state)
  const pills = buildPills(state)

  const reset = () => {
    const { tab, query } = state
    patch({ ...defaultFilterState, tab, query })
  }

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      {showCount && (
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="font-body text-sm text-ink-soft"
        >
          <span className="font-medium text-pine">{count}</span>{' '}
          {count === 1 ? 'resultat' : 'resultat'}
        </p>
      )}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Aktiva filter">
          {pills.map((pill) => (
            <button
              type="button"
              key={pill.key}
              onClick={() => patch(pill.clear())}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mist text-xs text-ink-soft border border-mist-dark hover:bg-white hover:text-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1"
              aria-label={`Ta bort filter: ${pill.label}`}
            >
              <span>{pill.label}</span>
              <X size={12} aria-hidden="true" />
            </button>
          ))}
          {activeCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-xs text-stone h-7"
            >
              Rensa alla
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
