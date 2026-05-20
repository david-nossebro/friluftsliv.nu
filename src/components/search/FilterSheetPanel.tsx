'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  createFilterResetPatch,
  countActiveFiltersForDimensions,
  type FilterDimension,
  type FilterState,
} from '@/lib/exploreFilters'
import type { LatLng } from '@/lib/geo'
import { FilterPanel } from './FilterPanel'

export interface FilterSheetPanelProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  applicable: FilterDimension[]
  resultCount: number
  onClose: () => void
  onCoordsChange?: ((coords: LatLng | null) => void) | undefined
  surface?: 'mobile' | 'desktop'
}

export function FilterSheetPanel({
  state,
  patch,
  applicable,
  resultCount,
  onClose,
  onCoordsChange,
  surface = 'mobile',
}: FilterSheetPanelProps) {
  const activeCount = countActiveFiltersForDimensions(state, applicable)

  const reset = () => {
    patch(createFilterResetPatch(applicable))
  }

  const isDesktop = surface === 'desktop'

  const titleBlock = (
    <>
      <SheetTitle className="font-display text-lg font-normal text-pine">
        Filter
        {activeCount > 0 && (
          <span className="ml-2 font-body text-sm text-stone">({activeCount})</span>
        )}
      </SheetTitle>
      <SheetDescription className="mt-1 font-body text-sm text-stone">
        {activeCount > 0
          ? `${activeCount} filter hjälper dig att hitta rätt.`
          : 'Välj det som passar dig bäst.'}
      </SheetDescription>
    </>
  )

  return (
    <div className="flex h-full flex-col bg-snow">
      <div
        className={cn(
          'border-b border-mist-dark',
          isDesktop ? 'px-6 py-5' : 'px-4 py-3 pr-14',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {isDesktop ? (
            <div className="min-w-0">{titleBlock}</div>
          ) : (
            <SheetHeader className="min-w-0 space-y-0 text-left">
              {titleBlock}
            </SheetHeader>
          )}
          {activeCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              className="shrink-0 text-xs text-stone"
            >
              Rensa alla
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          'flex-1 overflow-y-auto',
          isDesktop ? 'px-6 py-6' : 'p-4',
        )}
      >
        <FilterPanel
          state={state}
          patch={patch}
          applicable={applicable}
          onCoordsChange={onCoordsChange}
        />
      </div>

      <div
        className={cn(
          'border-t border-mist-dark bg-white/95 backdrop-blur-sm',
          isDesktop ? 'px-6 py-5' : 'px-4 py-3',
        )}
      >
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onClose}
          className="w-full"
        >
          Visa {resultCount} resultat
        </Button>
        <p className="mt-2 font-body text-xs text-stone">
          Resultaten uppdateras direkt medan du filtrerar.
        </p>
      </div>
    </div>
  )
}
