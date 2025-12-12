# Tasks: Quarto 2x2 Square Variation

**Input**: Design documents from `/home/chris/workspace/portfolio-2025/.claude/doc/quarto-rules.md`
**Prerequisites**: Existing Quarto game implementation (002-quarto-game), Rules page (004-quarto-rules-page)

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Based on existing project structure:
- Game logic: `app/features/quarto/utils/`
- Types: `app/features/quarto/types/`
- Rules page components: `app/features/quarto/components/rules/`
- Rules page data: `app/features/quarto/components/rules/data/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define 2x2 square winning patterns and game settings

- [x] T001 Add WINNING_SQUARES constant (9 possible 2x2 patterns) in app/features/quarto/types/quarto.types.ts
- [x] T002 [P] Add `advancedRules` boolean flag to Game interface in app/features/quarto/types/quarto.types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core win detection logic that must be complete before UI updates

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `checkSquare` function to detect if a 2x2 square has shared attributes in app/features/quarto/utils/winDetection.ts
- [x] T004 Create `findWinningSquare` function to find the first winning 2x2 square in app/features/quarto/utils/winDetection.ts
- [x] T005 Create `findAllWinningSquares` function to find all winning 2x2 squares in app/features/quarto/utils/winDetection.ts
- [x] T006 Update `findWinningLine` function to optionally check 2x2 squares based on game rules setting in app/features/quarto/utils/winDetection.ts
- [x] T007 Update `findAllWinningLines` function to include 2x2 squares when advanced rules enabled in app/features/quarto/utils/winDetection.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Enable 2x2 Square Win Detection in Game (Priority: P1)

**Goal**: Players can win by creating a 2x2 square with shared attributes when advanced rules are enabled

**Independent Test**: Start a game with advanced rules enabled, create a 2x2 square with 4 pieces sharing an attribute, verify win is detected

### Implementation for User Story 1

- [x] T008 [US1] Update `startLocalGame` reducer to accept optional `advancedRules` parameter in app/features/quarto/store/quartoSlice.ts
- [x] T009 [US1] Update `startAIGame` reducer to accept optional `advancedRules` parameter in app/features/quarto/store/quartoSlice.ts
- [x] T010 [US1] Update `placePiece` reducer to pass `advancedRules` flag to win detection in app/features/quarto/store/quartoSlice.ts
- [x] T011 [US1] Update `applyAIMove` reducer to pass `advancedRules` flag to win detection in app/features/quarto/store/quartoSlice.ts
- [x] T012 [US1] Add advanced rules toggle to game mode selection UI in app/routes/games/quarto/index.tsx
- [x] T013 [US1] Update AI minimax evaluation to consider 2x2 squares when advanced rules enabled in app/features/quarto/ai/minimax.ts

**Checkpoint**: User Story 1 should be fully functional - games can be played with 2x2 square win detection

---

## Phase 4: User Story 2 - Update "How to Play" Rules Page (Priority: P1)

**Goal**: The rules page explains the 2x2 square advanced variation so players understand this winning condition

**Independent Test**: Visit /games/quarto/rules, verify new "Advanced Variation" section is visible and explains 2x2 square rule

### Implementation for User Story 2

- [x] T014 [P] [US2] Add 'advanced' section content to RULES_SECTIONS in app/features/quarto/components/rules/data/sections.ts
- [x] T015 [P] [US2] Add WINNING_SQUARES_CONFIG for 2x2 square overlay visualization in app/features/quarto/components/rules/data/winningLines.ts
- [x] T016 [US2] Add 'square' category to WinningLineConfig type in app/features/quarto/components/rules/data/types.ts
- [x] T017 [US2] Update BoardWithOverlays component to show 2x2 square patterns when toggled in app/features/quarto/components/rules/BoardWithOverlays.tsx
- [x] T018 [US2] Add example board configuration showing a 2x2 square win in app/features/quarto/components/rules/data/exampleBoards.ts
- [x] T019 [US2] Add InteractiveContent case for 'advanced' section in RulesPage in app/features/quarto/components/rules/RulesPage.tsx
- [x] T020 [US2] Add SquareOverlay component for 2x2 square visualization in app/features/quarto/components/rules/BoardWithOverlays.tsx

**Checkpoint**: User Story 2 complete - rules page explains 2x2 square variation with visual examples

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 Update winning line animation to support 2x2 square patterns in app/features/quarto/components/WinAnimation.tsx
- [x] T022 Verify AI properly evaluates 2x2 square threats at all difficulty levels
- [x] T023 Update board section content to mention "19 winning patterns" (10 lines + 9 squares) when advanced rules enabled in app/features/quarto/components/rules/data/sections.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase completion
  - User Story 1 and User Story 2 can proceed in parallel
- **Polish (Phase 5)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Game logic changes
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Rules page updates
  - Note: US1 and US2 are independent and can be worked in parallel

### Within Each Phase

- T001 and T002 can run in parallel (different additions to same file)
- T003 → T004 → T005 (sequential, builds on prior functions)
- T006 and T007 depend on T003-T005
- T014, T015 can run in parallel (different data files)
- T016 → T017 → T020 (type definition before component)
- T018, T019 can run in parallel with T17

### Parallel Opportunities

- Phase 1: T001 and T002 can run in parallel
- Phase 2: T003-T05 sequential, T006-T007 sequential after T003-T005
- Phase 3: Most tasks sequential (Redux state flow)
- Phase 4: T014, T015 parallel; T018, T19 parallel

---

## Parallel Example: User Story 2 Tasks

```bash
# Launch data file updates together:
Task: "Add 'advanced' section content in sections.ts"
Task: "Add WINNING_SQUARES_CONFIG in winningLines.ts"

# Launch example and InteractiveContent together:
Task: "Add example board configuration for 2x2 square win"
Task: "Add InteractiveContent case for 'advanced' section"
```

---

## Implementation Strategy

### MVP First (Both User Stories Are P1)

1. Complete Phase 1: Setup (type definitions)
2. Complete Phase 2: Foundational (win detection logic)
3. Complete Phase 3: User Story 1 (game can detect 2x2 wins)
4. **STOP and VALIDATE**: Test 2x2 win detection in game
5. Complete Phase 4: User Story 2 (rules page updated)
6. **VALIDATE**: Check rules page explains 2x2 squares
7. Complete Phase 5: Polish

### Incremental Delivery

1. Setup + Foundational → Win detection ready
2. Add User Story 1 → Test independently → Games support 2x2 squares
3. Add User Story 2 → Test independently → Rules page updated
4. Each story adds value without breaking previous functionality

---

## Technical Notes

### 2x2 Square Positions

The 9 possible 2x2 squares on a 4x4 board (using 0-indexed positions):

```
Square 0: [0, 1, 4, 5]     Square 1: [1, 2, 5, 6]     Square 2: [2, 3, 6, 7]
Square 3: [4, 5, 8, 9]     Square 4: [5, 6, 9, 10]    Square 5: [6, 7, 10, 11]
Square 6: [8, 9, 12, 13]   Square 7: [9, 10, 13, 14]  Square 8: [10, 11, 14, 15]
```

### SVG Paths for 2x2 Square Overlays

Using same viewBox (100x100) as winning lines:
- Square centers: calculated from cell centers (12.5, 37.5, 62.5, 87.5)
- Path: Rectangle around 2x2 cells with rounded corners

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The `advancedRules` flag allows backward compatibility (standard rules by default)
