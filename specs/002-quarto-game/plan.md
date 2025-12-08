# Implementation Plan: Quarto Board Game

**Branch**: `002-quarto-game-phase7` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-quarto-game/spec.md`

## Summary

A 3D Quarto board game for portfolio featuring local 2-player, AI opponent, and online multiplayer via PartyKit. The game renders an elegant wooden board with 16 unique pieces using React Three Fiber. Players win by aligning 4 pieces with a shared attribute.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node.js 20+
**Primary Dependencies**: TanStack Start, React Three Fiber, Drei, Redux Toolkit, PartyKit, partysocket
**Storage**: In-memory for local/AI games; PartyKit room state for online multiplayer
**Testing**: Vitest for unit tests
**Target Platform**: Modern browsers with WebGL support (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application with separate PartyKit server
**Performance Goals**: 60fps animations, <3s initial load, <1s move sync
**Constraints**: Initial bundle <100KB gzipped (excl. Three.js lazy-loaded)
**Scale/Scope**: 2 players per game, ephemeral room state (no persistence)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Feature-based structure: `app/features/quarto/` |
| II. Tech Stack | ✅ PASS | React 19, TypeScript, TanStack Start, RTK, **PartyKit for multiplayer** |
| III. Testing First | ✅ PASS | Unit tests for game logic, win detection, AI |
| IV. Accessibility | ✅ PASS | Keyboard navigation, ARIA live regions for game state |
| V. Performance | ✅ PASS | Lazy-load 3D, code splitting, 60fps target |
| VI. Minimal Dependencies | ✅ PASS | R3F is lightest 3D option; PartyKit is minimal WebSocket solution |
| VII. Swiss Style | ✅ PASS | High contrast pieces, clean grid-based board |
| VIII. Micro-interactions | ✅ PASS | Framer Motion for UI, React Spring for 3D |
| IX. Content-First | ✅ PASS | Game pieces are data-driven (attributes) |
| X. Responsive Design | ✅ PASS | Mobile-first layout, touch support |

## Project Structure

### Documentation (this feature)

```text
specs/002-quarto-game/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Development setup
├── contracts/           # API specifications
│   └── api.md           # PartyKit WebSocket protocol
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
# Main Application (Vercel deployment)
app/
├── features/quarto/
│   ├── components/       # React components (Board3D, Piece3D, PieceTray, etc.)
│   ├── hooks/            # Custom hooks (useQuartoGame, useAI, useKeyboardNavigation)
│   ├── online/           # PartyKit client integration (NEW)
│   │   ├── usePartySocket.ts
│   │   ├── useOnlineGame.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── store/            # Redux slice and selectors
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Win detection, piece utilities
│   └── ai/               # Minimax AI implementation
├── routes/games/quarto/
│   ├── index.tsx         # Mode selection page
│   ├── play.tsx          # Game board page
│   └── online.tsx        # Multiplayer lobby (NEW)
└── store.ts              # Redux store configuration

# PartyKit Server (Separate deployment to partykit.dev)
party/
├── package.json
├── tsconfig.json
├── partykit.json
└── src/
    ├── quarto.ts         # Main Party class
    ├── types.ts          # Message types (duplicated)
    └── game-logic.ts     # Server-side game logic

# Tests
tests/
├── unit/quarto/
│   ├── pieceAttributes.test.ts
│   ├── winDetection.test.ts
│   └── minimax.test.ts
└── integration/quarto/
    └── gameFlow.test.ts
```

**Structure Decision**: Hybrid structure with main TanStack Start app deployed to Vercel and separate PartyKit server for real-time multiplayer. PartyKit runs on partykit.dev infrastructure.

## Architecture Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌───────────────────┐      ┌────────────────────────────┐ │
│  │   React App       │      │    partysocket client      │ │
│  │   (TanStack)      │──────│    WebSocket connection    │ │
│  └───────────────────┘      └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
           │                              │
           │ HTTP                         │ WebSocket
           ▼                              ▼
┌──────────────────────┐     ┌────────────────────────────────┐
│  Vercel (Static +    │     │  PartyKit (partykit.dev)       │
│  SSR Functions)      │     │  ┌────────────────────────┐   │
│                      │     │  │  QuartoParty Server    │   │
│  - Routes            │     │  │  - Room management     │   │
│  - Static assets     │     │  │  - Game state          │   │
│  - No game logic     │     │  │  - Move validation     │   │
└──────────────────────┘     │  │  - State broadcast     │   │
                             │  └────────────────────────┘   │
                             └────────────────────────────────┘
```

### PartyKit Message Flow

```
Player A (Host)                    PartyKit                    Player B (Guest)
      │                               │                              │
      │──CREATE_ROOM──────────────────│                              │
      │◄─ROOM_CREATED (roomId)────────│                              │
      │                               │                              │
      │                               │◄─────────JOIN_ROOM───────────│
      │◄─PLAYER_JOINED────────────────│──────────ROOM_JOINED────────►│
      │◄─STATE_UPDATE─────────────────│──────────STATE_UPDATE───────►│
      │                               │                              │
      │──SELECT_PIECE (pieceId)───────│                              │
      │◄─STATE_UPDATE─────────────────│──────────STATE_UPDATE───────►│
      │                               │                              │
      │                               │◄─────PLACE_PIECE (pos)───────│
      │◄─STATE_UPDATE─────────────────│──────────STATE_UPDATE───────►│
      │                               │                              │
```

## Complexity Tracking

> **No constitution violations requiring justification**

All principles are satisfied by the chosen architecture:
- PartyKit is mandated by constitution for real-time WebSocket features
- Separate `/party` directory follows constitution requirement
- `partysocket` client library is used as required

## Phase 0: Research Summary

See [research.md](./research.md) for detailed technology decisions:

1. **3D Rendering**: React Three Fiber + Drei
2. **State Management**: Redux Toolkit
3. **AI Algorithm**: Minimax with alpha-beta pruning
4. **Real-time Multiplayer**: PartyKit (updated from raw WebSocket)
5. **3D Assets**: Procedural geometry
6. **Animation**: React Spring for 3D, Framer Motion for UI
7. **Accessibility**: Keyboard navigation + ARIA

## Phase 1: Design Artifacts

- **Data Model**: See [data-model.md](./data-model.md)
- **API Contracts**: See [contracts/api.md](./contracts/api.md)
- **Development Setup**: See [quickstart.md](./quickstart.md)

## Implementation Phases

### Completed Phases (MVP)

- **Phase 1-5**: Local 2-player game with 3D board ✅
- **Phase 6**: AI opponent with difficulty levels ✅

### Current Phase

- **Phase 7**: Online Multiplayer via PartyKit (IN PROGRESS)

### Phase 7 Implementation

#### 7.1 PartyKit Server Setup
1. Create `/party` directory structure
2. Configure `partykit.json` and `package.json`
3. Implement types and game logic
4. Implement QuartoParty class
5. Test locally with `npx partykit dev`

#### 7.2 Client Hooks
1. Add `partysocket` dependency
2. Create `/app/features/quarto/online/` directory
3. Implement `usePartySocket` hook
4. Implement `useOnlineGame` hook
5. Add message types

#### 7.3 UI Updates
1. Enable online button in menu
2. Add room create/join form
3. Create `/games/quarto/online` lobby route
4. Modify play page for online mode
5. Add ConnectionStatus component

#### 7.4 Polish & Deploy
1. Test full flow locally
2. Handle edge cases (reconnection, errors)
3. Deploy PartyKit to partykit.dev
4. Configure Vercel env vars
5. E2E testing

### Future Phase

- **Phase 8**: Polish & Cross-Cutting Concerns

## Critical Files Reference

| File | Purpose |
|------|---------|
| `app/features/quarto/store/quartoSlice.ts` | Has `setOnlineGame`, `setConnectionStatus` ready |
| `app/features/quarto/types/quarto.types.ts` | Source for types to duplicate to PartyKit |
| `app/features/quarto/utils/winDetection.ts` | Game logic to copy to PartyKit server |
| `app/routes/games/quarto/index.tsx` | Menu page - enable online button |
| `app/features/quarto/hooks/useQuartoGame.ts` | Pattern to follow for `useOnlineGame` |
| `doc/partykit-multiplayer-plan.md` | Detailed PartyKit integration reference |

## Environment Configuration

### Local Development
```
VITE_PARTYKIT_HOST=localhost:1999
```

### Production (Vercel)
```
VITE_PARTYKIT_HOST=quarto-multiplayer.<username>.partykit.dev
```

## Development Scripts

```json
{
  "scripts": {
    "party:dev": "cd party && npx partykit dev --port 1999",
    "party:deploy": "cd party && npx partykit deploy",
    "dev:full": "concurrently \"npm run dev\" \"npm run party:dev\""
  }
}
```
