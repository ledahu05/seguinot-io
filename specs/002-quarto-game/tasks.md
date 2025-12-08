# Tasks: Quarto Board Game

**Input**: Design documents from `/specs/002-quarto-game/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests included based on Constitution requirement (Testing First principle)

**Organization**: Tasks grouped by user story priority. US1, US4, US5 (all P1) form the MVP core.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1=Local 2P, US2=AI, US3=Online, US4=3D View, US5=Piece Selection

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and basic structure

- [X] T001 Create feature directory structure per plan.md at app/features/quarto/
- [X] T002 Install 3D dependencies: @react-three/fiber @react-three/drei three @react-spring/three
- [X] T003 [P] Install state management: @reduxjs/toolkit react-redux
- [X] T004 [P] Install type definitions: @types/three
- [X] T005 Create route structure at app/routes/games/quarto/ (index.tsx, play.tsx, lobby.tsx)
- [X] T006 Configure Redux store integration in app/store.ts (add quartoReducer)
- [X] T007 [P] Create test directory structure at tests/unit/quarto/ and tests/integration/quarto/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, utilities, and state that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Define all TypeScript types and Zod schemas in app/features/quarto/types/quarto.types.ts
- [X] T009 [P] Implement piece generation utilities in app/features/quarto/utils/pieceAttributes.ts
- [X] T010 [P] Implement win detection logic in app/features/quarto/utils/winDetection.ts
- [X] T011 Create RTK slice with initial state in app/features/quarto/store/quartoSlice.ts
- [X] T012 [P] Create memoized selectors in app/features/quarto/store/selectors.ts
- [X] T013 Create store barrel export in app/features/quarto/store/index.ts
- [X] T014 Create utils barrel export in app/features/quarto/utils/index.ts

### Foundational Tests

- [X] T015 [P] Unit tests for piece attributes in tests/unit/quarto/pieceAttributes.test.ts
- [X] T016 [P] Unit tests for win detection in tests/unit/quarto/winDetection.test.ts

**Checkpoint**: Foundation ready - game logic validated, user story implementation can begin

---

## Phase 3: User Story 4 - View Game Board in 3D (Priority: P1) 🎯 MVP-VISUAL

**Goal**: Render elegant 3D wooden board and pieces with camera controls

**Independent Test**: Load /games/quarto, verify 3D board renders, camera rotation works, pieces visually distinct

### Implementation for User Story 4

- [X] T017 [P] [US4] Create 3D piece component with procedural geometry in app/features/quarto/components/Piece3D.tsx
- [X] T018 [P] [US4] Create 3D board component with 4x4 grid in app/features/quarto/components/Board3D.tsx
- [X] T019 [US4] Setup R3F Canvas with OrbitControls and lighting in app/routes/games/quarto/play.tsx
- [X] T020 [US4] Add piece placement animations with @react-spring/three in app/features/quarto/components/Piece3D.tsx
- [X] T021 [US4] Add wood-like materials and colors to board and pieces
- [X] T022 [US4] Implement camera controls (rotate, zoom limits) for optimal viewing

**Checkpoint**: 3D board renders with all 16 visually distinct pieces, smooth 60fps camera rotation

---

## Phase 4: User Story 5 - Select and Give Pieces (Priority: P1) 🎯 MVP-INTERACTION

**Goal**: Display available pieces, allow selection, communicate to opponent

**Independent Test**: Click pieces in tray, verify selection highlights, piece becomes unavailable after placement

### Implementation for User Story 5

- [X] T023 [P] [US5] Create piece tray component in app/features/quarto/components/PieceTray.tsx
- [X] T024 [P] [US5] Create game status component (turn indicator) in app/features/quarto/components/GameStatus.tsx
- [X] T025 [US5] Add RTK actions: selectPiece, placePiece in app/features/quarto/store/quartoSlice.ts
- [X] T026 [US5] Implement piece selection highlighting with visual feedback
- [X] T027 [US5] Connect PieceTray to Redux state (available pieces, selection)
- [X] T028 [US5] Add keyboard navigation for piece selection (Tab, Enter, Arrow keys)

**Checkpoint**: Pieces selectable from tray, selection visually indicated, available pieces update correctly

---

## Phase 5: User Story 1 - Play Local 2-Player Game (Priority: P1) 🎯 MVP-COMPLETE

**Goal**: Complete local gameplay loop - turns, placement, win/draw detection

**Independent Test**: Two players complete full game on same device, winner correctly identified

### Tests for User Story 1

- [X] T029 [P] [US1] Integration test for complete game flow in tests/integration/quarto/gameFlow.test.ts

### Implementation for User Story 1

- [X] T030 [US1] Implement game initialization with random starting player in app/features/quarto/store/quartoSlice.ts
- [X] T031 [US1] Create useQuartoGame hook orchestrating game flow in app/features/quarto/hooks/useQuartoGame.ts
- [X] T032 [US1] Implement board click handler for piece placement in app/features/quarto/components/Board3D.tsx
- [X] T033 [US1] Add turn phase logic (selecting → placing → selecting) in quartoSlice.ts
- [X] T034 [US1] Implement "Call Quarto" button and validation in app/features/quarto/components/GameControls.tsx
- [X] T035 [US1] Create victory/draw screen with game outcome display
- [X] T036 [US1] Add "New Game" functionality to reset state
- [X] T037 [US1] Create game mode selection UI in app/routes/games/quarto/index.tsx
- [X] T038 [US1] Create hooks barrel export in app/features/quarto/hooks/index.ts
- [X] T039 [US1] Create components barrel export in app/features/quarto/components/index.ts

**Checkpoint**: Complete local 2-player game playable from start to finish. This is the MVP!

---

## Phase 6: User Story 2 - Play Against AI Opponent (Priority: P2)

**Goal**: Single player vs computer with difficulty levels

**Independent Test**: Play games at Easy/Medium/Hard, verify AI makes legal moves, Hard is challenging

### Tests for User Story 2

- [X] T040 [P] [US2] Unit tests for minimax algorithm in tests/unit/quarto/minimax.test.ts

### Implementation for User Story 2

- [X] T041 [P] [US2] Implement board evaluation heuristics in app/features/quarto/ai/evaluation.ts
- [X] T042 [US2] Implement minimax with alpha-beta pruning in app/features/quarto/ai/minimax.ts
- [X] T043 [US2] Create Web Worker wrapper for AI computation in app/features/quarto/ai/worker.ts
- [X] T044 [US2] Implement useAI hook for AI move triggering in app/features/quarto/hooks/useAI.ts
- [X] T045 [US2] Add AI difficulty selection UI to game mode selection
- [X] T046 [US2] Add RTK actions for AI: setAIThinking, applyAIMove in quartoSlice.ts
- [X] T047 [US2] Implement AI thinking indicator in GameStatus component
- [X] T048 [US2] Add AI move delay for UX (prevent instant moves)
- [X] T049 [US2] Create AI barrel export in app/features/quarto/ai/index.ts

**Checkpoint**: AI opponent playable at 3 difficulty levels, responds within 3 seconds

---

## Phase 7: User Story 3 - Play Online Multiplayer via PartyKit (Priority: P3)

**Goal**: Real-time 2-player game across devices using PartyKit for WebSocket infrastructure

**Independent Test**: Two browsers create/join room via PartyKit, play synchronized game, reconnection works

**Architecture**: Separate PartyKit server at `/party` directory, deployed to partykit.dev

### 7.1 PartyKit Server Setup

- [ ] T050 [P] [US3] Create `/party` directory structure with package.json, tsconfig.json, partykit.json
- [ ] T051 [P] [US3] Duplicate types to party/src/types.ts (ClientMessage, ServerMessage, RoomState)
- [ ] T052 [P] [US3] Copy game logic to party/src/game-logic.ts (win detection, validation)
- [ ] T053 [US3] Implement QuartoParty class in party/src/quarto.ts with onConnect, onMessage, onClose
- [ ] T054 [US3] Implement CREATE_ROOM and JOIN_ROOM message handlers
- [ ] T055 [US3] Implement SELECT_PIECE, PLACE_PIECE, CALL_QUARTO message handlers
- [ ] T056 [US3] Implement STATE_UPDATE broadcasting to all connections
- [ ] T057 [US3] Add 2-minute reconnection timer with RECONNECT message support

### 7.2 Client Integration with partysocket

- [ ] T058 [P] [US3] Install partysocket dependency in main app
- [ ] T059 [P] [US3] Create app/features/quarto/online/ directory structure
- [ ] T060 [US3] Implement usePartySocket hook in app/features/quarto/online/usePartySocket.ts
- [ ] T061 [US3] Implement useOnlineGame hook in app/features/quarto/online/useOnlineGame.ts
- [ ] T062 [US3] Create client message types in app/features/quarto/online/types.ts
- [ ] T063 [US3] Create online barrel export in app/features/quarto/online/index.ts
- [ ] T064 [US3] Add connection status and playerId to RTK slice (setConnectionStatus, setOnlineGame)
- [ ] T065 [US3] Store playerId in sessionStorage for reconnection

### 7.3 UI Updates

- [ ] T066 [US3] Enable online button in app/routes/games/quarto/index.tsx menu
- [ ] T067 [US3] Create room create/join form component
- [ ] T068 [US3] Create app/routes/games/quarto/online.tsx lobby route with room code display
- [ ] T069 [US3] Modify play.tsx to support online mode (use onlineGame state)
- [ ] T070 [US3] Create ConnectionStatus component showing connection state and room code
- [ ] T071 [US3] Add waiting screen when host is waiting for guest

### 7.4 Testing & Deployment

- [ ] T072 [P] [US3] Add party:dev script to root package.json ("cd party && npx partykit dev --port 1999")
- [ ] T073 [P] [US3] Add party:deploy script to root package.json
- [ ] T074 [US3] Configure VITE_PARTYKIT_HOST environment variable (localhost:1999 for dev)
- [ ] T075 [US3] Test full flow locally: create room, join room, play game, win/draw
- [ ] T076 [US3] Test disconnection and reconnection within 2-minute window
- [ ] T077 [US3] Test forfeit when reconnection timeout expires
- [ ] T078 [US3] Deploy PartyKit to partykit.dev
- [ ] T079 [US3] Configure VITE_PARTYKIT_HOST in Vercel production environment

**Checkpoint**: Online multiplayer fully functional via PartyKit with room management and reconnection

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance, and final touches

- [ ] T063 [P] Add ARIA live regions for game state announcements
- [ ] T064 [P] Implement reduced-motion mode for animations
- [ ] T065 [P] Add keyboard shortcuts help overlay
- [ ] T066 Optimize 3D rendering performance (instanced meshes if needed)
- [ ] T067 [P] Add loading states and Suspense boundaries for 3D canvas
- [ ] T068 Implement code splitting for quarto feature (lazy load)
- [ ] T069 [P] Add touch controls for mobile piece selection
- [ ] T070 Mobile responsive layout adjustments
- [ ] T071 Run Lighthouse performance audit, address issues
- [ ] T072 Final integration testing across all game modes
- [ ] T073 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → [MVP Phases in parallel or sequence]
                                          ├── Phase 3 (US4: 3D View)
                                          ├── Phase 4 (US5: Piece Selection)
                                          └── Phase 5 (US1: Local Game)
                                                       ↓
                                               Phase 6 (US2: AI) → Phase 7 (US3: Online)
                                                                            ↓
                                                                   Phase 8 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US4 (3D View) | Foundational | Phase 2 complete |
| US5 (Piece Selection) | US4 (needs 3D pieces) | T017-T018 complete |
| US1 (Local Game) | US4, US5 | Phase 4 complete |
| US2 (AI) | US1 (game loop) | Phase 5 complete |
| US3 (Online) | US1 (game loop) | Phase 5 complete |

### Within Each User Story

1. Tests first (if included) - verify they FAIL
2. Core logic/utilities
3. Components/UI
4. Integration and wiring
5. Polish and edge cases

### Parallel Opportunities

**Phase 2 (Foundational)**:
```bash
# These can run in parallel:
T009: pieceAttributes.ts
T010: winDetection.ts
T012: selectors.ts
T015: pieceAttributes.test.ts
T016: winDetection.test.ts
```

**Phase 3-4 (3D + Selection)**:
```bash
# These can run in parallel:
T017: Piece3D.tsx
T018: Board3D.tsx
T023: PieceTray.tsx
T024: GameStatus.tsx
```

**Phase 6-7 (AI + Online)** - Can be worked on in parallel by different developers after Phase 5.

---

## Implementation Strategy

### MVP First (Phases 1-5)

1. Complete Setup (Phase 1)
2. Complete Foundational with tests (Phase 2)
3. Build 3D visualization (Phase 3)
4. Add piece selection (Phase 4)
5. Complete local game loop (Phase 5)
6. **STOP and VALIDATE**: Play full local game
7. Deploy MVP to portfolio

### Incremental Delivery

| Milestone | Phases | What Users Can Do |
|-----------|--------|-------------------|
| MVP | 1-5 | Play local 2-player game |
| +AI | 1-6 | Play against computer |
| Full | 1-7 | Play online with friends |
| Polished | 1-8 | Accessible, performant, mobile-friendly |

### Suggested First PR

Phases 1-5 (MVP): ~39 tasks
- Full local 2-player Quarto game
- 3D board and pieces
- Win/draw detection
- Core tests passing

---

## Summary

| Phase | Story | Task Count | Parallelizable |
|-------|-------|------------|----------------|
| 1 | Setup | 7 | 3 |
| 2 | Foundational | 9 | 5 |
| 3 | US4 (3D View) | 6 | 2 |
| 4 | US5 (Selection) | 6 | 2 |
| 5 | US1 (Local Game) | 11 | 1 |
| 6 | US2 (AI) | 10 | 2 |
| 7 | US3 (Online via PartyKit) | 30 | 6 |
| 8 | Polish | 11 | 6 |
| **Total** | | **90** | **27** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story
- MVP = Phases 1-5 (39 tasks) for deployable local game
- Tests follow TDD: write first, verify failure, then implement
- Commit after each task or logical group
- Stop at any phase checkpoint to validate independently
- Phase 7 uses PartyKit (separate `/party` directory) per constitution requirement
- PartyKit deployment is to partykit.dev, separate from Vercel
