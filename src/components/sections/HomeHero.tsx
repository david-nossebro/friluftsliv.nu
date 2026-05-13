'use client'

import { useRouter } from 'next/navigation'
import { HeroSearch, type HeroSearchProps } from '@/components/search/HeroSearch'
import type { SearchSuggestion } from '@/types'

export type HomeHeroProps = Omit<HeroSearchProps, 'onSubmit' | 'onSuggestionSelect'>

export function HomeHero(props: HomeHeroProps) {
  const router = useRouter()

  function handleSubmit(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/utforska?q=${encodeURIComponent(trimmed)}`)
  }

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    const id = suggestion.id.replace(/^(route|cabin|area|region)-/, '')
    switch (suggestion.type) {
      case 'route':
        router.push(`/turer/${id}`)
        return
      case 'cabin':
        router.push(`/stugor/${id}`)
        return
      case 'area':
      case 'region':
      default:
        router.push(`/utforska?q=${encodeURIComponent(suggestion.name)}`)
    }
  }

  return (
    <HeroSearch
      {...props}
      onSubmit={handleSubmit}
      onSuggestionSelect={handleSuggestionSelect}
    />
  )
}
