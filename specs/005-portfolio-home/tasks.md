# Tasks: Portfolio Home - Quarto Game Showcase

**Input**: Design documents from `/specs/005-portfolio-home/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No explicit test tasks included (not requested in specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:
- **Components**: `app/components/quarto-showcase/`
- **Constants**: `app/lib/constants/`
- **Routes**: `app/routes/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create constants file with static content data

- [x] T001 Create content constants with types and data in app/lib/constants/quarto-showcase.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create component directory structure and barrel export

- [x] T002 Create quarto-showcase directory at app/components/quarto-showcase/
- [x] T003 Create barrel export in app/components/quarto-showcase/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Recruiter Discovers Quarto Game Demo (Priority: P1)

**Goal**: Display a dedicated Quarto showcase section with description and "Play Now" CTA on the home page

**Independent Test**: Visit the home page, scroll to see the Quarto showcase section, verify it explains the project and has a working "Play Now" button that navigates to `/games/quarto`

### Implementation for User Story 1

- [x] T004 [P] [US1] Create QuartoDescription component in app/components/quarto-showcase/QuartoDescription.tsx
- [x] T005 [US1] Create QuartoShowcase main section component in app/components/quarto-showcase/QuartoShowcase.tsx
- [x] T006 [US1] Update barrel export with QuartoShowcase in app/components/quarto-showcase/index.ts
- [x] T007 [US1] Add QuartoShowcase to home page after Hero section in app/routes/index.tsx
- [x] T008 [US1] Add Framer Motion entry animation to QuartoShowcase in app/components/quarto-showcase/QuartoShowcase.tsx
- [x] T009 [US1] Add responsive styling for mobile/tablet/desktop in app/components/quarto-showcase/QuartoShowcase.tsx
- [x] T010 [US1] Add accessibility attributes (aria-label, focus states) in app/components/quarto-showcase/QuartoShowcase.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors can discover and play the Quarto game

---

## Phase 4: User Story 2 - Recruiter Accesses Source Code (Priority: P2)

**Goal**: Add GitHub repository link that opens in a new tab

**Independent Test**: From the Quarto showcase section, find and click the GitHub link, verify it opens the repository in a new browser tab

### Implementation for User Story 2

- [x] T011 [US2] Add GitHub link with external link icon to QuartoShowcase in app/components/quarto-showcase/QuartoShowcase.tsx
- [x] T012 [US2] Ensure GitHub link has target="_blank" rel="noopener noreferrer" in app/components/quarto-showcase/QuartoShowcase.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - visitors can play game and view source code

---

## Phase 5: User Story 3 - Visitor Understands Technical Skills Demonstrated (Priority: P3)

**Goal**: Display skill tags showing technologies demonstrated by the project

**Independent Test**: View the Quarto showcase section and verify it displays technology badges (React, TypeScript, React Three Fiber, etc.)

### Implementation for User Story 3

- [x] T013 [P] [US3] Create SkillTags component using Shadcn Badge in app/components/quarto-showcase/SkillTags.tsx
- [x] T014 [US3] Update barrel export with SkillTags in app/components/quarto-showcase/index.ts
- [x] T015 [US3] Integrate SkillTags into QuartoShowcase in app/components/quarto-showcase/QuartoShowcase.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and validation

- [x] T016 Verify responsive layout on viewports 320px to 1920px
- [x] T017 Verify keyboard navigation and focus states for accessibility
- [x] T018 Run quickstart.md success verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) - creates directory structure
- **User Story 1 (Phase 3)**: Depends on Foundational - core showcase section
- **User Story 2 (Phase 4)**: Depends on US1 (adds to existing component)
- **User Story 3 (Phase 5)**: Depends on US1 (adds to existing component)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (GitHub link added to QuartoShowcase component)
- **User Story 3 (P3)**: Depends on US1 (SkillTags integrated into QuartoShowcase component)

### Within Each User Story

- Constants before components
- Sub-components before main component
- Main component before home page integration
- Core implementation before accessibility/polish

### Parallel Opportunities

- T004 (QuartoDescription) can run in parallel with T013 (SkillTags) if both are started before T005
- US2 and US3 can be developed in parallel if working on separate branches

---

## Parallel Example: User Story 1 + 3 Setup

```bash
# Launch these component tasks together (both are sub-components):
Task: T004 "Create QuartoDescription component"
Task: T013 "Create SkillTags component"

# Then continue sequentially with main component integration
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: User Story 1 (T004-T010)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (adds GitHub link)
4. Add User Story 3 → Test independently → Deploy/Demo (adds skill tags)
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Feature uses static content only - no loading states or error handling needed
