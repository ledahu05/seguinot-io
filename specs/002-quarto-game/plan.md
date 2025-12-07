# Implementation Plan: Quarto Board Game

**Branch**: `002-quarto-game` | **Date**: 2025-12-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-quarto-game/spec.md`

## Summary

Build a 3D Quarto board game for the portfolio website with three game modes (local 2-player, AI opponent, online multiplayer). Uses React Three Fiber for 3D visualization, Redux Toolkit for game state, and WebSocket for real-time multiplayer. The game features 16 unique wooden pieces on a 4x4 board with elegant animations and an AI using Minimax with alpha-beta pruning.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node.js 20+
**Primary Dependencies**: TanStack Start, TanStack Router, Redux Toolkit (RTK), React Three Fiber (R3F), Drei, Framer Motion, React Spring, Zod, Shadcn UI
**Storage**: In-memory for local games; server-side session storage for online multiplayer rooms
**Testing**: Vitest for unit tests, React Testing Library for component tests
**Target Platform**: Web (Desktop primary, Mobile secondary), Modern browsers with WebGL support
**Project Type**: Web application (full-stack with TanStack Start)
**Performance Goals**: 60fps for 3D rendering and animations, <3s initial load, <1s move synchronization
**Constraints**: Initial JS bundle <100KB gzipped (excluding 3D assets), WebGL required, offline-capable for local/AI modes
**Scale/Scope**: Single-player to 2 concurrent players per game session, portfolio demonstration scale

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Feature-based structure under `app/features/quarto/` |
| II. Tech Stack | ✅ PASS | React 19, TypeScript, TanStack Start, Tailwind CSS, RTK (justified for complex game state) |
| III. Testing First | ✅ PASS | Vitest for game logic, win detection, AI algorithms |
| IV. Accessibility | ⚠️ PARTIAL | 3D canvas has limited a11y; will provide keyboard controls and screen reader announcements for game state |
| V. Performance | ✅ PASS | 60fps target, lazy-load 3D, code splitting for game feature |
| VI. Minimal Dependencies | ✅ PASS | R3F/Drei necessary for 3D; no heavy UI frameworks |
| VII. Swiss Style | ✅ PASS | Clean wooden aesthetic, grid-based board |
| VIII. Micro-interactions | ✅ PASS | Framer Motion for UI, React Spring for 3D animations |
| IX. Content-First | ✅ PASS | Game rules drive design; no placeholder content |
| X. Responsive Design | ✅ PASS | Mobile-first, touch-friendly piece selection |

**Gate Result**: PASS (1 partial - accessibility documented with mitigations)

## Project Structure

### Documentation (this feature)

```text
specs/002-quarto-game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── routes/
│   └── games/
│       └── quarto/
│           ├── index.tsx          # Game entry/mode selection
│           ├── play.tsx           # Main game view
│           └── lobby.tsx          # Multiplayer lobby
├── features/
│   └── quarto/
│       ├── store/
│       │   ├── quartoSlice.ts     # RTK slice for game state
│       │   ├── selectors.ts       # Memoized selectors
│       │   └── index.ts
│       ├── components/
│       │   ├── Board3D.tsx        # 3D board with R3F
│       │   ├── Piece3D.tsx        # 3D piece component
│       │   ├── PieceTray.tsx      # Available pieces display
│       │   ├── GameStatus.tsx     # Turn/winner indicator
│       │   ├── GameControls.tsx   # New game, settings
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useQuartoGame.ts   # Main game hook
│       │   ├── useAI.ts           # AI opponent hook
│       │   ├── useMultiplayer.ts  # WebSocket hook
│       │   └── index.ts
│       ├── ai/
│       │   ├── minimax.ts         # Minimax with alpha-beta
│       │   ├── evaluation.ts      # Board evaluation heuristics
│       │   └── index.ts
│       ├── types/
│       │   └── quarto.types.ts    # Type definitions
│       └── utils/
│           ├── winDetection.ts    # Win condition logic
│           ├── pieceAttributes.ts # Piece generation/comparison
│           └── index.ts
└── server/
    └── api/
        └── quarto/
            ├── room.ts            # Room creation/joining
            └── websocket.ts       # WebSocket handlers

tests/
├── unit/
│   └── quarto/
│       ├── winDetection.test.ts
│       ├── minimax.test.ts
│       └── pieceAttributes.test.ts
├── integration/
│   └── quarto/
│       └── gameFlow.test.ts
└── contract/
    └── quarto/
        └── multiplayer.test.ts
```

**Structure Decision**: Full-stack web application using TanStack Start's file-based routing. Game feature isolated under `app/features/quarto/` following Feature-Sliced Design. Server-side multiplayer logic colocated under `app/server/api/quarto/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| RTK for state | Complex game state with board, pieces, turns, history, multiple modes | Context would require extensive prop drilling and manual optimization for frequent updates during gameplay |
| React Three Fiber | 3D visualization is core requirement | 2D canvas would not deliver the "elegant wooden aesthetic" specified |
| WebSocket | Real-time multiplayer synchronization | Polling would not meet <1s sync requirement |
