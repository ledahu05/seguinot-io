// T015: EmptyState component for when no blog posts are available

'use client'

import { FileText } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({
  title = 'No articles yet',
  message = 'Check back soon for new content.',
}: EmptyStateProps) {
  return (
    <div
      className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border/50 bg-muted/30 p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <FileText
        className="mb-4 h-16 w-16 text-muted-foreground/50"
        aria-hidden="true"
      />
      <h2 className="mb-2 text-xl font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
