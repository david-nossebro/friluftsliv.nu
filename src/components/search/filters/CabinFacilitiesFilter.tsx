'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Facility } from '@/types'
import { ALL_FACILITIES, FACILITY_ICONS, FACILITY_LABELS } from '@/lib/facility'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

export interface CabinFacilitiesFilterProps {
  value: Facility[]
  onChange: (next: Facility[]) => void
}

export function CabinFacilitiesFilter({ value, onChange }: CabinFacilitiesFilterProps) {
  const headingId = React.useId()

  return (
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Faciliteter i stugan</legend>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={(next) => onChange(next as Facility[])}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start pt-1"
      >
        {ALL_FACILITIES.map((f) => {
          const Icon = FACILITY_ICONS[f]
          return (
            <ToggleGroupItem
              key={f}
              value={f}
              className={`inline-flex items-center gap-1.5 ${FILTER_TOGGLE_ITEM_CLASS}`}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{FACILITY_LABELS[f]}</span>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </fieldset>
  )
}
