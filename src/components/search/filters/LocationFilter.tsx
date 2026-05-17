'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FilterChip } from '@/components/ui/filter-chip'
import type { Landskap } from '@/types'
import { ALL_LANDSKAP_ALPHABETICAL, LANDSKAP_LABELS } from '@/lib/landskap'
import { getKommunForLandskap } from '@/lib/kommun'

const PILL_CLASS =
  'px-3 py-1.5 rounded-full border border-mist-dark bg-white text-ink-soft text-sm data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine hover:bg-mist hover:text-pine'

export interface LocationFilterProps {
  landskap: Landskap[]
  /** Empty = "Alla" (all in-scope kommun pass). Non-empty = filter to these kommun. */
  selectedKommun: string[]
  onChange: (landskap: Landskap[], selectedKommun: string[]) => void
}

export function LocationFilter({ landskap, selectedKommun, onChange }: LocationFilterProps) {
  const headingId = React.useId()
  const kommunHeadingId = `${headingId}-k`
  const inScopeKommun = React.useMemo(
    () => getKommunForLandskap(landskap),
    [landskap],
  )

  const handleLandskap = (next: string[]) => {
    const nextLandskap = next as Landskap[]
    // Drop any selected kommun no longer in scope.
    const stillInScope = getKommunForLandskap(nextLandskap)
    const nextSelected = selectedKommun.filter((k) => stillInScope.includes(k))
    onChange(nextLandskap, nextSelected)
  }

  const toggleKommun = (k: string) => {
    if (selectedKommun.includes(k)) {
      onChange(landskap, selectedKommun.filter((x) => x !== k))
    } else {
      onChange(landskap, [...selectedKommun, k])
    }
  }

  const isAllaActive = selectedKommun.length === 0

  return (
    <fieldset className="flex flex-col gap-3">
      <legend id={headingId} className="text-sm font-medium text-pine">Plats</legend>

      <ToggleGroup
        type="multiple"
        value={landskap}
        onValueChange={handleLandskap}
        className="flex flex-wrap gap-1.5 justify-start"
        aria-labelledby={headingId}
      >
        {ALL_LANDSKAP_ALPHABETICAL.map((l) => (
          <ToggleGroupItem key={l} value={l} className={PILL_CLASS}>
            {LANDSKAP_LABELS[l]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {landskap.length > 0 && inScopeKommun.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-mist-dark">
          <p id={kommunHeadingId} className="text-2xs font-medium text-stone uppercase tracking-wide">
            Kommun
          </p>
          <div
            role="group"
            aria-labelledby={kommunHeadingId}
            className="flex flex-wrap gap-1.5"
          >
            <FilterChip
              label="Alla"
              active={isAllaActive}
              onClick={() => {
                if (!isAllaActive) onChange(landskap, [])
              }}
            />
            {inScopeKommun.map((k) => (
              <FilterChip
                key={k}
                label={k}
                active={selectedKommun.includes(k)}
                onClick={() => toggleKommun(k)}
              />
            ))}
          </div>
        </div>
      )}
    </fieldset>
  )
}
