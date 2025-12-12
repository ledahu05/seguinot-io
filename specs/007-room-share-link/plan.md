# Implementation Plan: Room Share Link

**Branch**: `007-room-share-link` | **Date**: 2025-12-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-room-share-link/spec.md`

## Summary

Enable room creators to share a direct join link instead of manually exchanging room codes. The feature adds a share button to the "Waiting for Opponent" screen and creates a new join route that accepts room codes via URL parameters, prompting for player name before joining.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node.js 20+
**Primary Dependencies**: TanStack Router, TanStack Start, Zod (validation), Lucide React (icons)
**Storage**: N/A (uses existing in-memory PartyKit room state)
**Testing**: Vitest
**Target Platform**: Web (all modern browsers), mobile-responsive
**Project Type**: Web application (TanStack Start full-stack)
**Performance Goals**: Share action < 100ms, page load < 2s
**Constraints**: Must work on HTTPS (required for Clipboard API and Web Share API)
**Scale/Scope**: Existing Quarto multiplayer users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Feature contained within existing `quarto/` feature structure |
| II. Tech Stack | ✅ PASS | Uses existing TanStack Router, no new dependencies |
| III. Testing First | ✅ PASS | Will add unit tests for share utilities |
| IV. Accessibility | ✅ PASS | Share button will have proper ARIA labels |
| V. Performance | ✅ PASS | Minimal JS addition, no bundle impact |
| VI. Minimal Dependencies | ✅ PASS | No new dependencies required |
| VII. Swiss Style | ✅ PASS | Share UI follows existing design patterns |
| VIII. Micro-interactions | ✅ PASS | Copy feedback animation using existing patterns |
| IX. Content-First | ✅ PASS | N/A - no content changes |
| X. Responsive Design | ✅ PASS | Mobile-first with native share on mobile |

**Gate Status**: ✅ All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/007-room-share-link/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── routes/
│   └── games/
│       └── quarto/
│           ├── index.tsx       # MODIFY: Add share link generation
│           ├── online.tsx      # MODIFY: Add share button to waiting screen
│           └── join.tsx        # NEW: Join page with room code from URL
├── features/
│   └── quarto/
│       ├── components/
│       │   └── ShareRoomButton.tsx  # NEW: Share button component
│       └── utils/
│           └── shareLink.ts         # NEW: Share link generation utilities
└── lib/
    └── hooks/
        └── useShare.ts              # NEW: Web Share API / Clipboard hook
```

**Structure Decision**: Follows existing Feature-Sliced Design pattern. Share utilities go in `features/quarto/utils/`, reusable share hook goes in `lib/hooks/` for potential reuse across features.

## Complexity Tracking

> No violations - feature is straightforward and aligns with all constitution principles.
