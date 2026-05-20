'use client'

import * as React from 'react'
import { Loader2, MapPin, AlertCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

import { useGeolocation } from '@/lib/useGeolocation'
import {
  FILTER_FIELDSET_CLASS,
  FILTER_LABEL_CLASS,
} from './filterStyles'

const RADIUS_MIN = 5
const RADIUS_MAX = 100
const RADIUS_STEP = 5

export interface NearMeFilterProps {
  active: boolean
  radiusKm: number
  onActiveChange: (active: boolean) => void
  onRadiusChange: (radius: number) => void
  /** Receive coords from the geolocation API so parent can use them in applyFilters. */
  onCoordsChange?: ((coords: { lat: number; lng: number } | null) => void) | undefined
}

export function NearMeFilter({
  active,
  radiusKm,
  onActiveChange,
  onRadiusChange,
  onCoordsChange,
}: NearMeFilterProps) {
  const id = React.useId()
  const geo = useGeolocation()
  const [radius, setRadius] = React.useState(radiusKm)

  React.useEffect(() => setRadius(radiusKm), [radiusKm])

  React.useEffect(() => {
    if (!active) return
    if (geo.status === 'idle') {
      geo.request()
    }
  }, [active, geo])

  React.useEffect(() => {
    onCoordsChange?.(geo.coords)
    if (geo.status === 'denied' || geo.status === 'unavailable') {
      if (active) onActiveChange(false)
    }
  }, [geo.coords, geo.status, active, onActiveChange, onCoordsChange])

  const handleToggle = (next: boolean) => {
    onActiveChange(next)
    if (next && geo.status !== 'granted') geo.request()
    if (!next) geo.forget()
  }

  return (
    <div className={FILTER_FIELDSET_CLASS}>
      <div className="flex items-center gap-3">
        <Switch
          id={id}
          checked={active && geo.status === 'granted'}
          onCheckedChange={handleToggle}
          disabled={geo.status === 'unavailable'}
          className="shrink-0 data-[state=checked]:bg-pine data-[state=unchecked]:bg-mist-dark"
        />
        <Label htmlFor={id} className={`${FILTER_LABEL_CLASS} cursor-pointer inline-flex items-center gap-1.5`}>
          <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
          Nära mig
        </Label>
        {geo.status === 'prompting' && (
          <Loader2 size={14} className="animate-spin motion-reduce:animate-none text-stone" aria-hidden="true" />
        )}
        {(geo.status === 'denied' || geo.status === 'unavailable') && (
          <AlertCircle size={14} className="text-ember" aria-hidden="true" />
        )}
      </div>

      {active && geo.status === 'granted' && (
        <div className="flex flex-col gap-3 pl-1">
          <Slider
            value={[radius]}
            min={RADIUS_MIN}
            max={RADIUS_MAX}
            step={RADIUS_STEP}
            onValueChange={(next) => setRadius(next[0] ?? RADIUS_MIN)}
            onValueCommit={(next) => onRadiusChange(next[0] ?? RADIUS_MIN)}
            aria-label="Sökradie"
            aria-valuetext={`${radius} km från din position`}
          />
          <span className="text-xs text-stone">{radius} km radie</span>
        </div>
      )}
    </div>
  )
}


