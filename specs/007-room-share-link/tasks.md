# Tasks: Room Share Link

**Input**: Design documents from `/specs/007-room-share-link/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- Routes: `app/routes/games/quarto/`
- Components: `app/features/quarto/components/`
- Utils: `app/features/quarto/utils/`
- Hooks: `app/lib/hooks/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared utilities that all user stories depend on

- [x] T001 [P] Create generateShareLink utility in app/features/quarto/utils/shareLink.ts
- [x] T002 [P] Create useShare hook in app/lib/hooks/useShare.ts

**Checkpoint**: Core utilities ready for component development

---

## Phase 2: User Story 1 - Share Room Link (Priority: P1) 🎯 MVP

**Goal**: Room creators can share a direct link to their game room from the waiting screen

**Independent Test**: Create a room, click share button, verify link is copied/shared with correct room code in URL

### Implementation for User Story 1

- [x] T003 [US1] Create ShareRoomButton component in app/features/quarto/components/ShareRoomButton.tsx
- [x] T004 [US1] Export ShareRoomButton from app/features/quarto/components/index.ts
- [x] T005 [US1] Import ShareRoomButton in app/routes/games/quarto/online.tsx
- [x] T006 [US1] Add ShareRoomButton to waiting screen section in app/routes/games/quarto/online.tsx (replace text instruction with button)

**Checkpoint**: Host can share room link from waiting screen - US1 complete and testable

---

## Phase 3: User Story 2 - Join via Shared Link (Priority: P1)

**Goal**: Users clicking a shared link land on a join page, enter their name, and automatically join the room

**Independent Test**: Open share link in browser, enter name, verify redirect to online game with correct room code and host=false

### Implementation for User Story 2

- [x] T007 [US2] Create join route with Zod validation in app/routes/games/quarto/join.tsx
- [x] T008 [US2] Implement JoinRoomPage component with name input form in app/routes/games/quarto/join.tsx
- [x] T009 [US2] Add navigation to online game on form submit in app/routes/games/quarto/join.tsx
- [x] T010 [US2] Add cancel button navigation back to menu in app/routes/games/quarto/join.tsx
- [x] T011 [US2] Handle invalid room code format (redirect to menu) in app/routes/games/quarto/join.tsx

**Checkpoint**: Guests can join via shared link - US2 complete and testable

---

## Phase 4: User Story 3 - Mobile Share Experience (Priority: P2)

**Goal**: Mobile users see native share sheet, desktop users get clipboard copy with visual feedback

**Independent Test**: On mobile, tap share button and verify native share sheet opens. On desktop, click share and verify "Link Copied!" feedback appears.

### Implementation for User Story 3

> Note: Core mobile/desktop detection is already implemented in useShare hook (T002). This phase ensures proper UI feedback.

- [x] T012 [US3] Add visual states (idle, copied, error) to ShareRoomButton in app/features/quarto/components/ShareRoomButton.tsx
- [x] T013 [US3] Add copy feedback timeout (2s) in ShareRoomButton in app/features/quarto/components/ShareRoomButton.tsx
- [x] T014 [US3] Add appropriate icons (Share2, Copy, Check) from lucide-react in app/features/quarto/components/ShareRoomButton.tsx
- [x] T015 [US3] Add accessible aria-labels and focus states in app/features/quarto/components/ShareRoomButton.tsx

**Checkpoint**: Share experience is polished for both mobile and desktop - US3 complete

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T016 Verify share link works across environments (localhost, preview, production)
- [x] T017 Test full flow: create room → share link → join via link → game starts
- [x] T018 Verify accessibility (keyboard navigation, screen reader announces feedback)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (US1)**: Depends on Phase 1 (needs utilities)
- **Phase 3 (US2)**: No dependency on US1 - can be done in parallel after Phase 1
- **Phase 4 (US3)**: Enhances US1 components - best done after US1
- **Phase 5 (Polish)**: Depends on all user stories

### User Story Dependencies

```
Phase 1: Setup
    ├── T001 generateShareLink (utility)
    └── T002 useShare hook (utility)
           │
           ├──────────────────┐
           ▼                  ▼
Phase 2: US1 (Share)    Phase 3: US2 (Join)
    T003-T006              T007-T011
           │
           ▼
Phase 4: US3 (Mobile Polish)
    T012-T015
           │
           ▼
Phase 5: Polish
    T016-T018
```

### Parallel Opportunities

**Phase 1 (all parallel)**:
- T001 and T002 can be developed simultaneously (different files)

**US1 and US2 (parallel after Phase 1)**:
- US1 (T003-T006) and US2 (T007-T011) can be developed in parallel by different developers
- Both only depend on Phase 1 utilities

---

## Parallel Example: Phase 1

```bash
# Launch both utility tasks together:
Task: "Create generateShareLink utility in app/features/quarto/utils/shareLink.ts"
Task: "Create useShare hook in app/lib/hooks/useShare.ts"
```

## Parallel Example: US1 and US2

```bash
# After Phase 1 complete, launch both stories:
# Developer A - US1:
Task: "Create ShareRoomButton component in app/features/quarto/components/ShareRoomButton.tsx"

# Developer B - US2:
Task: "Create join route with Zod validation in app/routes/games/quarto/join.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: User Story 1 (T003-T006)
3. **STOP and VALIDATE**: Test share button independently
4. Deploy/demo if ready - hosts can share links!

### Full Feature (All Stories)

1. Complete Phase 1 → Utilities ready
2. Complete US1 + US2 in parallel → Core feature complete
3. Complete US3 → Polish share experience
4. Complete Phase 5 → Full validation

### Suggested MVP Scope

**US1 alone delivers value**: Host can share a link, even if join page isn't built yet. The link format will work once US2 is complete.

However, **US1 + US2 together** is recommended as true MVP since:
- US1 without US2 = link goes nowhere
- Both stories are P1 priority
- Combined they complete the core user journey

---

## Notes

- No new dependencies required (uses existing TanStack Router, Zod, Lucide)
- No Redux state changes - all local component state
- Existing error handling in online.tsx covers room-not-found scenarios
- HTTPS required for Clipboard API (already satisfied in production)
