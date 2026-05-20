'use client'

import * as React from 'react'
import { Slider } from '@/components/ui/slider'
import {
  DURATION_RANGE_HOURS,
  formatDurationFilterLabel,
  formatDurationHours,
  normalizeDurationHours,
} from '@/lib/exploreFilters'
import {
  FILTER_FIELDSET_CLASS,
  FILTER_LABEL_CLASS,
  FILTER_VALUE_TEXT_CLASS,
} from './filterStyles'

export interface DurationFilterProps {
  minHours: number
  maxHours: number | null
  onChange: (minHours: number, maxHours: number | null) => void
}

const OPEN_ENDED_INDEX = DURATION_RANGE_HOURS.length

function getIndexFromHours(hours: number | null, direction: 'min' | 'max') {
  if (hours == null) return OPEN_ENDED_INDEX
  const normalized = normalizeDurationHours(hours, direction)
  const nextIndex = DURATION_RANGE_HOURS.findIndex((option) => option === normalized)
  return nextIndex === -1 ? OPEN_ENDED_INDEX : nextIndex
}

function getHoursFromIndex(index: number) {
  const boundedIndex = Math.min(index, DURATION_RANGE_HOURS.length - 1)
  return DURATION_RANGE_HOURS[boundedIndex] ?? 0
}

function getMaxHoursFromIndex(index: number) {
  if (index >= OPEN_ENDED_INDEX) return null
  return DURATION_RANGE_HOURS[index] ?? 0
}

export function DurationFilter({ minHours, maxHours, onChange }: DurationFilterProps) {
  const headingId = React.useId()
  const [value, setValue] = React.useState<[number, number]>([
    getIndexFromHours(minHours, 'min'),
    getIndexFromHours(maxHours, 'max'),
  ])

  React.useEffect(() => {
    setValue([
      getIndexFromHours(minHours, 'min'),
      getIndexFromHours(maxHours, 'max'),
    ])
  }, [minHours, maxHours])

  const minValue = getHoursFromIndex(value[0])
  const maxValue = getMaxHoursFromIndex(value[1])
  const summaryLabel = formatDurationFilterLabel(minValue, maxValue)

  return (
    <fieldset className={`${FILTER_FIELDSET_CLASS} w-full`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <legend id={headingId} className={FILTER_LABEL_CLASS}>
          Längd på tur
        </legend>
        <span className={FILTER_VALUE_TEXT_CLASS}>{summaryLabel}</span>
      </div>
      <Slider
        value={value}
        min={0}
        max={OPEN_ENDED_INDEX}
        step={1}
        minStepsBetweenThumbs={0}
        onValueChange={(next) => setValue([next[0] ?? 0, next[1] ?? OPEN_ENDED_INDEX])}
        onValueCommit={(next) => {
          onChange(getHoursFromIndex(next[0] ?? 0), getMaxHoursFromIndex(next[1] ?? OPEN_ENDED_INDEX))
        }}
        aria-labelledby={headingId}
        aria-valuetext={`${formatDurationHours(minValue)} till ${maxValue == null ? 'ingen max' : formatDurationHours(maxValue)}`}
      />
      <div className="flex justify-between text-2xs text-stone">
        <span>0 tim</span>
        <span>14 dagar+</span>
      </div>
    </fieldset>
  )
}
