'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Difficulty } from '@/types'
import { FILTER_FIELDSET_CLASS, FILTER_LABEL_CLASS, FILTER_TOGGLE_ITEM_CLASS } from './filterStyles'

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'easy', label: 'Lätt', hint: 'Lätta turer för korta dagar.' },
  { value: 'medium', label: 'Medel', hint: 'Längre dagar och varierad terräng.' },
  { value: 'hard', label: 'Krävande', hint: 'Mer tid, vana och utrustning.' },
]

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
