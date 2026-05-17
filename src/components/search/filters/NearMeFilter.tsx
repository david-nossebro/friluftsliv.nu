'use client'

import * as React from 'react'
import { Loader2, MapPin, AlertCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useGeolocation, type GeolocationStatus } from '@/lib/useGeolocation'

const RADIUS_MIN = 5
const RADIUS_MAX = 100
const RADIUS_STEP = 5

export interface NearMeFilterProps {
  active: boolean
  radiusKm: number
  onActiveChange: (active: boolean) => void
  onRadiusChange: (radius: number) => void
  /** Receive coords from the geolocation API so parent can use them in applyFilters. */
  onCoordsChange?: (coords: { lat: number; lng: number } | null) => void
}

export function NearMeFilter({
  active,
  radiusKm,
  onActiveChange,
  onRadiusChange,
  onCoordsChange,
}: NearMeFilterProps) {
  const id = React.useId()
  const helpId = `${id}-help`
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
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <Label htmlFor={id} className="text-sm font-medium text-pine cursor-pointer flex items-center gap-1.5">
            <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
            Nära mig
          </Label>
          <span id={helpId} className="text-xs text-stone">
            {statusHint(geo.status)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {geo.status === 'prompting' && (
            <Loader2 size={14} className="animate-spin motion-reduce:animate-none text-stone" aria-hidden="true" />
          )}
          {(geo.status === 'denied' || geo.status === 'unavailable') && (
            <AlertCircle size={14} className="text-ember" aria-hidden="true" />
          )}
          <Switch
            id={id}
            checked={active && geo.status === 'granted'}
            onCheckedChange={handleToggle}
            disabled={geo.status === 'unavailable'}
            aria-describedby={helpId}
            className="data-[state=checked]:bg-pine data-[state=unchecked]:bg-mist-dark"
          />
        </div>
      </div>

      {active && geo.status === 'granted' && (
        <>
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
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone">{radius} km radie</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                geo.forget()
                onActiveChange(false)
              }}
              className="text-xs text-stone"
            >
              Glöm min position
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function statusHint(status: GeolocationStatus): string {
  switch (status) {
    case 'idle': return 'Visa det som ligger nära din nuvarande position.'
    case 'prompting': return 'Väntar på platsdelning…'
    case 'granted': return 'Din position används bara här i webbläsaren.'
    case 'denied': return 'Tillåt platsdelning i webbläsaren för att använda Nära mig.'
    case 'unavailable': return 'Din webbläsare stöder inte platsdelning.'
  }
}
