import { cn } from '@/lib/utils'

export type LogoVariant = 'default' | 'reversed' | 'mark-only' | 'all-white'
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

export interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
}

const sizeMap: Record<LogoSize, { mark: number; text: number; gap: number }> = {
  sm: { mark: 20, text: 14, gap: 8 },
  md: { mark: 28, text: 18, gap: 10 },
  lg: { mark: 36, text: 24, gap: 14 },
  xl: { mark: 48, text: 32, gap: 18 },
}

const colorMap: Record<LogoVariant, { back: string; mid: string; front: string; primary: string; suffix: string }> = {
  default: {
    back: '#B5C9A1',
    mid: '#4A7C59',
    front: '#2C4A3E',
    primary: '#2C4A3E',
    suffix: '#4A7C59',
  },
  reversed: {
    back: 'rgba(181,201,161,0.28)',
    mid: 'rgba(181,201,161,0.55)',
    front: '#B5C9A1',
    primary: '#F8FAF7',
    suffix: '#B5C9A1',
  },
  'mark-only': {
    back: '#B5C9A1',
    mid: '#4A7C59',
    front: '#2C4A3E',
    primary: '#2C4A3E',
    suffix: '#4A7C59',
  },
  'all-white': {
    back: 'rgba(255,255,255,0.32)',
    mid: 'rgba(255,255,255,0.60)',
    front: '#FFFFFF',
    primary: '#FFFFFF',
    suffix: '#FFFFFF',
  },
}

export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  const { mark: markSize, text: textSize, gap } = sizeMap[size]
  const colors = colorMap[variant]
  const markHeight = markSize
  const markWidth = Math.round(markSize * 1.2)

  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={{ gap }}
      aria-label="friluftsliv.nu"
    >
      {/* The Ridgeline mark */}
      <svg
        width={markWidth}
        height={markHeight}
        viewBox="0 0 60 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <polygon points="2,48 20,8 38,48" fill={colors.back} />
        <polygon points="20,48 37,16 54,48" fill={colors.mid} />
        <polygon points="10,48 28,2 46,48" fill={colors.front} />
      </svg>

      {/* Wordmark */}
      {variant !== 'mark-only' && (
        <span
          aria-hidden="true"
          style={{
            fontSize: textSize,
            lineHeight: 1,
            letterSpacing: '-0.025em',
            fontFamily: 'var(--font-body)',
            userSelect: 'none',
          }}
        >
          <span style={{ fontWeight: 500, color: colors.primary }}>friluftsliv</span>
          <span style={{ fontWeight: 300, color: colors.suffix }}>.nu</span>
        </span>
      )}
    </div>
  )
}
