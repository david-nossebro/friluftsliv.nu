'use client'

import * as React from 'react'
import { FilterChip } from '@/components/ui/filter-chip'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS } from './filterStyles'

export interface PublicTransportFilterProps {
  value: boolean
  onChange: (next: boolean) => void
}

export function PublicTransportFilter({ value, onChange }: PublicTransportFilterProps) {
  const headingId = React.useId()
  return (
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Kollektivtrafik</legend>
      <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-1.5 pt-1">
        <FilterChip
          label="Med kollektivtrafik"
          active={value}
          onClick={() => onChange(!value)}
        />
      </div>
    </fieldset>
  )
}
