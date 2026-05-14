'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type LogoLoaderVariant = 'default' | 'reversed' | 'mono-pine' | 'all-white'
export type LogoLoaderSize = 'sm' | 'md' | 'lg' | 'xl'

export interface LogoLoaderProps {
  variant?: LogoLoaderVariant
  size?: LogoLoaderSize
  className?: string
  duration?: number
  label?: string
  caption?: string
}

const sizeMap: Record<LogoLoaderSize, number> = {
  sm: 20,
  md: 28,
  lg: 36,
  xl: 48,
}

const captionSizeMap: Record<LogoLoaderSize, number> = {
  sm: 9,
  md: 10,
  lg: 11,
  xl: 12,
}

const gapMap: Record<LogoLoaderSize, number> = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
}

type VariantConfig = {
  back: string
  mid: string
  front: string
  backOpacity: number
  midOpacity: number
  frontOpacity: number
  captionColor: string
}

const variantConfig: Record<LogoLoaderVariant, VariantConfig> = {
  default: {
    back: '#B5C9A1',
    mid: '#4A7C59',
    front: '#2C4A3E',
    backOpacity: 0.55,
    midOpacity: 0.8,
    frontOpacity: 1,
    captionColor: '#A0B8AB',
  },
  reversed: {
    back: 'rgba(181,201,161,0.28)',
    mid: 'rgba(181,201,161,0.55)',
    front: '#B5C9A1',
    backOpacity: 1,
    midOpacity: 1,
    frontOpacity: 1,
    captionColor: 'rgba(248,250,247,0.5)',
  },
  'mono-pine': {
    back: 'rgba(44,74,62,0.20)',
    mid: 'rgba(44,74,62,0.35)',
    front: 'rgba(44,74,62,0.55)',
    backOpacity: 1,
    midOpacity: 1,
    frontOpacity: 1,
    captionColor: '#A0B8AB',
  },
  'all-white': {
    back: 'rgba(255,255,255,0.32)',
    mid: 'rgba(255,255,255,0.60)',
    front: 'rgba(255,255,255,0.92)',
    backOpacity: 1,
    midOpacity: 1,
    frontOpacity: 1,
    captionColor: 'rgba(255,255,255,0.5)',
  },
}

export function LogoLoader({
  variant = 'default',
  size = 'md',
  className,
  duration = 2.4,
  label,
  caption,
}: LogoLoaderProps) {
  const height = sizeMap[size]
  const width = Math.round(height * 1.2)
  const config = variantConfig[variant]
  const step = duration / 3
  const captionSize = captionSizeMap[size]
  const gap = gapMap[size]
  const textDuration = duration * 1.5

  const ariaLabel = label ?? caption ?? 'Laddar…'

  const cssVars = {
    '--ll-back': config.back,
    '--ll-mid': config.mid,
    '--ll-front': config.front,
    '--ll-back-opacity': String(config.backOpacity),
    '--ll-mid-opacity': String(config.midOpacity),
    '--ll-front-opacity': String(config.frontOpacity),
    '--ll-duration': `${duration}s`,
    '--ll-text-duration': `${textDuration}s`,
    '--ll-caption-color': config.captionColor,
  } as React.CSSProperties

  const polyStyle = (delaySteps: number): React.CSSProperties => ({
    animation: `logo-loader-cycle var(--ll-duration, 2.4s) cubic-bezier(0.45, 0, 0.55, 1) infinite`,
    animationDelay: `${-(delaySteps * step)}s`,
    willChange: 'transform, opacity',
  })

  const captionStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: captionSize,
    fontWeight: 500,
    letterSpacing: '0.16em',
    lineHeight: 1,
    textTransform: 'uppercase',
    color: 'var(--ll-caption-color)',
    animation: `logo-loader-text-pulse var(--ll-text-duration, 3.6s) cubic-bezier(0.45, 0, 0.55, 1) infinite`,
    willChange: 'opacity',
    userSelect: 'none',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        caption && 'flex-col',
        className
      )}
      style={{ ...cssVars, gap: caption ? gap : undefined }}
      role="status"
      aria-label={ariaLabel}
    >
      <style>{`
        @keyframes logo-loader-cycle {
          0%, 100% {
            fill: var(--ll-back);
            opacity: var(--ll-back-opacity);
            transform: translateY(0);
          }
          33.33% {
            fill: var(--ll-mid);
            opacity: var(--ll-mid-opacity);
            transform: translateY(0);
          }
          66.67% {
            fill: var(--ll-front);
            opacity: var(--ll-front-opacity);
            transform: translateY(-2px);
          }
        }
        @keyframes logo-loader-text-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-loader-poly {
            animation: none !important;
            fill: var(--ll-mid) !important;
            opacity: var(--ll-mid-opacity) !important;
            transform: none !important;
          }
          .logo-loader-caption {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
      <svg
        width={width}
        height={height}
        viewBox="0 0 60 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {/* Back peak — starts at back role */}
        <polygon
          points="2,48 20,8 38,48"
          className="logo-loader-poly"
          style={polyStyle(0)}
        />
        {/* Mid peak — starts at mid role */}
        <polygon
          points="20,48 37,16 54,48"
          className="logo-loader-poly"
          style={polyStyle(1)}
        />
        {/* Front peak — starts at front role */}
        <polygon
          points="10,48 28,2 46,48"
          className="logo-loader-poly"
          style={polyStyle(2)}
        />
      </svg>
      {caption && (
        <span className="logo-loader-caption" style={captionStyle}>
          {caption}
        </span>
      )}
    </span>
  )
}
