// T088: Graceful error state component for malformed JSON edge case

'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to load content. Please try again later.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" aria-hidden="true" />
      <h3 className="mb-2 text-lg font-semibold text-destructive">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
