'use client'

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHIP_BASE_CLASS =
  'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-body font-medium text-sm transition-all duration-[120ms] ease-out'

const CHIP_ACTIVE_CLASS = 'bg-pine text-snow ring-1 ring-inset ring-pine'

const CHIP_INACTIVE_CLASS =
  'bg-white text-ink-soft ring-1 ring-inset ring-birch hover:bg-mist hover:ring-moss hover:text-pine'

const CHIP_FOCUS_CLASS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1'

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label: string
}

export function FilterChip({ active = false, label, className, onClick, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        CHIP_BASE_CLASS,
        CHIP_FOCUS_CLASS,
        'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        active ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS,
        className,
      )}
      {...props}
    >
      {active && <Check size={14} strokeWidth={1.8} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  )
}

export interface RemovableFilterChipProps {
  label: string
  /** Accessible label for the × button (e.g. "Ta bort Skåne"). */
  removeLabel: string
  onRemove: () => void
  /** Visual style — defaults to the active (filled) chip style. */
  variant?: 'active' | 'inactive'
  className?: string
}

/**
 * Read-only chip with a built-in × button. Use when you need to display a
 * selected value with quick-remove affordance (no toggle on the body itself).
 */
export function RemovableFilterChip({
  label,
  removeLabel,
  onRemove,
  variant = 'active',
  className,
}: RemovableFilterChipProps) {
  const active = variant === 'active'
  return (
    <span
      className={cn(
        CHIP_BASE_CLASS,
        'pr-2',
        active ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS,
        className,
      )}
    >
      {active && <Check size={14} strokeWidth={1.8} aria-hidden="true" />}
      <span>{label}</span>
      <button
        type="button"
        aria-label={removeLabel}
        onClick={onRemove}
        className={cn(
          'ml-1 -mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors',
          CHIP_FOCUS_CLASS,
          active
            ? 'text-snow/90 hover:bg-pine-dark hover:text-snow'
            : 'text-stone hover:bg-mist-dark hover:text-pine',
        )}
      >
        <X size={12} strokeWidth={2} aria-hidden="true" />
      </button>
    </span>
  )
}
