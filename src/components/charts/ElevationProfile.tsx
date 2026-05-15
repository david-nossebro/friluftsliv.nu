'use client'

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { cumulativeDistanceKm } from '@/lib/elevation'
import { getActivityColor } from '@/lib/activityColor'
import type { ActivityType, MapPosition } from '@/types'

const PADDING = { left: 44, right: 24, top: 14, bottom: 26 }

export interface ElevationProfileProps {
  track: MapPosition[]
  activityType?: ActivityType
  /** Pixel height of the chart. Defaults to 160. */
  height?: number
  /** Optional override for the SVG aria-label. */
  ariaLabel?: string
  /** Fires with the current distance under the cursor in km, or null when scrub ends. */
  onScrub?: (distanceKm: number | null) => void
}

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  vandring: 'Vandring',
  topptur: 'Topptur',
  skidtur: 'Skidtur',
  cykeltur: 'Cykeltur',
  paddeltur: 'Paddeltur',
  stugtur: 'Stugtur',
}

function formatKm(km: number): string {
  if (km < 10) return km.toFixed(1)
  return Math.round(km).toString()
}

export function ElevationProfile({
  track,
  activityType,
  height = 160,
  ariaLabel,
  onScrub,
}: ElevationProfileProps) {
  const data = useMemo(() => {
    if (track.length < 2) return null
    if (track.some((p) => p.ele === undefined)) return null
    const cumKm = cumulativeDistanceKm(track)
    const totalKm = cumKm[cumKm.length - 1] ?? 0
    if (totalKm <= 0) return null
    const eles = track.map((p) => p.ele as number)
    const minE = Math.min(...eles)
    const maxE = Math.max(...eles)
    let gain = 0
    for (let i = 1; i < eles.length; i++) {
      const d = (eles[i] ?? 0) - (eles[i - 1] ?? 0)
      if (d > 0) gain += d
    }
    return { cumKm, totalKm, minE, maxE, gain }
  }, [track])

  const captionId = useId()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(800)
  const [cursorKm, setCursorKm] = useState<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const update = () => setWidth(Math.max(280, el.getBoundingClientRect().width))
    update()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!data) return null

  const { cumKm, totalKm, minE, maxE, gain } = data
  const color = getActivityColor(activityType)
  const plotW = Math.max(1, width - PADDING.left - PADDING.right)
  const plotH = Math.max(1, height - PADDING.top - PADDING.bottom)
  const eleRange = Math.max(1, maxE - minE)
  const baselineY = height - PADDING.bottom

  const xForKm = (km: number) => PADDING.left + (km / totalKm) * plotW
  const yForEle = (ele: number) => PADDING.top + (1 - (ele - minE) / eleRange) * plotH

  const pts = track.map(
    (p, i) => `${xForKm(cumKm[i] ?? 0).toFixed(2)},${yForEle(p.ele as number).toFixed(2)}`,
  )
  const linePath = `M ${pts.join(' L ')}`
  const areaPath =
    `M ${xForKm(0).toFixed(2)},${baselineY} L ${pts.join(' L ')} ` +
    `L ${xForKm(totalKm).toFixed(2)},${baselineY} Z`

  const cursorEle =
    cursorKm === null
      ? null
      : (() => {
          let i = 1
          while (i < cumKm.length && (cumKm[i] ?? 0) < cursorKm) i++
          const prevKm = cumKm[i - 1] ?? 0
          const nextKm = cumKm[i] ?? prevKm
          const t = nextKm === prevKm ? 0 : (cursorKm - prevKm) / (nextKm - prevKm)
          const prevE = track[i - 1]?.ele ?? 0
          const nextE = track[i]?.ele ?? prevE
          return prevE + (nextE - prevE) * t
        })()

  function report(km: number | null) {
    setCursorKm(km)
    onScrub?.(km)
  }

  function kmFromClientX(clientX: number): number | null {
    const el = containerRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const xPx = clientX - rect.left
    const km = ((xPx - PADDING.left) / plotW) * totalKm
    if (km < 0 || km > totalKm) return null
    return km
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    report(kmFromClientX(e.clientX))
  }
  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    report(kmFromClientX(e.clientX))
  }
  function handlePointerLeave(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse') return
    report(null)
  }
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = totalKm * 0.05
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      report(Math.min(totalKm, (cursorKm ?? 0) + step))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      report(Math.max(0, (cursorKm ?? totalKm) - step))
    } else if (e.key === 'Home') {
      e.preventDefault()
      report(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      report(totalKm)
    } else if (e.key === 'Escape') {
      report(null)
    }
  }
  function handleBlur() {
    report(null)
  }

  const minLabel = Math.round(minE)
  const maxLabel = Math.round(maxE)
  const totalLabel = Math.round(totalKm)
  const gainLabel = Math.round(gain)
  const caption = `Höjd: ${minLabel}–${maxLabel} m · totalt ${gainLabel} höjdmeter över ${totalLabel} km`
  const computedAriaLabel =
    ariaLabel ?? `Höjdprofil: ${minLabel} till ${maxLabel} meter över ${totalLabel} kilometer`

  // X-axis ticks: 3 ticks for short, 5 for long
  const tickCount = totalKm < 5 ? 3 : totalKm < 25 ? 4 : 5
  const xTicks: number[] = []
  for (let i = 0; i < tickCount; i++) xTicks.push((totalKm * i) / (tickCount - 1))

  // Tooltip box, clamped within the plot area
  const tooltipW = 110
  const tooltipH = 26
  const tooltipX =
    cursorKm !== null
      ? Math.max(
          PADDING.left,
          Math.min(width - PADDING.right - tooltipW, xForKm(cursorKm) - tooltipW / 2),
        )
      : 0
  const tooltipY =
    cursorEle !== null ? Math.max(PADDING.top, yForEle(cursorEle) - tooltipH - 10) : 0

  const cursorLabel =
    cursorKm !== null && cursorEle !== null
      ? `${formatKm(cursorKm)} km · ${Math.round(cursorEle)} m`
      : ''

  return (
    <figure className="flex flex-col gap-2" data-activity={activityType ?? 'default'}>
      <div
        ref={containerRef}
        role="slider"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={Math.round(totalKm)}
        aria-valuenow={Math.round(cursorKm ?? 0)}
        aria-valuetext={cursorLabel || undefined}
        aria-label={computedAriaLabel}
        aria-describedby={captionId}
        tabIndex={0}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="bg-snow rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2"
        style={{ height: `${height}px`, touchAction: 'pan-y' }}
      >
        <svg
          width={width}
          height={height}
          aria-hidden="true"
          style={{ display: 'block' }}
        >
          <path d={areaPath} fill={color} opacity="0.12" />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={PADDING.left - 6}
            y={PADDING.top + 4}
            textAnchor="end"
            className="fill-stone font-body"
            style={{ fontSize: 11 }}
          >
            {maxLabel} m
          </text>
          <text
            x={PADDING.left - 6}
            y={baselineY}
            textAnchor="end"
            className="fill-stone font-body"
            style={{ fontSize: 11 }}
          >
            {minLabel} m
          </text>
          {xTicks.map((tick, i) => {
            const isLast = i === xTicks.length - 1
            const anchor: 'start' | 'middle' | 'end' = i === 0 ? 'start' : isLast ? 'end' : 'middle'
            const label = isLast ? `${formatKm(tick)} km` : formatKm(tick)
            return (
              <text
                key={i}
                x={xForKm(tick)}
                y={height - 8}
                textAnchor={anchor}
                className="fill-stone font-body"
                style={{ fontSize: 11 }}
              >
                {label}
              </text>
            )
          })}
          {cursorKm !== null && cursorEle !== null && (
            <g>
              <line
                x1={xForKm(cursorKm)}
                x2={xForKm(cursorKm)}
                y1={PADDING.top}
                y2={baselineY}
                stroke="#5F7568"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
              <circle
                cx={xForKm(cursorKm)}
                cy={yForEle(cursorEle)}
                r="5"
                fill={color}
                stroke="#F8FAF7"
                strokeWidth="2"
              />
              <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                <rect
                  width={tooltipW}
                  height={tooltipH}
                  rx="6"
                  fill="#FFFFFF"
                  stroke="#E2EBE0"
                />
                <text
                  x={tooltipW / 2}
                  y={tooltipH / 2 + 4}
                  textAnchor="middle"
                  className="fill-pine font-body"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  {cursorLabel}
                </text>
              </g>
            </g>
          )}
        </svg>
        {cursorKm !== null && cursorEle !== null && (
          <div role="status" aria-live="polite" className="sr-only">
            {`${formatKm(cursorKm)} kilometer, ${Math.round(cursorEle)} meter`}
          </div>
        )}
      </div>
      <figcaption id={captionId} className="flex items-center gap-2 font-body text-xs text-stone">
        {activityType && (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-pine font-medium">{ACTIVITY_LABELS[activityType]}</span>
            <span aria-hidden="true">·</span>
          </span>
        )}
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}
