'use client'

import * as React from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResultsHeader } from './ResultsHeader'
import {
  type FilterState,
  countActiveFilters,
  defaultFilterState,
} from '@/lib/exploreFilters'

export interface FilterToolbarProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  count: number
  /** Whether the inline panel is expanded. Drives the chevron + aria-expanded. */
  isOpen: boolean
  /** Toggle the inline panel (desktop) or open the Sheet (mobile). */
  onToggle: () => void
  /** ID of the controlled panel — used for aria-controls. */
  panelId: string
  /** Slot for the mobile-only Sheet trigger (rendered <lg). */
  mobileTrigger?: React.ReactNode
  className?: string
}

export function FilterToolbar({
  state,
  patch,
  count,
  isOpen,
  onToggle,
  panelId,
  mobileTrigger,
  className,
}: FilterToolbarProps) {
  const activeCount = countActiveFilters(state)

  const reset = () => {
    const { tab, query } = state
    patch({ ...defaultFilterState, tab, query })
  }

  return (
    <div
      className={[
        'flex items-center justify-between gap-3 flex-wrap',
        className,
      ].filter(Boolean).join(' ')}
    >
      <ResultsHeader
        state={state}
        patch={patch}
        count={count}
        className="flex-1 min-w-0"
      />
      <div className="flex items-center gap-2 shrink-0">
        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-xs text-stone"
          >
            Rensa alla
          </Button>
        )}
        {/* Desktop: inline-toggle button */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="hidden lg:inline-flex items-center gap-2"
        >
          <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>Filtrera</span>
          {activeCount > 0 && (
            <FilterCountBadge n={activeCount} />
          )}
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
            className={[
              'transition-transform duration-[160ms] ease-out motion-reduce:transition-none',
              isOpen ? 'rotate-180' : '',
            ].join(' ')}
          />
        </Button>
        {/* Mobile: parent slots a SheetTrigger here */}
        <div className="lg:hidden">{mobileTrigger}</div>
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
