'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapFilterItem {
  /** Unique type identifier — matches MapFeatureLayer.type */
  type: string
  /** Display label */
  label: string
  /** Optional emoji or character used as a leading icon */
  icon?: string
  /** Number of items of this type — shown as a badge if provided */
  count?: number
}

export interface MapFeatureFilterBarProps {
  filters: MapFilterItem[]
  activeTypes: string[]
  onChange: (activeTypes: string[]) => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MapFeatureFilterBar({
  filters,
  activeTypes,
  onChange,
  className,
}: MapFeatureFilterBarProps) {
  const allActive = activeTypes.length === 0 || activeTypes.length === filters.length

  function toggleAll() {
    // "Alla" chip: if everything is on (or nothing filtered), clear the selection
    // to show all; semantically we use empty array = show all
    onChange([])
  }

  function toggleType(type: string) {
    if (activeTypes.includes(type)) {
      const next = activeTypes.filter((t) => t !== type)
      // If deselecting the last one, treat as "all"
      onChange(next.length === 0 ? [] : next)
    } else {
      const next = [...activeTypes, type]
      // If all are now selected, normalise to empty = "all"
      onChange(next.length === filters.length ? [] : next)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        // Horizontal scroll on mobile, wrapping on desktop
        'overflow-x-auto md:flex-wrap',
        // Hide scrollbar visually but keep it functional
        'scrollbar-none [-webkit-overflow-scrolling:touch]',
        // Horizontal padding so first/last chips don't clip
        'px-4 md:px-0',
        className
      )}
      role="group"
      aria-label="Filtrera kartinnehåll"
    >
      {/* "Alla" chip */}
      <FilterPill
        label="Alla"
        isActive={allActive}
        onClick={toggleAll}
        className="shrink-0"
      />

      {/* Separator */}
      <span className="shrink-0 w-px h-5 bg-birch" aria-hidden="true" />

      {/* Feature type chips */}
      {filters.map((f) => {
        const isExplicitlySelected = activeTypes.includes(f.type)
        return (
          <FilterPill
            key={f.type}
            label={f.label}
            icon={f.icon}
            count={f.count}
            isActive={isExplicitlySelected}
            isDimmed={activeTypes.length > 0 && !isExplicitlySelected}
            onClick={() => toggleType(f.type)}
            className="shrink-0"
          />
        )
      })}
    </div>
  )
}

// ─── FilterPill ───────────────────────────────────────────────────────────────

interface FilterPillProps {
  label: string
  icon?: string
  count?: number
  isActive: boolean
  isDimmed?: boolean
  onClick: () => void
  className?: string
}

function FilterPill({
  label,
  icon,
  count,
  isActive,
  isDimmed = false,
  onClick,
  className,
}: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive && !isDimmed}
      onClick={onClick}
      className={cn(
        // Base layout
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        // Size — 44px min height for tap target compliance on mobile
        'h-11 md:h-9 px-4 rounded-full',
        // Typography
        'font-body font-medium text-sm',
        // Transitions
        'transition-all duration-[120ms] ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
        // Active / inactive states
        isActive && !isDimmed
          ? 'bg-pine text-snow ring-1 ring-inset ring-pine'
          : isDimmed
            ? 'bg-white text-stone ring-1 ring-inset ring-birch opacity-60 hover:opacity-100 hover:text-pine hover:ring-moss'
            : 'bg-white text-ink-soft ring-1 ring-inset ring-birch hover:bg-mist hover:ring-moss hover:text-pine',
        className
      )}
    >
      {isActive && !isDimmed && <Check size={14} strokeWidth={1.8} aria-hidden="true" />}
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
      {count != null && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full text-2xs font-medium min-w-[18px] h-[18px] px-1',
            isActive && !isDimmed ? 'bg-white/20 text-snow' : 'bg-mist text-stone',
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
