# Implementation Plan: SEO Optimization for All Pages

**Branch**: `009-seo-optimization` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-seo-optimization/spec.md`

## Summary

Add comprehensive SEO optimization to all pages of the portfolio website. This includes proper meta tags (title, description), Open Graph and Twitter Card tags for social sharing, JSON-LD structured data for rich search results, and semantic HTML validation. The implementation uses TanStack Start's `head()` function for dynamic meta tag management and follows the project's new SEO constitution principle (XI).

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Node.js 20+
**Primary Dependencies**: TanStack Start (head() function for meta tags), existing CV data loader
**Storage**: N/A - meta tags derived from existing content data
**Testing**: Vitest (unit), Lighthouse CLI (SEO audit)
**Target Platform**: Web (Vercel deployment with SSR)
**Project Type**: Web application (TanStack Start)
**Performance Goals**: Lighthouse SEO score 90+, no bundle size increase from SEO changes
**Constraints**: Must use TanStack Start's head() function, server-side rendering required
**Scale/Scope**: 9 pages to optimize (homepage, blog listing, blog articles, 5 Quarto game pages)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | SEO utilities in `app/lib/seo/`, page-specific meta in route files |
| II. Tech Stack | ✅ PASS | Uses TanStack Start head() function, no new frameworks |
| III. Testing First | ✅ PASS | Unit tests for meta tag utilities, Lighthouse validation |
| IV. Accessibility | ✅ PASS | Semantic HTML and alt text requirements align with accessibility |
| V. Performance | ✅ PASS | No bundle size increase; meta tags are SSR-only |
| VI. Minimal Dependencies | ✅ PASS | No new dependencies required |
| VII. Swiss Style | ✅ PASS | No visual changes |
| VIII. Micro-interactions | N/A | Not applicable to SEO feature |
| IX. Content-First | ✅ PASS | Meta content derived from existing CV data and blog frontmatter |
| X. Responsive Design | N/A | Not applicable to SEO feature |
| XI. SEO Optimization | ✅ PASS | This feature implements the SEO constitution principle |

**Pre-Phase Gate**: ✅ PASSED

## Project Structure

### Documentation (this feature)

```text
specs/009-seo-optimization/
├── plan.md              # This file
├── research.md          # Phase 0 output - SEO implementation patterns
├── data-model.md        # Phase 1 output - meta tag schemas
├── quickstart.md        # Phase 1 output - validation checklist
├── contracts/           # Phase 1 output - N/A (no API contracts)
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── lib/
│   └── seo/
│       ├── meta.ts              # Meta tag generation utilities
│       ├── structured-data.ts   # JSON-LD schema generators
│       └── constants.ts         # Default meta values, site info
├── routes/
│   ├── __root.tsx              # Update: add default meta tags
│   ├── index.tsx               # Update: homepage meta + Person JSON-LD
│   ├── blog/
│   │   ├── index.tsx           # Update: blog listing meta + CollectionPage JSON-LD
│   │   └── $slug.tsx           # Update: article meta + Article JSON-LD (partially done)
│   └── games/quarto/
│       ├── index.tsx           # Update: game hub meta
│       ├── play.tsx            # Update: play page meta
│       ├── online.tsx          # Update: online mode meta
│       ├── join.tsx            # Update: join page meta
│       └── rules.tsx           # Update: rules page meta

data/
└── images/
    └── og/                     # New: Open Graph images
        └── default.png         # Default social sharing image (1200x630)
```

**Structure Decision**: SEO utilities consolidated in `app/lib/seo/`. Page-specific meta tags remain in route files using the existing TanStack Start `head()` pattern. JSON-LD scripts rendered inline in components.

## Key Technical Decisions

### Meta Tag Strategy

Use TanStack Start's `head()` function in each route for page-specific meta tags:
- Title: Unique per page, max 60 characters
- Description: Unique per page, max 160 characters
- Canonical: Full URL to prevent duplicate content
- Open Graph: Complete set (title, description, type, url, image)
- Twitter Card: Summary with large image

### Structured Data Strategy

Implement JSON-LD schemas using a utility function approach:
- `generatePersonSchema()`: For homepage (portfolio owner info)
- `generateArticleSchema()`: For blog articles
- `generateWebSiteSchema()`: For site-wide organization info
- Rendered via `<script type="application/ld+json">` in head

### Default Fallbacks

- Default OG image: Create `/data/images/og/default.png` (1200x630)
- Default description: Portfolio owner's professional summary
- Long titles: Truncate at 57 characters + "..."

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing meta tags on dynamic routes | Low | Medium | Unit tests for all route meta functions |
| Invalid JSON-LD syntax | Low | Low | Google Rich Results Test validation |
| OG image not loading | Low | Medium | Use absolute URLs, verify at deployment |
| Duplicate meta tags | Low | Medium | Audit with Lighthouse, test canonical URLs |

---

## Post-Phase 1 Constitution Re-Check

*Re-evaluated after design phase completion.*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Clean Architecture | ✅ PASS | SEO utilities follow FSD pattern in lib/seo/ |
| II. Tech Stack | ✅ PASS | No new dependencies, uses existing TanStack Start features |
| III. Testing First | ✅ PASS | Lighthouse validation defined in quickstart.md |
| IV. Accessibility | ✅ PASS | Alt text requirements documented |
| V. Performance | ✅ PASS | Zero client-side bundle impact |
| VI. Minimal Dependencies | ✅ PASS | No new dependencies |
| XI. SEO Optimization | ✅ PASS | All constitution requirements addressed in data model |

**Post-Design Gate**: ✅ PASSED - Ready for Phase 2 task generation

---

## Planning Artifacts Summary

### Phase 0: Research (Complete)

- **[research.md](./research.md)**: SEO implementation patterns for TanStack Start
  - Current codebase analysis (existing SEO gaps identified)
  - TanStack Start `head()` function patterns
  - JSON-LD schema patterns (Person, Article, WebSite, SoftwareApplication)
  - Open Graph and Twitter Card best practices
  - Utility function design recommendations

### Phase 1: Design (Complete)

- **[data-model.md](./data-model.md)**: Meta tag and JSON-LD schemas
  - Site-level constants (`SITE_CONFIG`)
  - TypeScript interfaces for `PageMetaConfig`, `ArticleMetadata`
  - JSON-LD schemas: `PersonSchema`, `ArticleSchema`, `WebSiteSchema`, `CollectionPageSchema`, `GameSchema`
  - Page-specific meta configurations for all 9 routes
  - Migration notes with current route status

- **[quickstart.md](./quickstart.md)**: SEO validation checklist
  - Pre-flight checks
  - Automated Lighthouse validation commands
  - Manual validation procedures (Google Rich Results, social previews)
  - Semantic HTML validation scripts
  - Page-by-page checklists
  - Troubleshooting guide

### Phase 2: Task Generation (Pending)

Run `/speckit.tasks` to generate implementation tasks based on the completed design artifacts
