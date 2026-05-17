'use client'

import { useRouter } from 'next/navigation'
import { SiteHeader, type SiteHeaderProps } from '@/components/layout/SiteHeader'
import type { SearchSuggestion } from '@/types'
import { defaultSuggestions } from '@/data'

export interface HeaderSearchAdapterProps extends Omit<SiteHeaderProps, 'onSubmit' | 'onSuggestionSelect' | 'suggestions'> {
  /** Override the default search suggestions. */
  suggestions?: SearchSuggestion[]
}

export function HeaderSearchAdapter({
  suggestions = defaultSuggestions,
  ...rest
}: HeaderSearchAdapterProps) {
  const router = useRouter()

  function handleSubmit(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/utforska?q=${encodeURIComponent(trimmed)}`)
  }

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    const id = suggestion.id.replace(/^(route|cabin|area|utflykt|region)-/, '')
    switch (suggestion.type) {
      case 'utflykt':
        router.push(`/utflykter/${id}`)
        return
      case 'route':
        router.push(`/turer/${id}`)
        return
      case 'cabin':
        router.push(`/stugor/${id}`)
        return
      case 'area':
        router.push(`/omraden/${id}`)
        return
      case 'region':
      default:
        router.push(`/utforska?q=${encodeURIComponent(suggestion.name)}`)
    }
  }

  return (
    <SiteHeader
      {...rest}
      suggestions={suggestions}
      onSubmit={handleSubmit}
      onSuggestionSelect={handleSuggestionSelect}
    />
  )
}
