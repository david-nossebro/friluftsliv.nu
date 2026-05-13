import { MapPin, Route, Home, Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchSuggestion } from '@/types'

export interface SearchResultRowProps {
  id?: string
  suggestion: SearchSuggestion
  isActive?: boolean
  onMouseEnter?: () => void
  onSelect?: () => void
  className?: string
}

const typeConfig = {
  route:  { label: 'Rutt',   icon: Route },
  cabin:  { label: 'Stuga',  icon: Home },
  area:   { label: 'Område', icon: Map },
  region: { label: 'Region', icon: MapPin },
}

export function SearchResultRow({
  id,
  suggestion,
  isActive = false,
  onMouseEnter,
  onSelect,
  className,
}: SearchResultRowProps) {
  const { label, icon: Icon } = typeConfig[suggestion.type]
  return (
    <li
      id={id}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onMouseEnter}
      onMouseDown={(event) => {
        event.preventDefault()
        onSelect?.()
      }}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3',
        'text-left font-body',
        'transition-colors duration-[80ms]',
        isActive ? 'bg-mist' : 'hover:bg-mist',
        className
      )}
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-md bg-white ring-1 ring-inset ring-birch text-stone shrink-0">
        <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-ink truncate">{suggestion.name}</span>
        <span className="block text-xs text-stone">{label}</span>
      </span>
      {suggestion.distance != null && (
        <span className="text-xs text-stone shrink-0">{suggestion.distance} km</span>
      )}
    </li>
  )
}
