// T041: TagBadge component for clickable tag pills

'use client'

import { Link } from '@tanstack/react-router'

interface TagBadgeProps {
  tag: string
  isActive?: boolean
  onClick?: () => void
}

export function TagBadge({ tag, isActive = false, onClick }: TagBadgeProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        aria-pressed={isActive}
      >
        {tag}
      </button>
    )
  }

  return (
    <Link
      to="/blog"
      search={{ tag }}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {tag}
    </Link>
  )
}
