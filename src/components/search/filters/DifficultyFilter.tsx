'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Difficulty } from '@/types'
import { DIFFICULTY_LABELS, DIFFICULTY_HINTS, ALL_DIFFICULTIES } from '@/lib/difficulty'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

const DIFFICULTY_OPTIONS = ALL_DIFFICULTIES.map((value) => ({
  value,
  label: DIFFICULTY_LABELS[value],
  hint: DIFFICULTY_HINTS[value],
}))

export interface DifficultyFilterProps {
  value: Difficulty[]
  onChange: (next: Difficulty[]) => void
  labelId?: string
}

export function DifficultyFilter({ value, onChange, labelId }: DifficultyFilterProps) {
  const fallbackId = React.useId()
  const headingId = labelId ?? fallbackId
  return (
    <fieldset className={FILTER_FIELDSET_CLASS}>
      <legend id={headingId} className={FILTER_LABEL_CLASS}>Svårighetsgrad</legend>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={(next) => onChange(next as Difficulty[])}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start pt-1"
      >
        {DIFFICULTY_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.hint}
            className={FILTER_TOGGLE_ITEM_CLASS}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}
