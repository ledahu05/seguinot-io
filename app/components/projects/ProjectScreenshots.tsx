// T056 & T058: ProjectScreenshots component for image gallery

'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Screenshot } from '@/lib/schemas/screenshot.schema'

interface ProjectScreenshotsProps {
  screenshots: Screenshot[]
  onImageClick?: (index: number) => void
}

export function ProjectScreenshots({
  screenshots,
  onImageClick,
}: ProjectScreenshotsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (screenshots.length === 0) {
    return null
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
        <button
          onClick={() => onImageClick?.(currentIndex)}
          className="h-full w-full"
        >
          <img
            src={screenshots[currentIndex].path}
            alt={screenshots[currentIndex].alt}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        </button>

        {/* Navigation arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {screenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.filename}
              onClick={() => setCurrentIndex(index)}
              className={`h-12 w-16 flex-shrink-0 overflow-hidden rounded border transition-all ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img
                src={screenshot.path}
                alt={screenshot.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
