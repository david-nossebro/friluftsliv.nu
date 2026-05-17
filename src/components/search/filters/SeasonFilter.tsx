'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FilterChip } from '@/components/ui/filter-chip'
import { ALL_MONTHS, currentMonth, formatMonth } from '@/lib/season'
import type { Month } from '@/types'

const ABBREVIATIONS: Record<Month, string> = {
  januari: 'Jan', februari: 'Feb', mars: 'Mar', april: 'Apr',
  maj: 'Maj', juni: 'Jun', juli: 'Jul', augusti: 'Aug',
  september: 'Sep', oktober: 'Okt', november: 'Nov', december: 'Dec',
}

const MONTH_BUTTON_CLASS =
  'px-2.5 py-1.5 rounded-md border border-mist-dark bg-white text-ink-soft text-xs data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine hover:bg-mist hover:text-pine'

export interface SeasonFilterProps {
  value: Month[]
  onChange: (next: Month[]) => void
}

export function SeasonFilter({ value, onChange }: SeasonFilterProps) {
  const headingId = React.useId()
  const now = React.useMemo(() => currentMonth(), [])

  const seasonNowActive = value.length === 1 && value[0] === now

  const selectNow = () => {
    onChange(seasonNowActive ? [] : [now])
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend id={headingId} className="text-sm font-medium text-pine">Säsong</legend>
      <div className="flex flex-wrap items-center gap-1.5" aria-labelledby={headingId}>
        <ToggleGroup
          type="multiple"
          value={value}
          onValueChange={(next) => onChange(next as Month[])}
          className="flex flex-wrap gap-1"
        >
          {ALL_MONTHS.map((month) => (
            <ToggleGroupItem
              key={month}
              value={month}
              aria-label={formatMonth(month)}
              className={MONTH_BUTTON_CLASS}
            >
              {ABBREVIATIONS[month]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-mist-dark" />
        <FilterChip
          label="Säsong just nu"
          active={seasonNowActive}
          onClick={selectNow}
        />
      </div>
    </fieldset>
  )
}
