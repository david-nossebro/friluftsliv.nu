'use client'

import * as React from 'react'
import { Slider } from '@/components/ui/slider'
import {
  FILTER_FIELDSET_CLASS,
  FILTER_LABEL_CLASS,
  FILTER_VALUE_TEXT_CLASS,
} from './filterStyles'

const MIN = 0
const MAX = 300
const STEP = 5

export interface DistanceFilterProps {
  min: number
  /** null = no upper bound (300+). */
  max: number | null
  onCommit: (min: number, max: number | null) => void
}

export function DistanceFilter({ min, max, onCommit }: DistanceFilterProps) {
  const headingId = React.useId()
  const sliderMax = MAX
  const initial: [number, number] = [
    Math.max(MIN, Math.min(MAX, min)),
    max == null ? sliderMax : Math.max(MIN, Math.min(MAX, max)),
  ]
  const [value, setValue] = React.useState<[number, number]>(initial)

  React.useEffect(() => {
    setValue([
      Math.max(MIN, Math.min(MAX, min)),
      max == null ? sliderMax : Math.max(MIN, Math.min(MAX, max)),
    ])
  }, [min, max, sliderMax])

  const maxLabel = value[1] >= sliderMax ? `${sliderMax}+ km` : `${value[1]} km`
  const rangeLabel = value[1] >= sliderMax ? `Från ${value[0]} km` : `${value[0]} - ${maxLabel}`

  return (
    <fieldset className={`${FILTER_FIELDSET_CLASS} w-full`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <legend id={headingId} className={FILTER_LABEL_CLASS}>
          Avstånd
        </legend>
        <span className={FILTER_VALUE_TEXT_CLASS}>{rangeLabel}</span>
      </div>
      <Slider
        value={value}
        min={MIN}
        max={sliderMax}
        step={STEP}
        onValueChange={(next) => setValue([next[0] ?? MIN, next[1] ?? sliderMax])}
        onValueCommit={(next) => {
          const next0 = next[0] ?? MIN
          const next1 = next[1] ?? sliderMax
          onCommit(next0, next1 >= sliderMax ? null : next1)
        }}
        aria-labelledby={headingId}
        aria-valuetext={`${value[0]} km till ${maxLabel}`}
      />
      <div className="flex justify-between text-2xs text-stone">
        <span>0 km</span>
        <span>300+ km</span>
      </div>
    </fieldset>
  )
}
