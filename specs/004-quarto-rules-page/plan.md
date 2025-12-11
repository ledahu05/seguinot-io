# Implementation Plan: Quarto Game Rules Page

**Branch**: `004-quarto-rules-page` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-quarto-rules-page/spec.md`

## Summary

Create an interactive "How to Play" page for the Quarto game that teaches new players through visual demonstrations. The page will be a single scrollable route with 7 sections: Header, Pieces (interactive 3D grid with tooltips), Board (with winning line overlays), Turn mechanics (animated demonstration), Winning conditions (example boards), Strategy tip, and Footer CTA. Reuses existing `Piece3D` and `Board3D` components with new wrapper components for interactivity.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19
**Primary Dependencies**: React Three Fiber, Drei, Framer Motion, TanStack Router, Tailwind CSS v4
**Storage**: N/A (stateless page, no persistence)
**Testing**: Vitest with jsdom, @testing-library/react
**Target Platform**: Web (desktop + mobile), browsers supporting WebGL
**Project Type**: Web application (TanStack Start full-stack framework)
**Performance Goals**: LCP < 2.5s, 60fps animations, Lighthouse 90+ mobile
**Constraints**: Initial bundle < 100KB gzip, respect prefers-reduced-motion, mobile-first responsive
**Scale/Scope**: Single page with ~7 interactive components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | PASS | Feature-sliced: components in `features/quarto/components/rules/` |
| II. Tech Stack | PASS | React 19, TypeScript, TanStack Router, Tailwind, Framer Motion |
| III. Testing First | PASS | Unit tests for new components, integration for interactions |
| IV. Accessibility | PASS | Semantic HTML, keyboard navigation, ARIA labels, focus management |
| V. Performance | PASS | Lazy-load 3D canvas, code-split route, 60fps animations |
| VI. Minimal Dependencies | PASS | No new dependencies - reuses existing libraries |
| VII. Swiss Style | PASS | Grid-based layout, clear typography hierarchy |
| VIII. Micro-interactions | PASS | Framer Motion for hover states and entry animations |
| IX. Content-First | PASS | Game rules from spec drive component structure |
| X. Responsive Design | PASS | Mobile-first, touch targets 44x44px, 320px minimum |

**Gate Status**: PASSED - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/004-quarto-rules-page/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal - no persistence)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── features/quarto/
│   ├── components/
│   │   ├── rules/                    # NEW: Rules page components
│   │   │   ├── RulesPage.tsx         # Main page layout
│   │   │   ├── PieceGrid.tsx         # 16-piece interactive grid
│   │   │   ├── PieceTooltip.tsx      # Attribute tooltip on hover/tap
│   │   │   ├── BoardWithOverlays.tsx # Board + winning line toggles
│   │   │   ├── TurnAnimation.tsx     # Animated turn demo
│   │   │   ├── ExampleBoard.tsx      # Win/non-win example boards
│   │   │   └── index.ts              # Barrel export
│   │   ├── Piece3D.tsx               # REUSE (no changes)
│   │   ├── Board3D.tsx               # REUSE (no changes)
│   │   └── ...
│   ├── hooks/
│   │   └── useTurnAnimation.ts       # NEW: Animation state machine
│   └── ...
└── routes/games/quarto/
    ├── index.tsx                     # MODIFY: Add "How to Play" button
    └── rules.tsx                     # NEW: Rules page route

tests/
├── unit/quarto/
│   └── rules/                        # NEW: Rules component tests
│       ├── PieceGrid.test.tsx
│       ├── TurnAnimation.test.tsx
│       └── ExampleBoard.test.tsx
└── integration/quarto/
    └── rulesPage.test.tsx            # NEW: Integration test
```

**Structure Decision**: Follows existing feature-sliced pattern. New rules components go in `components/rules/` subdirectory to keep organization clean while maintaining proximity to reused components.

## Complexity Tracking

> No violations - table not needed.
