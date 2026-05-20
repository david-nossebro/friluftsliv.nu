'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { RemovableFilterChip } from '@/components/ui/filter-chip'
import {
  LANDSDEL_LABELS,
  LANDSKAP_BY_LANDSDEL,
  LANDSKAP_LABELS,
  type LandsdelKey,
} from '@/lib/landskap'
import { normalizeSelectedLandskap } from '@/lib/exploreFilters'
import type { Landskap } from '@/types'
import {
  FILTER_FIELDSET_CLASS,
  FILTER_HELP_TEXT_CLASS,
  FILTER_LABEL_CLASS,
} from './filterStyles'

export interface LandskapPickerProps {
  value: Landskap[]
  onChange: (value: Landskap[]) => void
  /** True when Nära mig is active — visually disables the picker. */
  disabled?: boolean
}

const LANDSDEL_ORDER: LandsdelKey[] = ['gotaland', 'svealand', 'norrland']

export function LandskapPicker({ value, onChange, disabled = false }: LandskapPickerProps) {
  const [open, setOpen] = React.useState(false)
  const labelId = React.useId()
  const hintId = React.useId()

  const selected = React.useMemo(() => normalizeSelectedLandskap(value), [value])
  const selectedSet = React.useMemo(() => new Set(selected), [selected])

  React.useEffect(() => {
    if (disabled && open) setOpen(false)
  }, [disabled, open])

  const commit = (next: Landskap[]) => {
    onChange(normalizeSelectedLandskap(next))
  }

  const toggle = (landskap: Landskap) => {
    if (selectedSet.has(landskap)) {
      commit(selected.filter((item) => item !== landskap))
    } else {
      commit([...selected, landskap])
    }
  }

  const remove = (landskap: Landskap) => {
    commit(selected.filter((item) => item !== landskap))
  }

  const clear = () => {
    onChange([])
  }

  const triggerLabel =
    selected.length === 0
      ? 'Alla landskap'
      : selected.length === 1
        ? LANDSKAP_LABELS[selected[0]!]
        : `${selected.length} landskap valda`

  return (
    <div className={FILTER_FIELDSET_CLASS}>
      <fieldset className="flex flex-col gap-2" aria-describedby={disabled ? hintId : undefined}>
        <legend id={labelId} className={FILTER_LABEL_CLASS}>
          Landskap
        </legend>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="md"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={`Landskap: ${triggerLabel}`}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              className={cn(
                'w-full justify-between font-normal text-left',
                selected.length === 0 && !disabled && 'text-stone',
              )}
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin size={16} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{triggerLabel}</span>
              </span>
              <ChevronsUpDown
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
                className="shrink-0 opacity-70"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={8}
            collisionPadding={{ top: 12, bottom: 96 }}
            className="z-[70] w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0"
          >
            <Command>
              <CommandInput placeholder="Sök landskap…" />
              <CommandList className="max-h-[280px]">
                <CommandEmpty>Inga landskap matchar.</CommandEmpty>
                {LANDSDEL_ORDER.map((landsdel, index) => (
                  <React.Fragment key={landsdel}>
                    {index > 0 && <CommandSeparator />}
                    <CommandGroup heading={LANDSDEL_LABELS[landsdel]}>
                      {LANDSKAP_BY_LANDSDEL[landsdel].map((landskap) => {
                        const isSelected = selectedSet.has(landskap)
                        return (
                          <CommandItem
                            key={landskap}
                            value={LANDSKAP_LABELS[landskap]}
                            onSelect={() => toggle(landskap)}
                            aria-selected={isSelected}
                            className="cursor-pointer"
                          >
                            <Check
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                              className={cn('mr-1', isSelected ? 'opacity-100' : 'opacity-0')}
                            />
                            <span>{LANDSKAP_LABELS[landskap]}</span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </React.Fragment>
                ))}
              </CommandList>
              <div className="flex items-center justify-between gap-3 border-t border-mist-dark px-2 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  disabled={selected.length === 0}
                  className="text-stone"
                >
                  Rensa
                </Button>
                <span className={FILTER_HELP_TEXT_CLASS} aria-live="polite">
                  {selected.length === 0
                    ? 'Alla landskap visas'
                    : `${selected.length} valda`}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Klar
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        {disabled && (
          <p id={hintId} className={FILTER_HELP_TEXT_CLASS}>
            Du har valt Nära mig. Stäng av Nära mig för att välja landskap.
          </p>
        )}
      </fieldset>

      {!disabled && selected.length > 0 && (
        <ul
          aria-label="Valda landskap"
          className="flex flex-wrap gap-1.5"
        >
          {selected.map((landskap) => (
            <li key={landskap}>
              <RemovableFilterChip
                label={LANDSKAP_LABELS[landskap]}
                removeLabel={`Ta bort ${LANDSKAP_LABELS[landskap]}`}
                onRemove={() => remove(landskap)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
