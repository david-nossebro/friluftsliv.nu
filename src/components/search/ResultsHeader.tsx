'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  type FilterState,
  countActiveFilters,
  defaultFilterState,
} from '@/lib/exploreFilters'
import { LANDSKAP_LABELS } from '@/lib/landskap'
import { formatRouteShape } from '@/lib/routeShape'
import { formatMonth } from '@/lib/season'
import { FACILITY_LABELS } from '@/lib/facility'

export interface ResultsHeaderProps {
  state: FilterState
  patch: (partial: Partial<FilterState>) => void
  count: number
  className?: string
}

interface PillSpec {
  key: string
  label: string
  clear: () => void
}

export function ResultsHeader({ state, patch, count, className }: ResultsHeaderProps) {
  const activeCount = countActiveFilters(state)
  const pills = buildPills(state, patch)

  const reset = () => {
    const { tab, query } = state
    patch({ ...defaultFilterState, tab, query })
  }

  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="font-body text-sm text-ink-soft"
      >
        <span className="font-medium text-pine">{count}</span>{' '}
        {count === 1 ? 'resultat' : 'resultat'}
      </p>
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Aktiva filter">
          {pills.map((pill) => (
            <button
              type="button"
              key={pill.key}
              onClick={pill.clear}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mist text-xs text-ink-soft border border-mist-dark hover:bg-white hover:text-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-1"
              aria-label={`Ta bort filter: ${pill.label}`}
            >
              <span>{pill.label}</span>
              <X size={12} aria-hidden="true" />
            </button>
          ))}
          {activeCount > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-xs text-stone h-7"
            >
              Rensa alla
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function buildPills(state: FilterState, patch: (partial: Partial<FilterState>) => void): PillSpec[] {
  const pills: PillSpec[] = []

  for (const d of state.difficulty) {
    pills.push({
      key: `d-${d}`,
      label: d === 'easy' ? 'Lätt' : d === 'medium' ? 'Medel' : 'Krävande',
      clear: () => patch({ difficulty: state.difficulty.filter((x) => x !== d) }),
    })
  }
  if (state.routeShape) {
    pills.push({
      key: 'rs',
      label: formatRouteShape(state.routeShape),
      clear: () => patch({ routeShape: null }),
    })
  }
  if (state.distanceMinKm !== 0 || state.distanceMaxKm != null) {
    const maxLabel = state.distanceMaxKm == null ? '300+' : `${state.distanceMaxKm}`
    pills.push({
      key: 'dist',
      label: `${state.distanceMinKm}–${maxLabel} km`,
      clear: () => patch({ distanceMinKm: 0, distanceMaxKm: null }),
    })
  }
  if (state.durationMax != null) {
    const unit = state.durationUnit === 'hours' ? 'h' : 'd'
    pills.push({
      key: 'dur',
      label: `Upp till ${state.durationMax} ${unit}`,
      clear: () => patch({ durationMax: null }),
    })
  }
  for (const l of state.landskap) {
    pills.push({
      key: `l-${l}`,
      label: LANDSKAP_LABELS[l],
      clear: () => patch({ landskap: state.landskap.filter((x) => x !== l) }),
    })
  }
  for (const k of state.selectedKommun) {
    pills.push({
      key: `k-${k}`,
      label: k,
      clear: () => patch({ selectedKommun: state.selectedKommun.filter((x) => x !== k) }),
    })
  }
  for (const m of state.months) {
    pills.push({
      key: `m-${m}`,
      label: formatMonth(m),
      clear: () => patch({ months: state.months.filter((x) => x !== m) }),
    })
  }
  if (state.publicTransport) {
    pills.push({
      key: 'pt',
      label: 'Med kollektivtrafik',
      clear: () => patch({ publicTransport: false }),
    })
  }
  if (state.nearMe) {
    pills.push({
      key: 'nm',
      label: `Nära mig (${state.nearMeRadiusKm} km)`,
      clear: () => patch({ nearMe: false }),
    })
  }
  if (state.dogsAllowed) pills.push({ key: 'dog', label: 'Hund välkommen', clear: () => patch({ dogsAllowed: false }) })
  if (state.tentingAllowed) pills.push({ key: 'tent', label: 'Tält tillåtet', clear: () => patch({ tentingAllowed: false }) })
  if (state.hasCabinsAlong) pills.push({ key: 'cab', label: 'Stugor längs leden', clear: () => patch({ hasCabinsAlong: false }) })
  for (const f of state.cabinFacilities) {
    pills.push({
      key: `fac-${f}`,
      label: FACILITY_LABELS[f],
      clear: () => patch({ cabinFacilities: state.cabinFacilities.filter((x) => x !== f) }),
    })
  }
  if (state.cabinServiceType !== 'any') {
    pills.push({
      key: 'cst',
      label: state.cabinServiceType.charAt(0).toUpperCase() + state.cabinServiceType.slice(1),
      clear: () => patch({ cabinServiceType: 'any' }),
    })
  }

  return pills
}
