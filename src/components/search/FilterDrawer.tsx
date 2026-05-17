'use client'

import * as React from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FilterPanel } from './FilterPanel'
import { FilterCountBadge } from './FilterToolbar'
import {
  type FilterDimension,
  type FilterState,
  countActiveFilters,
  defaultFilterState,
} from '@/lib/exploreFilters'
import type { LatLng } from '@/lib/geo'

export interface FilterDrawerProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  applicable: FilterDimension[]
  /** Total result count for the sticky footer CTA. */
  resultCount: number
  onCoordsChange?: (coords: LatLng | null) => void
}

export function FilterDrawer({
  state,
  patch,
  applicable,
  resultCount,
  onCoordsChange,
}: FilterDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const activeCount = countActiveFilters(state)

  const reset = () => {
    const { tab, query } = state
    patch({ ...defaultFilterState, tab, query })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="inline-flex items-center gap-2"
        >
          <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>Filtrera</span>
          {activeCount > 0 && <FilterCountBadge n={activeCount} />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 flex flex-col bg-snow"
      >
        <SheetHeader className="px-4 py-3 border-b border-mist-dark flex flex-row items-center justify-between gap-2 space-y-0 pr-14">
          <SheetTitle className="font-display text-lg text-pine">
            Filter {activeCount > 0 && <span className="text-sm text-stone font-body">({activeCount})</span>}
          </SheetTitle>
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
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <FilterPanel
            state={state}
            patch={patch}
            applicable={applicable}
            {...(onCoordsChange ? { onCoordsChange } : {})}
            className="grid-cols-1 md:grid-cols-1 xl:grid-cols-1"
          />
        </div>
        <div className="px-4 py-3 border-t border-mist-dark bg-white">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Visa {resultCount} resultat
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
