'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, User } from 'lucide-react'
import { focusFirstElement, trapFocus } from '@/lib/a11y'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/SearchBar'
import type { SearchSuggestion } from '@/types'

export interface NavItem {
  label: string
  href: string
}

const defaultNav: NavItem[] = [
  { label: 'Karta', href: '/karta' },
  { label: 'Utforska', href: '/utforska' },
  { label: 'Om oss', href: '/om' },
]

export interface SiteHeaderProps {
  nav?: NavItem[]
  currentPath?: string
  suggestions?: SearchSuggestion[]
  onSubmit?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  className?: string
}

export function SiteHeader({
  nav = defaultNav,
  currentPath,
  suggestions,
  onSubmit,
  onSuggestionSelect,
  className,
}: SiteHeaderProps) {
  const menuId = React.useId()
  const menuHeadingId = React.useId()
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = React.useState(false)

  React.useEffect(() => {
    if (!menuOpen || !menuRef.current) {
      return
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    focusFirstElement(menuRef.current)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [menuOpen])

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    setMenuOpen(false)
    onSuggestionSelect?.(suggestion)
  }

  function handleSubmit(query: string) {
    if (query) setMenuOpen(false)
    onSubmit?.(query)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm',
          'border-b border-mist-dark',
          'shadow-sm',
          className
        )}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-6 h-[60px]">
          {/* Logo */}
          <Link href="/" aria-label="Hem — friluftsliv.nu" className="flex items-center self-stretch">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Huvudmeny" className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={currentPath === item.href ? 'page' : undefined}
                className={cn(
                  'px-3 py-1.5 rounded-md font-body text-sm font-medium',
                  'transition-colors duration-[120ms]',
                  currentPath === item.href
                    ? 'text-pine bg-mist'
                    : 'text-ink-soft hover:text-pine hover:bg-mist'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <SearchBar
              label="Sök i sidhuvudet"
              size="md"
              placeholder="Sök rutter och stugor..."
              suggestions={suggestions}
              onSubmit={handleSubmit}
              onSuggestionSelect={handleSuggestionSelect}
            />
          </div>

          {/* Desktop login */}
          <Button variant="secondary" size="sm" className="hidden md:inline-flex ml-auto">
            <User size={14} aria-hidden="true" />
            Logga in
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-pine hover:bg-mist transition-colors"
          >
            {menuOpen
              ? <X size={22} strokeWidth={1.5} aria-hidden="true" />
              : <Menu size={22} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- aria-modal dialog overlay; keydown handler is the focus trap
        <div
          id={menuId}
          ref={menuRef}
          className="md:hidden fixed inset-0 z-40 bg-white pt-[60px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuHeadingId}
          onKeyDown={(event) => trapFocus(event.currentTarget, event)}
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 id={menuHeadingId} className="font-body text-sm font-medium text-pine">
                Meny
              </h2>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Stäng meny"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md text-pine hover:bg-mist transition-colors"
              >
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <SearchBar
              label="Sök i mobilmenyn"
              placeholder="Sök rutter och stugor..."
              suggestions={suggestions}
              onSubmit={handleSubmit}
              onSuggestionSelect={handleSuggestionSelect}
            />
            <nav aria-label="Mobilnavigation" className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={currentPath === item.href ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg font-body text-base font-medium',
                    'transition-colors duration-[120ms]',
                    currentPath === item.href
                      ? 'text-pine bg-mist'
                      : 'text-ink hover:bg-mist hover:text-pine'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button variant="primary" size="lg" className="mt-2 w-full">
              <User size={16} aria-hidden="true" />
              Logga in
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
