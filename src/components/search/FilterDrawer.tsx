'use client'

import * as React from 'react'
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FilterCountBadge } from './FilterToolbar'
import {
  countActiveFiltersForDimensions,
  type FilterDimension,
  type FilterState,
} from '@/lib/exploreFilters'
import type { LatLng } from '@/lib/geo'
import { FilterSheetPanel } from './FilterSheetPanel'

export interface FilterDrawerProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  applicable: FilterDimension[]
  /** Total result count for the sticky footer CTA. */
  resultCount: number
  onCoordsChange?: (coords: LatLng | null) => void
  /** 'mobile' slides up from the bottom; 'desktop' slides in from the left. */
  variant?: 'mobile' | 'desktop'
}

export function FilterDrawer({
  state,
  patch,
  applicable,
  resultCount,
  onCoordsChange,
  variant = 'mobile',
}: FilterDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const activeCount = countActiveFiltersForDimensions(state, applicable)
  const isDesktop = variant === 'desktop'

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={!isDesktop}>
      <SheetTrigger asChild>
        {isDesktop ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-label={
              open
                ? 'Stäng filter'
                : activeCount > 0
                  ? `Öppna filter. ${activeCount} aktiva filter.`
                  : 'Öppna filter'
            }
            className={cn(
              'relative z-[60] min-h-11 rounded-full border border-mist-dark bg-white px-4 shadow-sm transition-colors',
              open ? 'bg-mist text-pine ring-1 ring-inset ring-moss' : 'text-ink hover:bg-mist',
            )}
          >
            <SlidersHorizontal size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>Filter</span>
            {activeCount > 0 && <FilterCountBadge n={activeCount} />}
            {open ? (
              <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
            )}
          </Button>
        ) : (
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
        )}
      </SheetTrigger>
      <SheetContent
        side={isDesktop ? 'left' : 'bottom'}
        overlayClassName="bg-pine-dark/18 backdrop-blur-[2px] data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        className={
          isDesktop
            ? 'w-[min(24rem,calc(100vw-1rem))] border-r border-mist-dark bg-snow p-0 sm:max-w-[24rem]'
            : 'h-[85vh] p-0 flex flex-col bg-snow'
        }
      >
        <FilterSheetPanel
          state={state}
          patch={patch}
          applicable={applicable}
          resultCount={resultCount}
          onClose={() => setOpen(false)}
          surface={isDesktop ? 'desktop' : 'mobile'}
          {...(onCoordsChange ? { onCoordsChange } : {})}
        />
      </SheetContent>
    </Sheet>
  )
}
