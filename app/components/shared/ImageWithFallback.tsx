// T089: Image component with fallback/placeholder for missing screenshots

'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackClassName = '',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${fallbackClassName || className}`}
        role="img"
        aria-label={`${alt} (image unavailable)`}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="h-8 w-8" aria-hidden="true" />
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div
          className={`animate-pulse bg-muted ${className}`}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'invisible absolute' : ''}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />
    </>
  )
}
