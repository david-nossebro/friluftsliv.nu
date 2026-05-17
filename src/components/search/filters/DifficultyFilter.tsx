'use client'

import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Label } from '@/components/ui/label'
import type { Difficulty } from '@/types'

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
    <fieldset className="flex flex-col gap-2">
      <Label asChild>
        <legend id={headingId} className="text-sm font-medium text-pine">Svårighetsgrad</legend>
      </Label>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={(next) => onChange(next as Difficulty[])}
        aria-labelledby={headingId}
        className="flex flex-wrap gap-2 justify-start"
      >
        {DIFFICULTY_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.hint}
            className="px-3 py-2 rounded-full border border-mist-dark bg-white text-ink-soft data-[state=on]:bg-pine data-[state=on]:text-snow data-[state=on]:border-pine hover:bg-mist hover:text-pine"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}
