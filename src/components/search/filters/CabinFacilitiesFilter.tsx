'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Facility } from '@/types'
import { ALL_FACILITIES, FACILITY_ICONS, FACILITY_LABELS } from '@/lib/facility'

export interface CabinFacilitiesFilterProps {
  value: Facility[]
  onChange: (next: Facility[]) => void
}

export function CabinFacilitiesFilter({ value, onChange }: CabinFacilitiesFilterProps) {
  const headingId = React.useId()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend id={headingId} className="text-sm font-medium text-pine">Faciliteter i stugan</legend>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={(next) => onChange(next as Facility[])}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start"
      >
        {ALL_FACILITIES.map((f) => {
          const Icon = FACILITY_ICONS[f]
          return (
            <ToggleGroupItem
              key={f}
              value={f}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-mist-dark bg-white text-ink-soft data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine hover:bg-mist hover:text-pine"
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
