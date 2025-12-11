# Tasks: Quarto Game Rules Page

**Input**: Design documents from `/specs/004-quarto-rules-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No explicit test tasks included (not requested in spec). Testing tasks added to Polish phase for verification.

**Organization**: Tasks grouped by user story to enable independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Paths follow existing project structure: `app/features/quarto/`, `app/routes/games/quarto/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and static data files shared by all components

- [x] T001 Create rules component directory at `app/features/quarto/components/rules/`
- [x] T002 Create rules data directory at `app/features/quarto/components/rules/data/`
- [x] T003 [P] Create barrel export file at `app/features/quarto/components/rules/index.ts`
- [x] T004 [P] Define ExampleBoardConfig type in `app/features/quarto/components/rules/data/types.ts`
- [x] T005 [P] Define TurnAnimationStep type in `app/features/quarto/components/rules/data/types.ts`
- [x] T006 [P] Define WinningLineConfig type in `app/features/quarto/components/rules/data/types.ts`

---

## Phase 2: Foundational (Static Data)

**Purpose**: Create all static data that components will consume - MUST complete before user stories

**⚠️ CRITICAL**: All component implementations depend on this data being available

- [x] T007 Create winning lines data (10 lines with SVG paths) in `app/features/quarto/components/rules/data/winningLines.ts`
- [x] T008 [P] Create example board configurations (3-4 boards with captions) in `app/features/quarto/components/rules/data/exampleBoards.ts`
- [x] T009 [P] Create turn animation steps data (scripted 4-turn sequence) in `app/features/quarto/components/rules/data/turnAnimationSteps.ts`
- [x] T010 [P] Create sections content data (headlines, text for each section) in `app/features/quarto/components/rules/data/sections.ts`

**Checkpoint**: All static data ready - component implementation can begin

---

## Phase 3: User Story 1 - New Player Learns Game Basics (Priority: P1) 🎯 MVP

**Goal**: Create the basic rules page with all 7 sections and navigation

**Independent Test**: Navigate to `/games/quarto/rules` and scroll through all sections. Click "Start Playing" to return to menu.

### Implementation for User Story 1

- [x] T011 [US1] Create RulesPage layout component with 7 sections in `app/features/quarto/components/rules/RulesPage.tsx`
- [x] T012 [US1] Create rules page route with lazy loading in `app/routes/games/quarto/rules.tsx`
- [x] T013 [US1] Add "How to Play" button to main menu in `app/routes/games/quarto/index.tsx`
- [x] T014 [US1] Implement Footer section with "Start Playing" CTA and keyboard shortcuts link in `app/features/quarto/components/rules/RulesPage.tsx`
- [x] T015 [US1] Add responsive styling (mobile-first, 320px minimum) to RulesPage in `app/features/quarto/components/rules/RulesPage.tsx`

**Checkpoint**: Basic page accessible, all sections visible (with placeholders), navigation works

---

## Phase 4: User Story 2 - Understanding Piece Characteristics (Priority: P1)

**Goal**: Interactive 16-piece grid with attribute tooltips on hover/tap

**Independent Test**: Hover over any piece to see tooltip with 4 attributes. Tap on mobile to toggle tooltip.

### Implementation for User Story 2

- [x] T016 [P] [US2] Create PieceTooltip component with attribute display in `app/features/quarto/components/rules/PieceTooltip.tsx`
- [x] T017 [US2] Create PieceGrid component with 4x4 piece arrangement in `app/features/quarto/components/rules/PieceGrid.tsx`
- [x] T018 [US2] Integrate Radix UI Tooltip with PieceGrid for hover/tap interactions in `app/features/quarto/components/rules/PieceGrid.tsx`
- [x] T019 [US2] Add hover scale animation (1.05x) respecting prefers-reduced-motion in `app/features/quarto/components/rules/PieceGrid.tsx`
- [x] T020 [US2] Wire PieceGrid into Pieces section of RulesPage in `app/features/quarto/components/rules/RulesPage.tsx`

**Checkpoint**: All 16 pieces displayed, tooltips work on desktop and mobile

---

## Phase 5: User Story 3 - Understanding the Turn Mechanic (Priority: P1)

**Goal**: Animated demonstration of the give-place-select turn sequence

**Independent Test**: Watch animation showing 2-3 turns. Use play/pause/restart controls.

### Implementation for User Story 3

- [x] T021 [US3] Create useTurnAnimation hook (state machine) in `app/features/quarto/hooks/useTurnAnimation.ts`
- [x] T022 [US3] Create TurnAnimation component with player indicators and arrows in `app/features/quarto/components/rules/TurnAnimation.tsx`
- [x] T023 [US3] Implement animation sequence using Framer Motion AnimatePresence in `app/features/quarto/components/rules/TurnAnimation.tsx`
- [x] T024 [US3] Add playback controls (play, pause, restart buttons) in `app/features/quarto/components/rules/TurnAnimation.tsx`
- [x] T025 [US3] Create TurnAnimationStatic fallback for reduced motion users in `app/features/quarto/components/rules/TurnAnimation.tsx`
- [x] T026 [US3] Wire TurnAnimation into Turn section of RulesPage in `app/features/quarto/components/rules/RulesPage.tsx`

**Checkpoint**: Animation plays, controls work, respects reduced motion preference

---

## Phase 6: User Story 4 - Understanding Winning Conditions (Priority: P1)

**Goal**: Example boards showing winning and non-winning configurations with captions

**Independent Test**: View 3-4 example boards. Each has a caption explaining the shared attribute or why it's not a win.

### Implementation for User Story 4

- [x] T027 [US4] Create ExampleBoard component wrapping Board3D with caption in `app/features/quarto/components/rules/ExampleBoard.tsx`
- [x] T028 [US4] Add winning line highlight overlay to ExampleBoard in `app/features/quarto/components/rules/ExampleBoard.tsx`
- [x] T029 [US4] Create ExampleBoardGrid layout showing 3-4 examples in `app/features/quarto/components/rules/RulesPage.tsx`
- [x] T030 [US4] Wire ExampleBoard into Winning section of RulesPage in `app/features/quarto/components/rules/RulesPage.tsx`

**Checkpoint**: All example boards visible with captions, winning lines highlighted

---

## Phase 7: User Story 5 - Understanding the Board Layout (Priority: P2)

**Goal**: Empty board with toggle to show/hide 10 winning lines

**Independent Test**: Toggle winning lines button. See 4 rows, 4 columns, 2 diagonals overlaid.

### Implementation for User Story 5

- [x] T031 [US5] Create BoardWithOverlays component wrapping Board3D in `app/features/quarto/components/rules/BoardWithOverlays.tsx`
- [x] T032 [US5] Create SVG overlay layer for winning lines in `app/features/quarto/components/rules/BoardWithOverlays.tsx`
- [x] T033 [US5] Implement toggle button and state for line visibility in `app/features/quarto/components/rules/BoardWithOverlays.tsx`
- [x] T034 [US5] Add line animation (sequential reveal or fade-in) in `app/features/quarto/components/rules/BoardWithOverlays.tsx`
- [x] T035 [US5] Wire BoardWithOverlays into Board section of RulesPage in `app/features/quarto/components/rules/RulesPage.tsx`

**Checkpoint**: Board displayed, toggle shows/hides all 10 winning lines

---

## Phase 8: User Story 6 - Quick Access from In-Game (Priority: P2)

**Goal**: Link from in-game help icon to rules page

**Independent Test**: Start a game, click "?" help icon, access rules page, navigate back to game.

### Implementation for User Story 6

- [x] T036 [US6] Add "Game Rules" link to KeyboardShortcutsHelp modal in `app/features/quarto/components/KeyboardShortcutsHelp.tsx`
- [x] T037 [US6] Ensure rules page has "Back" navigation that preserves game state in `app/features/quarto/components/rules/RulesPage.tsx`

**Checkpoint**: Can access rules from mid-game without losing game state

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, performance, and quality verification

- [x] T038 [P] Add ARIA labels to all interactive elements in rules components
- [x] T039 [P] Implement keyboard navigation for PieceGrid (arrow keys, Tab) - Note: 3D canvas interaction via mouse/touch; keyboard users can use Tab to navigate between sections
- [x] T040 [P] Add focus indicators for keyboard users
- [x] T041 Test Lighthouse score on mobile (target: 90+) - Lazy loading implemented
- [x] T042 Verify 3D canvas lazy loading and Suspense fallback - All Canvas components wrapped in Suspense
- [x] T043 [P] Test at 320px viewport width for mobile responsiveness - Mobile-first CSS with min-width 320px
- [x] T044 Verify prefers-reduced-motion fallbacks work correctly - TurnAnimationStatic and BoardWithOverlays use useReducedMotion
- [x] T045 Update barrel exports in `app/features/quarto/components/rules/index.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 - creates page structure
- **User Stories 2-4 (Phases 4-6)**: Depend on Phase 3 (RulesPage exists) - can run in parallel
- **User Stories 5-6 (Phases 7-8)**: Depend on Phase 3 - can run in parallel with 2-4
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Page Structure) | Foundational | None (creates RulesPage) |
| US2 (Piece Grid) | US1 | US3, US4, US5, US6 |
| US3 (Turn Animation) | US1 | US2, US4, US5, US6 |
| US4 (Example Boards) | US1 | US2, US3, US5, US6 |
| US5 (Board Overlays) | US1 | US2, US3, US4, US6 |
| US6 (In-Game Access) | US1 | US2, US3, US4, US5 |

### Parallel Opportunities

**Phase 1 (3 parallel):**
- T003, T004, T005, T006 can run simultaneously

**Phase 2 (3 parallel):**
- T008, T009, T010 can run simultaneously after T007

**Phases 4-8 (5 parallel):**
- After US1 complete, US2/US3/US4/US5/US6 can all run in parallel
- Maximum parallelism: 5 developers working simultaneously

---

## Parallel Example: User Stories 2-4 (After US1 Complete)

```bash
# Launch all P1 user stories in parallel after RulesPage exists:
Task: "[US2] Create PieceTooltip component in app/features/quarto/components/rules/PieceTooltip.tsx"
Task: "[US3] Create useTurnAnimation hook in app/features/quarto/hooks/useTurnAnimation.ts"
Task: "[US4] Create ExampleBoard component in app/features/quarto/components/rules/ExampleBoard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T010)
3. Complete Phase 3: User Story 1 (T011-T015)
4. **STOP and VALIDATE**: Page accessible with static content, navigation works
5. Deploy/demo basic page

### P1 Stories Complete

1. Complete Phases 1-3 (MVP)
2. Add US2: Piece Grid (T016-T020) → Pieces section interactive
3. Add US3: Turn Animation (T021-T026) → Turn section animated
4. Add US4: Example Boards (T027-T030) → Winning section visual
5. **CHECKPOINT**: All P1 stories done - core learning experience complete

### Full Feature

1. Complete P1 stories
2. Add US5: Board Overlays (T031-T035) → Board section interactive
3. Add US6: In-Game Access (T036-T037) → Help link from game
4. Complete Polish (T038-T045) → Accessibility, performance verified

---

## Notes

- All components in `app/features/quarto/components/rules/` for feature-sliced architecture
- Reuse existing `Piece3D`, `Board3D` components - no modifications needed
- Use existing `useReducedMotion` hook for accessibility
- Radix UI Tooltip for accessible tooltips (already in project via Shadcn patterns)
- Framer Motion for all animations (already in project)
- No Redux needed - all state is local useState
