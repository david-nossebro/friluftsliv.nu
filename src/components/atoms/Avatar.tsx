import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  className?: string
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-2xs',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-sm',
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full',
        sizeMap[size],
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square w-full h-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className="flex w-full h-full items-center justify-center bg-mist text-pine font-body font-medium"
        delayMs={300}
      >
        {fallback ?? alt?.slice(0, 2).toUpperCase() ?? '?'}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
