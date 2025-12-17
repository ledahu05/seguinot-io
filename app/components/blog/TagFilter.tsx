// T042 & T046: TagFilter component for active filter display with clear functionality

'use client'

import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { TagBadge } from './TagBadge'

interface TagFilterProps {
  tags: string[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      {/* Active filter indicator */}
      {activeTag && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {activeTag}
            </span>
            <Link
              to="/blog"
              search={{}}
              className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              aria-label="Clear filter"
            >
              <X className="h-3 w-3" />
              Clear
            </Link>
          </div>
        </div>
      )}

      {/* Tag list */}
      <div className="flex flex-wrap gap-2">
        <span className="mr-2 text-sm text-muted-foreground">Tags:</span>
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} isActive={tag === activeTag} />
        ))}
      </div>
    </div>
  )
}
