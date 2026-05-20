'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { CabinServiceType } from '@/types'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

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
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Service i stugan</legend>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          if (!next) return
          onChange(next as CabinServiceType | 'any')
        }}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start pt-1"
      >
        {OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={FILTER_TOGGLE_ITEM_CLASS}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}
