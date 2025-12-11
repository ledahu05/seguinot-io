/**
 * Rules page route for Quarto game
 * @module routes/games/quarto/rules
 */

import { Suspense, lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';

// Lazy load RulesPage for code splitting
const RulesPage = lazy(() =>
  import('@/features/quarto/components/rules/RulesPage').then((mod) => ({
    default: mod.RulesPage,
  }))
);

/**
 * Loading fallback component
 */
function RulesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header skeleton */}
      <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="h-5 w-12 animate-pulse rounded bg-slate-700" />
          <div className="h-6 w-32 animate-pulse rounded bg-slate-700" />
          <div className="w-12" />
        </div>
      </header>

      {/* Content skeleton */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex justify-center">
          <div className="h-5 w-64 animate-pulse rounded bg-slate-700" />
        </div>

        <div className="space-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded bg-slate-700" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-700" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-700" />
              </div>
              <div className="h-48 animate-pulse rounded-lg bg-slate-800" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute('/games/quarto/rules')({
  component: function RulesPageRoute() {
    return (
      <Suspense fallback={<RulesPageSkeleton />}>
        <RulesPage />
      </Suspense>
    );
  },
});
