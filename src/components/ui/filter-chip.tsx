'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-body font-medium text-sm',
        'transition-all duration-[120ms] ease-out cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        active
          ? 'bg-pine text-snow ring-1 ring-inset ring-pine'
          : 'bg-white text-ink-soft ring-1 ring-inset ring-birch hover:bg-mist hover:ring-moss hover:text-pine',
        className
      )}
      {...props}
    >
      {active && <Check size={14} strokeWidth={1.8} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  )
}
