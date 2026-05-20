'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ResultsHeader } from './ResultsHeader'
import { type FilterState, type FilterDimension } from '@/lib/exploreFilters'

export interface FilterToolbarProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  reset: () => void
  applicable: FilterDimension[]
  count: number
  showCount?: boolean
  /** Slot for the mobile-only Sheet trigger (rendered <lg). */
  mobileTrigger?: React.ReactNode
  className?: string
}

export function FilterToolbar({
  state,
  patch,
  reset,
  applicable,
  count,
  showCount,
  mobileTrigger,
  className,
}: FilterToolbarProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3 flex-wrap',
        className,
      )}
    >
      <ResultsHeader
        state={state}
        patch={patch}
        reset={reset}
        applicable={applicable}
        count={count}
        showCount={showCount}
        className="flex-1 min-w-0"
      />
      <div className="flex items-center gap-2 shrink-0 lg:hidden">
        {mobileTrigger}
      </div>
    </div>
  )
}


