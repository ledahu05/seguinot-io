// T038 & T040 & T041: TimelineEntry component for individual career entries

'use client'

import { useState } from 'react'
import type { Project } from '@/lib/schemas/cv.schema'
import type { Screenshot } from '@/lib/schemas/screenshot.schema'
import { TimelineContent } from './TimelineContent'

interface TimelineEntryProps {
  project: Project
  screenshots: Screenshot[]
  onImageClick?: (screenshots: Screenshot[], index: number) => void
  isLeft?: boolean
}

export function TimelineEntry({
  project,
  screenshots,
  onImageClick,
  isLeft = false,
}: TimelineEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={`relative flex ${isLeft ? 'flex-row-reverse' : ''} items-start gap-4 md:gap-8`}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-5 hidden h-3 w-3 rounded-full bg-primary min-[407px]:block md:left-1/2 md:top-2 md:-translate-x-1/2" />

      {/* Content */}
      <div
        className={`ml-0 min-[407px]:ml-8 w-full md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}
      >
        <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
          {/* Header */}
          <div className="mb-3 space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {project.role} @ {project.company}
            </p>
            <p className="text-xs text-muted-foreground">
              {project.period.start} - {project.period.end} • {project.location}
            </p>
          </div>

          {/* Screenshots thumbnails */}
          {screenshots.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto">
              {screenshots.slice(0, 3).map((screenshot, index) => (
                <button
                  key={screenshot.filename}
                  onClick={() => onImageClick?.(screenshots, index)}
                  className="group relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border transition-transform hover:scale-105"
                >
                  <img
                    src={screenshot.path}
                    alt={screenshot.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
              {screenshots.length > 3 && (
                <button
                  onClick={() => onImageClick?.(screenshots, 3)}
                  className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground transition-colors hover:bg-muted/80"
                >
                  +{screenshots.length - 3} more
                </button>
              )}
            </div>
          )}

          {/* Expandable content */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-2 text-xs text-primary hover:underline"
          >
            {isExpanded ? 'Show less' : 'Show details'}
          </button>

          {isExpanded && (
            <TimelineContent
              highlights={project.highlights}
              technologies={project.technologies}
            />
          )}
        </div>
      </div>
    </div>
  )
}
