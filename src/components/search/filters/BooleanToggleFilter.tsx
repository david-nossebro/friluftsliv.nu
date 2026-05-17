'use client'

import * as React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { FilterChip } from '@/components/ui/filter-chip'

export interface BooleanToggleFilterProps {
  label: string
  description?: string
  value: boolean
  onChange: (next: boolean) => void
  /** "row" = label + description + Switch (default). "pill" = compact pressable chip. */
  variant?: 'row' | 'pill'
}

export function BooleanToggleFilter({
  label,
  description,
  value,
  onChange,
  variant = 'row',
}: BooleanToggleFilterProps) {
  if (variant === 'pill') {
    return (
      <FilterChip
        label={label}
        active={value}
        onClick={() => onChange(!value)}
      />
    )
  }

  // Default: row with Switch + description (kept for places that want it).
  return (
    <RowVariant
      label={label}
      {...(description ? { description } : {})}
      value={value}
      onChange={onChange}
    />
  )
}

interface RowVariantProps {
  label: string
  description?: string
  value: boolean
  onChange: (next: boolean) => void
}

function RowVariant({ label, description, value, onChange }: RowVariantProps) {
  const id = React.useId()
  const descId = description ? `${id}-desc` : undefined
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <div className="flex flex-col gap-0.5 min-w-0">
        <Label htmlFor={id} className="text-sm font-medium text-pine cursor-pointer">
          {label}
        </Label>
        {description && (
          <span id={descId} className="text-xs text-stone">{description}</span>
        )}
      </div>
      <Switch
        id={id}
        checked={value}
        onCheckedChange={onChange}
        aria-describedby={descId}
        className="data-[state=checked]:bg-pine data-[state=unchecked]:bg-mist-dark"
      />
    </div>
  )
}
