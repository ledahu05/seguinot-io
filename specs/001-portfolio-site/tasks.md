# Tasks: seguinot-io Portfolio Website

**Input**: Design documents from `/specs/001-portfolio-site/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are NOT included in this task list (not explicitly requested). Tests can be added later via `/speckit.tasks --tdd` if desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this project uses TanStack Start conventions:
- `app/` - Application source code
- `app/routes/` - File-based routing
- `app/components/` - Feature-based components
- `app/lib/` - Utilities, schemas, data loaders
- `app/hooks/` - Custom React hooks
- `data/` - Static CV data and images

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and TanStack Start configuration

- [x] T001 Create TanStack Start project with TypeScript via `npm create @tanstack/start@latest`
- [x] T002 Install core dependencies: framer-motion, lucide-react, zod
- [x] T003 [P] Initialize shadcn/ui with Tailwind CSS v4: `npx shadcn@latest init`
- [x] T004 [P] Add shadcn/ui components: button, card, dialog, badge via `npx shadcn@latest add`
- [x] T005 Create project directory structure per plan.md in app/components/, app/lib/, app/hooks/
- [x] T006 [P] Configure Vitest in vitest.config.ts with jsdom environment
- [x] T007 [P] Configure Playwright in playwright.config.ts for E2E tests
- [x] T008 [P] Update package.json scripts (dev, build, test, test:e2e, typecheck)
- [x] T009 Configure Vercel deployment preset in app.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Why Foundational**: These components (schemas, data loaders, theme system) are used by ALL user stories

- [x] T010 [P] Create ContactSchema in app/lib/schemas/cv.schema.ts with email, phone, linkedin, github, portfolio fields
- [x] T011 [P] Create ProfileSchema in app/lib/schemas/cv.schema.ts with name, title, location, summary, contact
- [x] T012 [P] Create PeriodSchema in app/lib/schemas/cv.schema.ts with start, end fields
- [x] T013 [P] Create ProjectSchema in app/lib/schemas/cv.schema.ts with title, role, company, location, period, highlights, technologies
- [x] T014 [P] Create SkillsSchema in app/lib/schemas/cv.schema.ts with all 7 category keys
- [x] T015 [P] Create EducationSchema and LanguageSchema in app/lib/schemas/cv.schema.ts
- [x] T016 Create CVDataSchema (root) in app/lib/schemas/cv.schema.ts composing all schemas
- [x] T017 [P] Create ScreenshotSchema in app/lib/schemas/screenshot.schema.ts with filename, path, alt
- [x] T018 [P] Create ProjectWithScreenshotsSchema extending ProjectSchema in app/lib/schemas/screenshot.schema.ts
- [x] T019 Create screenshot mapping SCREENSHOT_MAP constant in app/lib/screenshot-mapper.ts
- [x] T020 Implement getProjectScreenshots function with Zod validation in app/lib/screenshot-mapper.ts
- [x] T021 Create cv-loader.ts with loadCVData, getCVData, getProfile, getSkills, getProjects functions in app/lib/data/cv-loader.ts
- [x] T022 [P] Create ThemeSchema in app/lib/schemas/theme.schema.ts with dark/light enum
- [x] T023 Implement useTheme hook with localStorage persistence in app/hooks/use-theme.ts
- [x] T024 Create ThemeProvider component with React Context in app/components/shared/ThemeProvider.tsx
- [x] T025 Create cn utility function in app/lib/utils/cn.ts for Tailwind class merging
- [x] T026 [P] Create constants.ts in app/lib/constants.ts with SKILL_CATEGORY_ORDER, FEATURED_PROJECTS
- [x] T027 Configure global CSS with dark/light theme CSS variables in app/styles/globals.css
- [x] T028 Create root layout __root.tsx with ThemeProvider, dark mode script, global styles in app/routes/__root.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Portfolio Landing (Priority: P1) MVP

**Goal**: Professional hero section with headline, subhead, and CTA buttons that communicate Christophe's expertise

**Independent Test**: Load homepage, verify hero content displays with "Christophe Seguinot: Senior Frontend Developer" headline and working CTA buttons

### Implementation for User Story 1

- [x] T029 [P] [US1] Create Hero section container component in app/components/hero/Hero.tsx
- [x] T030 [P] [US1] Create HeroHeadline component displaying name and title in app/components/hero/HeroHeadline.tsx
- [x] T031 [P] [US1] Create HeroSubhead component displaying summary from profile in app/components/hero/HeroSubhead.tsx
- [x] T032 [P] [US1] Create CTAButtons component with "View Projects" and "Contact" buttons in app/components/hero/CTAButtons.tsx
- [x] T033 [US1] Implement smooth scroll to section functionality in CTAButtons
- [x] T034 [US1] Add Framer Motion fade-in + slide-up animation (500ms on page load) in Hero.tsx
- [x] T035 [US1] Integrate Hero section into main page in app/routes/index.tsx
- [x] T036 [US1] Add responsive styling for Hero (320px-2560px) using Tailwind responsive prefixes

**Checkpoint**: User Story 1 complete - Landing page with hero section is fully functional and testable

---

## Phase 4: User Story 2 - Browse Experience Timeline (Priority: P2)

**Goal**: Interactive experience timeline showing all 12 projects chronologically with key highlights and screenshots

**Independent Test**: View timeline, verify all 12 career entries display with correct company names, roles, achievements, and screenshots

### Implementation for User Story 2

- [x] T037 [P] [US2] Create Timeline container component in app/components/timeline/Timeline.tsx
- [x] T038 [P] [US2] Create TimelineEntry component for individual career entries in app/components/timeline/TimelineEntry.tsx
- [x] T039 [P] [US2] Create TimelineContent component for highlights/details in app/components/timeline/TimelineContent.tsx
- [x] T040 [US2] Integrate project screenshots into TimelineEntry using getProjectScreenshots
- [x] T041 [US2] Add screenshot thumbnail display in TimelineEntry component
- [x] T042 [US2] Add Framer Motion stagger reveal animation (300ms each, scroll trigger) in Timeline.tsx
- [x] T043 [US2] Add Lightbox component for viewing screenshots in larger format in app/components/shared/Lightbox.tsx
- [x] T044 [US2] Implement keyboard navigation (arrow keys, escape) in Lightbox component
- [x] T045 [US2] Integrate Timeline section into main page in app/routes/index.tsx
- [x] T046 [US2] Add responsive styling for Timeline (vertical layout) using Tailwind

**Checkpoint**: User Story 2 complete - Timeline shows all 12 projects with screenshots and lightbox

---

## Phase 5: User Story 3 - Explore Tech Stack (Priority: P2)

**Goal**: Grid layout categorizing skills by domain (7 categories) sourced from structured CV data

**Independent Test**: View tech stack grid, verify all 7 categories display with correct technologies from JSON data

### Implementation for User Story 3

- [x] T047 [P] [US3] Create SkillsGrid container component in app/components/skills/SkillsGrid.tsx
- [x] T048 [P] [US3] Create SkillCategory component for individual category display in app/components/skills/SkillCategory.tsx
- [x] T049 [P] [US3] Create SkillBadge component for individual skill items in app/components/skills/SkillBadge.tsx
- [x] T050 [US3] Implement bento-box style asymmetric grid layout in SkillsGrid
- [x] T051 [US3] Add Framer Motion scale + fade animation (200ms, scroll trigger) in SkillCategory
- [x] T052 [US3] Integrate SkillsGrid section into main page in app/routes/index.tsx
- [x] T053 [US3] Add responsive styling for SkillsGrid using Tailwind grid utilities

**Checkpoint**: User Story 3 complete - Tech stack grid displays all 7 skill categories

---

## Phase 6: User Story 4 - Review Project Case Studies (Priority: P3)

**Goal**: Detailed case study cards with Challenge, Solution, Tech Stack sections and visual screenshots

**Independent Test**: View project showcase, verify case study cards contain Challenge, Solution, Tech Stack, and relevant screenshots

### Implementation for User Story 4

- [x] T054 [P] [US4] Create ProjectShowcase container component in app/components/projects/ProjectShowcase.tsx
- [x] T055 [P] [US4] Create ProjectCard component with Challenge/Solution/Tech structure in app/components/projects/ProjectCard.tsx
- [x] T056 [P] [US4] Create ProjectScreenshots component for image gallery in app/components/projects/ProjectScreenshots.tsx
- [x] T057 [US4] Derive Challenge and Solution content from highlights array in ProjectCard
- [x] T058 [US4] Implement screenshot carousel/gallery navigation in ProjectScreenshots
- [x] T059 [US4] Connect Lightbox component for full-size image viewing
- [x] T060 [US4] Add Framer Motion slide-up animation (300ms, scroll trigger) in ProjectCard
- [x] T061 [US4] Integrate ProjectShowcase section into main page in app/routes/index.tsx
- [x] T062 [US4] Add responsive styling for ProjectShowcase using Tailwind

**Checkpoint**: User Story 4 complete - Project case studies display with screenshots and navigation

---

## Phase 7: User Story 5 - Contact and Connect (Priority: P3)

**Goal**: Contact section with location, LinkedIn, email, and phone for visitor outreach

**Independent Test**: View contact section, verify location, LinkedIn link, email link, and phone link are visible and functional

### Implementation for User Story 5

- [x] T063 [P] [US5] Create Contact section container component in app/components/contact/Contact.tsx
- [x] T064 [P] [US5] Create ContactInfo component displaying location in app/components/contact/ContactInfo.tsx
- [x] T065 [P] [US5] Create SocialLinks component with LinkedIn, email, phone in app/components/contact/SocialLinks.tsx
- [x] T066 [US5] Implement mailto: link for email (christophe.seguinot@gmail.com)
- [x] T067 [US5] Implement tel: link for phone (+33 6 26 33 07 10)
- [x] T068 [US5] Add external link behavior (new tab) for LinkedIn
- [x] T069 [US5] Add Lucide React icons for contact methods in SocialLinks
- [x] T070 [US5] Integrate Contact section into main page in app/routes/index.tsx
- [x] T071 [US5] Add responsive styling for Contact section using Tailwind

**Checkpoint**: User Story 5 complete - Contact section with all contact methods functional

---

## Phase 8: User Story 6 - Toggle Dark/Light Mode (Priority: P4)

**Goal**: Dark/Light mode toggle with Dark as default, persisting preference across visits

**Independent Test**: Click theme toggle, verify colors change and preference persists after page reload

### Implementation for User Story 6

- [x] T072 [P] [US6] Create ThemeToggle button component in app/components/shared/ThemeToggle.tsx
- [x] T073 [US6] Add Lucide React Sun/Moon icons with toggle animation
- [x] T074 [US6] Add Framer Motion rotate animation (200ms) on icon switch
- [x] T075 [US6] Position ThemeToggle in header/navigation area in __root.tsx
- [x] T076 [US6] Verify localStorage persistence works across sessions
- [x] T077 [US6] Test dark mode flash prevention script in __root.tsx

**Checkpoint**: User Story 6 complete - Theme toggle works with persistence

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T078 [P] Add section anchors (id attributes) for smooth scroll navigation
- [x] T079 [P] Implement image lazy loading for all below-fold images
- [x] T080 [P] Add blur placeholder for images during load
- [x] T081 Implement prefers-reduced-motion support in all Framer Motion animations
- [x] T082 [P] Add ARIA labels and semantic HTML for accessibility (WCAG 2.1 AA)
- [x] T083 [P] Add keyboard focus styles for interactive elements
- [x] T084 Verify color contrast ratios meet WCAG 2.1 AA in both themes
- [x] T085 [P] Add meta tags for SEO (title, description, og:image) in __root.tsx
- [x] T086 Run Lighthouse audit and optimize for 90+ mobile score
- [x] T087 Verify Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms)
- [x] T088 [P] Create graceful error state component for malformed JSON edge case
- [x] T089 Add image fallback/placeholder for missing screenshots
- [x] T090 Run quickstart.md verification checklist
- [x] T091 Deploy to Vercel and verify production build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3 → P4)
  - Or in parallel if team capacity allows (US2+US3 can run together as both P2)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Uses Lightbox (can be built within US2)
- **User Story 3 (P2)**: Can start after Foundational - Independent of US1, US2
- **User Story 4 (P3)**: Can start after Foundational - Reuses Lightbox from US2
- **User Story 5 (P3)**: Can start after Foundational - Independent of other stories
- **User Story 6 (P4)**: Can start after Foundational - ThemeProvider already in foundation

### Within Each User Story

- Components marked [P] within a story can run in parallel
- Non-[P] tasks should complete sequentially
- Integration into index.tsx should be last task per story

### Parallel Opportunities

**Setup Phase:**
```
T003 + T004 (shadcn init + add components)
T006 + T007 + T008 (test configs + scripts)
```

**Foundational Phase:**
```
T010 + T011 + T012 + T013 + T014 + T015 (all schema definitions)
T017 + T018 + T022 (screenshot and theme schemas)
```

**User Story Phases:**
```
# US1 - All component files:
T029 + T030 + T031 + T032

# US2 - All component files:
T037 + T038 + T039

# US3 - All component files:
T047 + T048 + T049

# US4 - All component files:
T054 + T055 + T056

# US5 - All component files:
T063 + T064 + T065
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Hero section)
4. **STOP and VALIDATE**: Test hero displays correctly, CTAs work
5. Deploy to Vercel for early feedback

### Incremental Delivery (Recommended)

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test → Deploy (MVP with hero!)
3. Add User Story 2 + 3 (both P2) → Test → Deploy (Timeline + Skills)
4. Add User Story 4 + 5 (both P3) → Test → Deploy (Projects + Contact)
5. Add User Story 6 (P4) → Test → Deploy (Theme toggle)
6. Polish Phase → Final deploy

### Parallel Team Strategy

With multiple developers after Foundational:
- Developer A: User Story 1 → User Story 4
- Developer B: User Story 2 → User Story 5
- Developer C: User Story 3 → User Story 6

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable per spec.md acceptance criteria
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Data source: `data/formatted_seguinot_cv_portfolio.json`
- Images: `data/images/` (28 screenshots)
