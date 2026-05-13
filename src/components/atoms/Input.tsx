'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InputVariant = 'default' | 'search'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant
  onClear?: () => void
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', onClear, inputSize = 'md', className, value, onChange, ...props }, ref) => {
    const hasValue = Boolean(value)
    const type = props.type ?? (variant === 'search' ? 'search' : undefined)

    const sizeClasses = {
      sm: 'py-2 px-3 text-xs',
      md: 'py-[11px] px-4 text-sm',
      lg: 'py-4 px-5 text-base',
    }

    return (
      <div className="relative flex items-center w-full">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full font-body font-light bg-white text-ink placeholder:text-stone',
            'rounded-lg border border-mist-dark outline-none',
            'transition-all duration-[120ms] ease-out',
            'focus:border-moss focus:ring-2 focus:ring-moss/12',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[inputSize],
            variant === 'search' && 'pr-10',
            className
          )}
          {...props}
        />
        {variant === 'search' && hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Rensa sökning"
            className={cn(
              'absolute right-3 flex items-center justify-center',
              'w-5 h-5 rounded-full bg-stone/20 text-stone hover:bg-stone/30',
              'transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-moss'
            )}
          >
            <X size={12} strokeWidth={2} />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
