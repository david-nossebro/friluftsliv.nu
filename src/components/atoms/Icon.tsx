import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps {
  icon: LucideIcon
  size?: IconSize
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

export function Icon({ icon: LucideComponent, size = 'md', className, ...props }: IconProps) {
  const px = sizeMap[size]
  return (
    <LucideComponent
      width={px}
      height={px}
      strokeWidth={1.5}
      className={cn('shrink-0', className)}
      {...props}
    />
  )
}
