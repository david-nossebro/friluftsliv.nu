/* eslint-disable @next/next/no-img-element -- Storybook substitute for next/image; raw <img> is intentional */
import * as React from 'react'

interface ImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  style?: React.CSSProperties
}

export default function Image({ src, alt, fill, width, height, className, style }: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }}
      />
    )
  }
  return <img src={src} alt={alt} width={width} height={height} className={className} style={style} />
}
