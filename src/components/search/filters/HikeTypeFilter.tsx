'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { HikeType } from '@/types'
import { HIKE_TYPE_LABELS, ALL_HIKE_TYPES } from '@/lib/hikeType'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

const HIKE_TYPE_OPTIONS = ALL_HIKE_TYPES.map((value) => ({
  value,
  label: HIKE_TYPE_LABELS[value],
}))

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
