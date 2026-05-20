'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  expandSeasonKeys,
  formatSeasonKey,
  getSelectedSeasonKeys,
  SEASON_OPTIONS,
  type SeasonKey,
} from '@/lib/season'
import type { Month } from '@/types'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_MONTH_CLASS } from './filterStyles'

export interface SeasonFilterProps {
  value: Month[]
  onChange: (next: Month[]) => void
}

export function SeasonFilter({ value, onChange }: SeasonFilterProps) {
  const headingId = React.useId()
  const selectedSeasons = React.useMemo(
    () => getSelectedSeasonKeys(value),
    [value],
  )

  return (
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Säsong</legend>
      <div className="flex flex-wrap items-center gap-1.5 pt-1" aria-labelledby={headingId}>
        <ToggleGroup
          type="multiple"
          value={selectedSeasons}
          onValueChange={(next) => onChange(expandSeasonKeys(next as SeasonKey[]))}
          className="flex flex-wrap gap-1"
        >
          {SEASON_OPTIONS.map((season) => (
            <ToggleGroupItem
              key={season.key}
              value={season.key}
              aria-label={formatSeasonKey(season.key)}
              className={FILTER_TOGGLE_MONTH_CLASS}
            >
              {season.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </fieldset>
  )
}
