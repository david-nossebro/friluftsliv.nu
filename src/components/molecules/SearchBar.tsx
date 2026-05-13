'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/atoms/Input'
import { SearchResultRow } from './SearchResultRow'
import type { SearchSuggestion } from '@/types'

export interface SearchBarProps {
  label?: string
  placeholder?: string
  suggestions?: SearchSuggestion[]
  onQueryChange?: (query: string) => void
  onSubmit?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  className?: string
  size?: 'md' | 'lg'
}

export function SearchBar({
  label = 'Sök',
  placeholder = 'Sök rutter, stugor eller platser...',
  suggestions = [],
  onQueryChange,
  onSubmit,
  onSuggestionSelect,
  className,
  size = 'md',
}: SearchBarProps) {
  const inputId = React.useId()
  const listboxId = React.useId()
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filteredSuggestions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return []
    }

    return suggestions.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(normalizedQuery)
    )
  }, [query, suggestions])

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (!open || filteredSuggestions.length === 0) {
      setActiveIndex(-1)
      return
    }

    if (activeIndex >= filteredSuggestions.length) {
      setActiveIndex(filteredSuggestions.length - 1)
    }
  }, [activeIndex, filteredSuggestions.length, open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)
    setOpen(value.length > 0)
    setActiveIndex(-1)
    onQueryChange?.(value)
  }

  function handleClear() {
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    onQueryChange?.('')
  }

  function handleSelect(suggestion: SearchSuggestion) {
    setQuery(suggestion.name)
    setOpen(false)
    setActiveIndex(-1)
    onSuggestionSelect?.(suggestion)
  }

  function handleSubmit() {
    const trimmed = query.trim()

    if (!trimmed) {
      return
    }

    setOpen(false)
    setActiveIndex(-1)
    onSubmit?.(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      if (!showDropdown) {
        return
      }
      e.preventDefault()
      setActiveIndex((current) => (current + 1) % filteredSuggestions.length)
      return
    }

    if (e.key === 'ArrowUp') {
      if (!showDropdown) {
        return
      }
      e.preventDefault()
      setActiveIndex((current) => (
        current <= 0 ? filteredSuggestions.length - 1 : current - 1
      ))
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()

      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        handleSelect(filteredSuggestions[activeIndex])
        return
      }

      handleSubmit()
      return
    }

    if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const showDropdown = open && filteredSuggestions.length > 0
  const clampedActiveIndex = (
    activeIndex >= 0 && activeIndex < filteredSuggestions.length
      ? activeIndex
      : -1
  )
  const activeSuggestionId = clampedActiveIndex >= 0 ? `${listboxId}-option-${clampedActiveIndex}` : undefined

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative flex items-center">
        <Search
          size={size === 'lg' ? 18 : 15}
          strokeWidth={1.5}
          className="absolute left-4 text-stone pointer-events-none z-10"
          aria-hidden="true"
        />
        <Input
          id={inputId}
          variant="search"
          inputSize={size === 'lg' ? 'lg' : 'md'}
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onClear={handleClear}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setOpen(true)}
          onBlur={(event) => {
            if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
              setOpen(false)
              setActiveIndex(-1)
            }
          }}
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={showDropdown ? listboxId : undefined}
          aria-activedescendant={activeSuggestionId}
          className={cn(
            'pl-10',
            size === 'lg' && 'text-base rounded-xl py-4 pl-12'
          )}
        />
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Sökförslag"
          className={cn(
            'absolute top-full left-0 right-0 z-50 mt-1',
            'bg-white rounded-lg shadow-lg border border-mist-dark overflow-hidden'
          )}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <SearchResultRow
              id={`${listboxId}-option-${index}`}
              key={suggestion.id}
              suggestion={suggestion}
              isActive={clampedActiveIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onSelect={() => handleSelect(suggestion)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
