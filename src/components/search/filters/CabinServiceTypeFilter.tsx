'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { CabinServiceType } from '@/types'

const OPTIONS: { value: CabinServiceType | 'any'; label: string }[] = [
  { value: 'any', label: 'Alla' },
  { value: 'betjänad', label: 'Betjänad' },
  { value: 'självhushåll', label: 'Självhushåll' },
  { value: 'obetjänad', label: 'Obetjänad' },
]

export interface CabinServiceTypeFilterProps {
  value: CabinServiceType | 'any'
  onChange: (next: CabinServiceType | 'any') => void
}

export function CabinServiceTypeFilter({ value, onChange }: CabinServiceTypeFilterProps) {
  const headingId = React.useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend id={headingId} className="text-sm font-medium text-pine">Service i stugan</legend>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          if (!next) return
          onChange(next as CabinServiceType | 'any')
        }}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start"
      >
        {OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="px-3 py-2 rounded-full border border-mist-dark bg-white text-ink-soft data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine hover:bg-mist hover:text-pine"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}
