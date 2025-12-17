# Tasks: SEO Optimization for All Pages

**Input**: Design documents from `/specs/009-seo-optimization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Tests are performed via Lighthouse CLI and manual validation (no unit tests specified).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (SEO Utility Library)

**Purpose**: Create shared SEO utilities that all pages will use

- [x] T001 Create SEO constants file with site metadata in `app/lib/seo/constants.ts`
- [x] T002 [P] Create meta tag TypeScript types in `app/lib/seo/types.ts`
- [x] T003 Create meta tag generator utility in `app/lib/seo/meta.ts`
- [x] T004 [P] Create JSON-LD schema generators in `app/lib/seo/structured-data.ts`
- [x] T005 Create barrel export in `app/lib/seo/index.ts`

**Checkpoint**: SEO utility library complete - can now update individual routes

---

## Phase 2: Foundational (Default OG Image & Root Layout)

**Purpose**: Core infrastructure that enables all SEO features across the site

**CRITICAL**: These tasks provide fallback SEO values for all pages

- [x] T006 Create default Open Graph image (1200x630) at `data/images/og/default.png` (see [howto.md](./howto.md#t006-create-default-og-image) for prompt)
- [x] T007 Update root layout with default OG tags and Twitter Card meta in `app/routes/__root.tsx`
- [x] T008 Add canonical URL link helper to meta utility in `app/lib/seo/meta.ts`

**Checkpoint**: Foundation ready - all pages now have baseline SEO from root layout

---

## Phase 3: User Story 1 - Search Engine Discoverability (Priority: P1)

**Goal**: Ensure all pages have proper meta tags, unique titles/descriptions, and pass Lighthouse SEO audit

**Independent Test**: Run `npx lighthouse <url> --only-categories=seo` on each page and verify score 90+

### Homepage SEO (US1)

- [x] T009 [US1] Add head() function with complete meta tags to homepage in `app/routes/index.tsx`
- [x] T010 [US1] Add Person JSON-LD schema to homepage in `app/routes/index.tsx`
- [x] T011 [US1] Add WebSite JSON-LD schema to homepage in `app/routes/index.tsx`
- [x] T012 [US1] Verify homepage has single h1 and semantic structure in `app/routes/index.tsx`

### Blog Pages SEO (US1)

- [x] T013 [US1] Enhance blog listing meta with og:url, og:image, canonical in `app/routes/blog/index.tsx`
- [x] T014 [US1] Add CollectionPage JSON-LD schema to blog listing in `app/routes/blog/index.tsx`
- [x] T015 [US1] Enhance blog article meta with og:url, og:image, canonical in `app/routes/blog/$slug.tsx`
- [x] T016 [US1] Add Article JSON-LD schema to blog articles in `app/routes/blog/$slug.tsx`

### Quarto Game Pages SEO (US1)

- [x] T017 [P] [US1] Add head() with complete meta tags to Quarto hub in `app/routes/games/quarto/index.tsx`
- [x] T018 [P] [US1] Add SoftwareApplication JSON-LD schema to Quarto hub in `app/routes/games/quarto/index.tsx`
- [x] T019 [P] [US1] Add head() with meta tags to Quarto rules page in `app/routes/games/quarto/rules.tsx`
- [x] T020 [P] [US1] Add head() with noIndex meta to Quarto play page in `app/routes/games/quarto/play.tsx`
- [x] T021 [P] [US1] Add head() with noIndex meta to Quarto online page in `app/routes/games/quarto/online.tsx`
- [x] T022 [P] [US1] Add head() with noIndex meta to Quarto join page in `app/routes/games/quarto/join.tsx`

**Checkpoint**: All pages have unique titles, descriptions, and pass Lighthouse SEO audit at 90+

---

## Phase 4: User Story 2 - Social Media Sharing (Priority: P1)

**Goal**: All pages display attractive preview cards when shared on LinkedIn, Twitter, Facebook

**Independent Test**: Verify previews using Facebook Debugger, Twitter Card Validator, and LinkedIn Post Inspector

### Complete Open Graph Implementation (US2)

- [x] T023 [US2] Verify og:image uses absolute URLs with SITE_CONFIG.url in `app/lib/seo/meta.ts`
- [x] T024 [US2] Add og:site_name meta tag to all pages via `app/lib/seo/meta.ts`
- [x] T025 [US2] Ensure blog articles use article:published_time, article:author, article:tag in `app/routes/blog/$slug.tsx`

### Complete Twitter Card Implementation (US2)

- [x] T026 [US2] Verify twitter:card is summary_large_image on all pages via `app/lib/seo/meta.ts`
- [x] T027 [US2] Add twitter:image with absolute URL to all pages via `app/lib/seo/meta.ts`

**Checkpoint**: Social sharing previews display correctly on LinkedIn, Twitter, and Facebook

---

## Phase 5: User Story 3 - Rich Search Results (Priority: P2)

**Goal**: Pages pass Google Rich Results Test with valid JSON-LD structured data

**Independent Test**: Validate each page type at https://search.google.com/test/rich-results

### Validate and Refine Structured Data (US3)

- [ ] T028 [US3] Validate Person schema on homepage passes Google Rich Results Test (see [howto.md](./howto.md#t028-t032-validate-json-ld-schemas))
- [ ] T029 [US3] Validate Article schema on blog articles passes Google Rich Results Test (see howto.md)
- [ ] T030 [US3] Validate CollectionPage schema on blog listing passes Google Rich Results Test (see howto.md)
- [ ] T031 [US3] Validate SoftwareApplication schema on Quarto hub passes Google Rich Results Test (see howto.md)
- [ ] T032 [US3] Fix any JSON-LD validation errors identified in testing (IF NEEDED)

**Checkpoint**: All JSON-LD schemas pass Google Rich Results Test without errors

---

## Phase 6: User Story 4 - Internal Linking for SEO (Priority: P3)

**Goal**: All public pages reachable within 3 clicks from homepage

**Independent Test**: Manual crawl verification - start at homepage and verify all pages reachable within 3 levels

### Verify Navigation Structure (US4)

- [x] T033 [US4] Verify homepage links to blog and Quarto game sections (existing navigation)
- [x] T034 [US4] Verify blog listing links to all article pages (BlogList component)
- [x] T035 [US4] Verify Quarto hub links to rules page (existing "Learn How to Play" link)
- [x] T036 [US4] Verify all pages have back navigation to homepage (existing navigation)

**Checkpoint**: All public pages discoverable within 3 navigation levels from homepage

---

## Phase 7: Polish & Validation

**Purpose**: Final validation and documentation

- [ ] T037 Run Lighthouse SEO audit on all 5 public pages and document scores (see [howto.md](./howto.md#t037-t040-lighthouse-seo-audits))
- [ ] T038 [P] Verify all images have descriptive alt text across the site (see howto.md)
- [ ] T039 [P] Verify heading hierarchy (single h1, logical h2-h6) on all pages (see howto.md)
- [ ] T040 Complete quickstart.md validation checklist (see howto.md)
- [x] T041 Build application and verify no errors (`pnpm build`)

---

## Phase 8: Documentation (Blog Article)

**Purpose**: Document the SEO optimization journey for the portfolio blog

**Note**: This article will be iteratively updated with production test results (Lighthouse scores, Rich Results validation, social preview testing)

### Initial Article Creation

- [x] T042 Create blog article file `data/blog/implementing-seo-optimization.md` with frontmatter
- [x] T043 Write introduction section explaining why SEO matters for a portfolio
- [x] T044 Write requirements section covering the 4 user stories and priorities
- [x] T045 Write technology stack section (TanStack Start head(), JSON-LD, Open Graph)

### Technical Implementation Documentation

- [x] T046 Document SEO utility library architecture (`app/lib/seo/` modules)
- [x] T047 Document meta tag generation patterns and `generatePageMeta()` utility
- [x] T048 Document JSON-LD structured data implementation (Person, Article, WebSite, etc.)
- [x] T049 Document noIndex pattern for game session pages

### Production Validation Results (To be updated after deployment)

- [x] T050 Add Lighthouse SEO scores section with placeholder for actual scores
- [x] T051 Add Rich Results validation section with placeholder for test outcomes
- [x] T052 Add social preview testing section with placeholder for screenshots/results

### Lessons Learned & Key Takeaways

- [x] T053 Write key takeaways section covering implementation insights
- [x] T054 Write future improvements section (sitemap, robots.txt, performance)
- [x] T055 Final review and polish of article

**Checkpoint**: Blog article published and ready for iterative updates with production results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - provides baseline for all pages
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 priority but can be worked in parallel
  - US3 and US4 can start after Foundational but benefit from US1/US2 being complete
- **Polish (Phase 7)**: Depends on all user stories being complete
- **Blog Article (Phase 8)**: Can start after Phase 1-4 are complete; validation sections (T050-T052) require production deployment

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core meta tags
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Builds on US1 meta tags
- **User Story 3 (P2)**: Can start after US1 - Validates JSON-LD from US1
- **User Story 4 (P3)**: Can start after Foundational - Navigation verification only

### Within Each User Story

- Models/utilities before route implementations
- Route updates can be parallelized where marked [P]
- Validation tasks after implementation

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T001 constants.ts → T002 types.ts (parallel) → T003 meta.ts + T004 structured-data.ts (parallel) → T005 index.ts
```

**Phase 2 (Foundational)**:
```
T006 OG image can start immediately
T007 __root.tsx depends on T001-T005
T008 meta.ts enhancement depends on T003
```

**Phase 3 (US1) - Route Updates**:
```
T017, T018, T019, T020, T021, T022 can all run in parallel (different route files)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (SEO utility library)
2. Complete Phase 2: Foundational (OG image + root layout)
3. Complete Phase 3: User Story 1 (all pages get meta tags)
4. Complete Phase 4: User Story 2 (social sharing complete)
5. **STOP and VALIDATE**: Run Lighthouse on all pages, verify 90+ scores
6. Deploy and test social sharing on actual platforms

### Incremental Delivery

1. Setup + Foundational → Baseline SEO active
2. Add US1 → All pages have unique meta tags → Lighthouse 90+
3. Add US2 → Social sharing previews work → Deploy
4. Add US3 → JSON-LD validated → Rich results possible
5. Add US4 → Navigation verified → Complete SEO coverage

---

## Task Summary

| Phase | Description | Tasks | Parallel |
|-------|-------------|-------|----------|
| 1 | Setup | 5 | 2 |
| 2 | Foundational | 3 | 0 |
| 3 | US1 - Discoverability | 14 | 6 |
| 4 | US2 - Social Sharing | 5 | 0 |
| 5 | US3 - Rich Results | 5 | 0 |
| 6 | US4 - Internal Linking | 4 | 0 |
| 7 | Polish | 5 | 2 |
| 8 | Blog Article | 14 | 0 |
| **Total** | | **55** | **10** |

---

## Notes

- [P] tasks = different files, no dependencies within the same phase
- [Story] label maps task to specific user story for traceability
- US1 and US2 are both P1 priority - complete both before deployment
- JSON-LD validation (US3) should happen after implementation to catch issues
- No unit tests specified - validation via Lighthouse CLI and manual tools
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
