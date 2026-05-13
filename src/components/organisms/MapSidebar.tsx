'use client'

import * as React from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { focusFirstElement, trapFocus } from '@/lib/a11y'
import { cn } from '@/lib/utils'
import { Input } from '@/components/atoms/Input'
import { FilterChip } from '@/components/atoms/FilterChip'
import { Button } from '@/components/atoms/Button'
import type { ActivityType, Difficulty } from '@/types'

const activityFilters: { value: ActivityType; label: string }[] = [
  { value: 'vandring',  label: 'Vandring' },
  { value: 'skidtur',   label: 'Skidtur' },
  { value: 'topptur',   label: 'Topptur' },
  { value: 'cykeltur',  label: 'Cykeltur' },
  { value: 'paddeltur', label: 'Paddeltur' },
  { value: 'stugtur',   label: 'Stugtur' },
]

const difficultyFilters: { value: Difficulty; label: string }[] = [
  { value: 'easy',   label: 'Lätt' },
  { value: 'medium', label: 'Medel' },
  { value: 'hard',   label: 'Svår' },
]

export interface MapSidebarFilters {
  activities: ActivityType[]
  difficulties: Difficulty[]
  query: string
}

export interface MapSidebarProps {
  filters?: MapSidebarFilters
  onFiltersChange?: (filters: MapSidebarFilters) => void
  resultCount?: number
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

export function MapSidebar({
  filters: externalFilters,
  onFiltersChange,
  resultCount,
  isOpen = false,
  onClose,
  className,
}: MapSidebarProps) {
  const titleId = React.useId()
  const queryInputId = React.useId()
  const activityGroupId = React.useId()
  const difficultyGroupId = React.useId()
  const asideRef = React.useRef<HTMLElement>(null)
  const [filters, setFilters] = React.useState<MapSidebarFilters>(
    externalFilters ?? { activities: [], difficulties: [], query: '' }
  )

  React.useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters)
    }
  }, [externalFilters])

  React.useEffect(() => {
    if (!isOpen || !asideRef.current) {
      return
    }

    const sidebarElement = asideRef.current
    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    focusFirstElement(sidebarElement)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [isOpen, onClose])

  function update(partial: Partial<MapSidebarFilters>) {
    const next = { ...filters, ...partial }
    setFilters(next)
    onFiltersChange?.(next)
  }

  function toggleActivity(value: ActivityType) {
    const next = filters.activities.includes(value)
      ? filters.activities.filter((a) => a !== value)
      : [...filters.activities, value]
    update({ activities: next })
  }

  function toggleDifficulty(value: Difficulty) {
    const next = filters.difficulties.includes(value)
      ? filters.difficulties.filter((d) => d !== value)
      : [...filters.difficulties, value]
    update({ difficulties: next })
  }

  function handleReset() {
    const reset: MapSidebarFilters = { activities: [], difficulties: [], query: '' }
    setFilters(reset)
    onFiltersChange?.(reset)
  }

  const hasActive = filters.activities.length > 0 || filters.difficulties.length > 0

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-pine/40"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- aside is a focus-trapping dialog when isOpen; keydown handler is gated on that state */}
      <aside
        ref={asideRef}
        className={cn(
          'flex flex-col bg-white border-r border-mist-dark',
          // Desktop: static sidebar, always visible
          'md:relative md:w-[320px] md:h-full md:translate-x-0',
          // Mobile: fixed overlay, slides in from left
          'fixed inset-y-0 left-0 z-40 w-[min(320px,85vw)]',
          'transition-transform duration-[220ms] ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
        role={isOpen ? 'dialog' : undefined}
        aria-modal={isOpen || undefined}
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (isOpen) {
            trapFocus(event.currentTarget, event)
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-mist-dark">
          <SlidersHorizontal size={16} strokeWidth={1.5} className="text-stone" aria-hidden="true" />
          <h2 id={titleId} className="font-body font-medium text-sm text-pine">
            Filter
          </h2>
          {hasActive && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-xs text-stone hover:text-ink transition-colors font-body"
            >
              Rensa
            </button>
          )}
          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng filter"
            className={cn(
              'md:hidden flex items-center justify-center w-10 h-10 rounded-md text-stone hover:bg-mist hover:text-pine transition-colors',
              hasActive ? 'ml-2' : 'ml-auto'
            )}
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
          {/* Search */}
          <div>
            <label
              htmlFor={queryInputId}
              className="block font-body font-medium text-xs text-stone uppercase tracking-wide mb-2"
            >
              Sök plats
            </label>
            <Input
              id={queryInputId}
              variant="search"
              inputSize="md"
              placeholder="Ort, berg, sjö..."
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
              onClear={() => update({ query: '' })}
            />
          </div>

          {/* Activity type */}
          <div role="group" aria-labelledby={activityGroupId}>
            <p id={activityGroupId} className="font-body font-medium text-xs text-stone uppercase tracking-wide mb-3">
              Aktivitet
            </p>
            <div className="flex flex-wrap gap-2">
              {activityFilters.map((f) => (
                <FilterChip
                  key={f.value}
                  label={f.label}
                  active={filters.activities.includes(f.value)}
                  onClick={() => toggleActivity(f.value)}
                />
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div role="group" aria-labelledby={difficultyGroupId}>
            <p id={difficultyGroupId} className="font-body font-medium text-xs text-stone uppercase tracking-wide mb-3">
              Svårighetsgrad
            </p>
            <div className="flex flex-wrap gap-2">
              {difficultyFilters.map((f) => (
                <FilterChip
                  key={f.value}
                  label={f.label}
                  active={filters.difficulties.includes(f.value)}
                  onClick={() => toggleDifficulty(f.value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {resultCount != null && (
          <div className="px-5 py-4 border-t border-mist-dark">
            <Button variant="primary" size="md" className="w-full">
              Visa {resultCount} resultat
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
