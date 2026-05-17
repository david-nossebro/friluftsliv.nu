'use client'

import * as React from 'react'
import { FilterChip } from '@/components/ui/filter-chip'

export interface PublicTransportFilterProps {
  value: boolean
  onChange: (next: boolean) => void
}

export function PublicTransportFilter({ value, onChange }: PublicTransportFilterProps) {
  const headingId = React.useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend id={headingId} className="text-sm font-medium text-pine">Kollektivtrafik</legend>
      <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-1.5">
        <FilterChip
          label="Med kollektivtrafik"
          active={value}
          onClick={() => onChange(!value)}
        />
      </div>
    </fieldset>
  )
}
