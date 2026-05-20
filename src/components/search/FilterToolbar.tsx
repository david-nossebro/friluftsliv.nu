'use client'

import * as React from 'react'
import { ResultsHeader } from './ResultsHeader'
import { type FilterState } from '@/lib/exploreFilters'

export interface FilterToolbarProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  count: number
  /** Slot for the mobile-only Sheet trigger (rendered <lg). */
  mobileTrigger?: React.ReactNode
  className?: string
}

export function FilterToolbar({
  state,
  patch,
  count,
  mobileTrigger,
  className,
}: FilterToolbarProps) {
  return (
    <div
      className={[
        'flex items-start justify-between gap-3 flex-wrap',
        className,
      ].filter(Boolean).join(' ')}
    >
      <ResultsHeader
        state={state}
        patch={patch}
        count={count}
        className="flex-1 min-w-0"
      />
      <div className="flex items-center gap-2 shrink-0 lg:hidden">
        {mobileTrigger}
      </div>
    </div>
  )
}

export function FilterCountBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-pine text-snow text-2xs font-medium">
      {n}
    </span>
  )
}
