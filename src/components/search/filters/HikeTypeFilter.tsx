'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { HikeType } from '@/types'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

const HIKE_TYPE_OPTIONS: { value: HikeType; label: string }[] = [
  { value: 'vandring', label: 'Vandring' },
  { value: 'fjallvandring', label: 'Fjällvandring' },
  { value: 'langvandring', label: 'Långvandring' },
]

export interface HikeTypeFilterProps {
  value: HikeType[]
  onChange: (next: HikeType[]) => void
  labelId?: string
}

export function HikeTypeFilter({ value, onChange, labelId }: HikeTypeFilterProps) {
  const fallbackId = React.useId()
  const headingId = labelId ?? fallbackId
  return (
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Typ av vandring</legend>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={(next) => onChange(next as HikeType[])}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start pt-1"
      >
        {HIKE_TYPE_OPTIONS.map((option) => (
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
