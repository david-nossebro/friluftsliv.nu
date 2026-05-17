'use client'

import * as React from 'react'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const HOURS_MAX = 12
const DAYS_MAX = 14
const HOURS_STEP = 1
const DAYS_STEP = 1

export interface DurationFilterProps {
  unit: 'hours' | 'days'
  max: number | null
  onChange: (unit: 'hours' | 'days', max: number | null) => void
}

export function DurationFilter({ unit, max, onChange }: DurationFilterProps) {
  const headingId = React.useId()
  const sliderMax = unit === 'hours' ? HOURS_MAX : DAYS_MAX
  const step = unit === 'hours' ? HOURS_STEP : DAYS_STEP
  const initial = max == null ? sliderMax : Math.max(0, Math.min(sliderMax, max))
  const [value, setValue] = React.useState<number>(initial)

  React.useEffect(() => {
    setValue(max == null ? sliderMax : Math.max(0, Math.min(sliderMax, max)))
  }, [max, sliderMax])

  const isUnbounded = value >= sliderMax
  const unitShort = unit === 'hours' ? 'tim' : 'dagar'
  const dynamicUnit = unit === 'hours' ? 'tim' : value === 1 ? 'dag' : 'dagar'
  const valueLabel = isUnbounded ? `${sliderMax}+ ${unitShort}` : `${value} ${dynamicUnit}`

  return (
    <fieldset className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <legend id={headingId} className="text-sm font-medium text-pine">Längd på tur</legend>
        <ToggleGroup
          type="single"
          value={unit}
          onValueChange={(next) => {
            if (next === 'hours' || next === 'days') onChange(next, null)
          }}
          className="flex gap-1"
        >
          <ToggleGroupItem
            value="hours"
            aria-label="Visa i timmar"
            className="px-2.5 py-1 text-xs rounded-md border border-mist-dark bg-white text-ink-soft data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine"
          >
            Tim
          </ToggleGroupItem>
          <ToggleGroupItem
            value="days"
            aria-label="Visa i dagar"
            className="px-2.5 py-1 text-xs rounded-md border border-mist-dark bg-white text-ink-soft data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine"
          >
            Dag
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={sliderMax}
        step={step}
        onValueChange={(next) => setValue(next[0] ?? 0)}
        onValueCommit={(next) => {
          const v = next[0] ?? 0
          onChange(unit, v >= sliderMax ? null : v)
        }}
        aria-labelledby={headingId}
        aria-valuetext={`upp till ${valueLabel}`}
      />
      <div className="flex justify-between text-2xs text-stone">
        <span>0 {unitShort}</span>
        <span className="font-medium text-ink-soft">upp till {valueLabel}</span>
      </div>
    </fieldset>
  )
}
