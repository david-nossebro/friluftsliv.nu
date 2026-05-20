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
  /** Custom scale in hours. Defaults to the full 0–336 h route scale. */
  scale?: readonly number[]
  /** Fieldset legend. Defaults to "Längd på tur". */
  label?: string
  /** Bottom-left label. Defaults to "0 tim". */
  minLabel?: string
  /** Bottom-right label. Defaults to "14 dagar+". */
  maxLabel?: string
}

function getIndexFromHours(
  hours: number | null,
  direction: 'min' | 'max',
  scale: readonly number[],
  openEndedIndex: number,
) {
  if (hours == null) return openEndedIndex
  const normalized = normalizeDurationHours(hours, direction, scale)
  const nextIndex = scale.findIndex((option) => option === normalized)
  return nextIndex === -1 ? openEndedIndex : nextIndex
}

function getHoursFromIndex(index: number, scale: readonly number[]) {
  const boundedIndex = Math.min(index, scale.length - 1)
  return scale[boundedIndex] ?? 0
}

function getMaxHoursFromIndex(index: number, scale: readonly number[], openEndedIndex: number) {
  if (index >= openEndedIndex) return null
  return scale[index] ?? 0
}

export function DurationFilter({
  minHours,
  maxHours,
  onChange,
  scale = DURATION_RANGE_HOURS,
  label = 'Längd på tur',
  minLabel = '0 tim',
  maxLabel = '14 dagar+',
}: DurationFilterProps) {
  const headingId = React.useId()
  const openEndedIndex = scale.length

  const [value, setValue] = React.useState<[number, number]>([
    getIndexFromHours(minHours, 'min', scale, openEndedIndex),
    getIndexFromHours(maxHours, 'max', scale, openEndedIndex),
  ])

  React.useEffect(() => {
    setValue([
      getIndexFromHours(minHours, 'min', scale, openEndedIndex),
      getIndexFromHours(maxHours, 'max', scale, openEndedIndex),
    ])
  }, [minHours, maxHours, scale, openEndedIndex])

  const minValue = getHoursFromIndex(value[0], scale)
  const maxValue = getMaxHoursFromIndex(value[1], scale, openEndedIndex)
  const summaryLabel = formatDurationFilterLabel(minValue, maxValue)

  return (
    <fieldset className={`${FILTER_FIELDSET_CLASS} w-full`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <legend id={headingId} className={FILTER_LABEL_CLASS}>
          {label}
        </legend>
        <span className={FILTER_VALUE_TEXT_CLASS}>{summaryLabel}</span>
      </div>
      <Slider
        value={value}
        min={0}
        max={openEndedIndex}
        step={1}
        minStepsBetweenThumbs={0}
        onValueChange={(next) => setValue([next[0] ?? 0, next[1] ?? openEndedIndex])}
        onValueCommit={(next) => {
          onChange(
            getHoursFromIndex(next[0] ?? 0, scale),
            getMaxHoursFromIndex(next[1] ?? openEndedIndex, scale, openEndedIndex),
          )
        }}
        aria-labelledby={headingId}
        aria-valuetext={`${formatDurationHours(minValue)} till ${maxValue == null ? 'ingen max' : formatDurationHours(maxValue)}`}
      />
      <div className="flex justify-between text-2xs text-stone">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </fieldset>
  )
}
