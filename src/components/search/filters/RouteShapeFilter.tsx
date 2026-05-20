'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { RouteShape } from '@/types'
import { ALL_ROUTE_SHAPES, ROUTE_SHAPE_LABELS } from '@/lib/routeShape'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

export interface RouteShapeFilterProps {
  value: RouteShape | null
  onChange: (next: RouteShape | null) => void
}

export function RouteShapeFilter({ value, onChange }: RouteShapeFilterProps) {
  const headingId = React.useId()
  return (
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Typ av led</legend>
      <ToggleGroup
        type="single"
        value={value ?? '__any'}
        onValueChange={(next) => {
          if (!next) return
          onChange(next === '__any' ? null : (next as RouteShape))
        }}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start pt-1"
      >
        <ToggleGroupItem
          value="__any"
          className="px-3 py-2 rounded-full border border-mist-dark bg-white text-ink-soft data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine hover:bg-mist hover:text-pine"
        >
          Alla
        </ToggleGroupItem>
        {ALL_ROUTE_SHAPES.map((shape) => (
          <ToggleGroupItem
            key={shape}
            value={shape}
            className={FILTER_TOGGLE_ITEM_CLASS}
          >
            {ROUTE_SHAPE_LABELS[shape]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}
