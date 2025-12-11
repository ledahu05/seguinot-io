# Research: Quarto Game Rules Page

**Feature**: 004-quarto-rules-page
**Date**: 2025-12-11

## Research Summary

All technical unknowns resolved. No new dependencies required - implementation uses existing project libraries.

---

## 1. Turn Animation State Machine

**Decision**: Use a finite state machine with Framer Motion's `AnimatePresence` for the turn demonstration animation.

**Rationale**:
- Framer Motion is already in the project (v12.23.25)
- State machine provides clear, testable transitions
- AnimatePresence handles enter/exit animations cleanly

**Implementation Pattern**:
```typescript
type AnimationState =
  | 'idle'           // Animation not started
  | 'give-piece'     // Arrow showing piece transfer to player
  | 'place-piece'    // Piece moving to board position
  | 'select-next'    // Player choosing piece for opponent
  | 'opponent-turn'; // Repeat for opponent

// State transitions with timing
const ANIMATION_TIMING = {
  'give-piece': 1500,    // 1.5s to show piece transfer
  'place-piece': 1200,   // 1.2s to animate placement
  'select-next': 1500,   // 1.5s to show selection
};
```

**Alternatives Considered**:
- React Spring: Already used for 3D but overkill for 2D state machine
- CSS animations: Less control over timing and state synchronization
- XState: Powerful but adds dependency for simple use case

---

## 2. Winning Line Overlay Visualization

**Decision**: Use SVG overlays positioned absolutely over the Board3D canvas.

**Rationale**:
- SVG allows precise line drawing with customizable styles
- Easier to animate than 3D geometry
- Separation of concerns: 3D board handles pieces, SVG handles overlays
- Better performance than adding 3D line geometries

**Implementation Pattern**:
```typescript
const WINNING_LINES = [
  { id: 'row-0', positions: [0, 1, 2, 3], path: 'M10,25 L90,25' },
  { id: 'col-0', positions: [0, 4, 8, 12], path: 'M25,10 L25,90' },
  { id: 'diag-0', positions: [0, 5, 10, 15], path: 'M10,10 L90,90' },
  // ... 7 more lines
];
```

**Alternatives Considered**:
- 3D line geometry in Three.js: More complex, harder to animate colors
- Canvas 2D overlay: Less declarative, harder to style
- Highlight board positions only: Less clear than continuous lines

---

## 3. Piece Tooltip Implementation

**Decision**: Use Radix UI Tooltip (already available via Shadcn patterns) with custom content.

**Rationale**:
- Radix is the recommended headless library per constitution
- Handles accessibility (ARIA), positioning, and mobile
- Consistent with existing Shadcn UI patterns in project

**Implementation Pattern**:
```typescript
<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <PieceWrapper piece={piece} />
  </Tooltip.Trigger>
  <Tooltip.Content>
    <PieceAttributes piece={piece} />
  </Tooltip.Content>
</Tooltip.Root>
```

**Mobile Behavior**:
- Tap to show tooltip (toggle)
- Tap elsewhere to dismiss
- Touch targets: 44x44px minimum

**Alternatives Considered**:
- Custom tooltip: More work, less accessible
- Title attribute: No styling, poor mobile support
- Floating UI: Would add dependency

---

## 4. 3D Canvas Loading Strategy

**Decision**: Lazy-load the 3D canvas with Suspense and show a skeleton placeholder.

**Rationale**:
- Constitution requires LCP < 2.5s and bundle < 100KB gzip
- 3D components are heavy; lazy loading improves initial load
- Existing `Canvas3DLoader` component provides loading state pattern

**Implementation Pattern**:
```typescript
const PieceGrid3D = lazy(() => import('./PieceGrid3D'));

// In component
<Suspense fallback={<PieceGridSkeleton />}>
  <PieceGrid3D pieces={allPieces} />
</Suspense>
```

**Alternatives Considered**:
- Eager loading: Hurts LCP, fails performance gate
- 2D fallback only: Loses 3D interactivity benefit
- Intersection Observer: Adds complexity; Suspense sufficient

---

## 5. Reduced Motion Support

**Decision**: Use existing `useReducedMotion` hook to provide static alternatives.

**Rationale**:
- Constitution VIII requires respecting reduced motion preferences
- Hook already exists in project (`features/quarto/hooks/useReducedMotion.ts`)
- Consistent with existing WinCelebration pattern

**Implementation Pattern**:
```typescript
const prefersReducedMotion = useReducedMotion();

// For turn animation
if (prefersReducedMotion) {
  return <TurnAnimationStatic />; // Static step-by-step images
}

// For piece hover
const hoverScale = prefersReducedMotion ? 1 : 1.05;
```

**Alternatives Considered**:
- Skip motion detection: Violates constitution
- CSS-only: Less control for 3D/JS animations

---

## 6. Example Board Data Structure

**Decision**: Define static board configurations with metadata for captions.

**Rationale**:
- No runtime computation needed
- Easy to test and modify
- Clear separation of data and presentation

**Implementation Pattern**:
```typescript
interface ExampleBoardConfig {
  id: string;
  title: string;
  caption: string;
  isWin: boolean;
  sharedAttribute?: 'color' | 'shape' | 'top' | 'height';
  positions: (number | null)[]; // 16 elements, piece IDs or null
  highlightLine?: number[];     // Positions to highlight
}

const EXAMPLE_BOARDS: ExampleBoardConfig[] = [
  {
    id: 'clear-win',
    title: 'Clear Win',
    caption: 'All 4 pieces are SQUARE',
    isWin: true,
    sharedAttribute: 'shape',
    positions: [1, 3, 5, 7, null, null, ...], // Square pieces in row 0
    highlightLine: [0, 1, 2, 3],
  },
  // ... more examples
];
```

**Alternatives Considered**:
- Generate examples dynamically: Harder to control, test, and caption
- Images instead of 3D: Loses interactivity and consistency

---

## 7. Route Code Splitting

**Decision**: Use TanStack Router's lazy route loading for the rules page.

**Rationale**:
- Constitution requires bundle < 100KB gzip initial
- Rules page is secondary (not on critical path)
- TanStack Router has built-in lazy loading support

**Implementation Pattern**:
```typescript
// routes/games/quarto/rules.tsx
export const Route = createFileRoute('/games/quarto/rules')({
  component: () => {
    const RulesPage = lazy(() =>
      import('~/features/quarto/components/rules/RulesPage')
    );
    return (
      <Suspense fallback={<PageSkeleton />}>
        <RulesPage />
      </Suspense>
    );
  },
});
```

**Alternatives Considered**:
- Eager load: Increases initial bundle
- SSR the page: Unnecessary for static content page

---

## Resolved Technical Context

All NEEDS CLARIFICATION items resolved:

| Item | Resolution |
|------|------------|
| Animation library | Framer Motion (existing) |
| Tooltip approach | Radix UI Tooltip |
| Line overlay method | SVG positioned over canvas |
| Loading strategy | Suspense + lazy import |
| State machine | Custom hook with finite states |
| Example data | Static TypeScript config objects |
