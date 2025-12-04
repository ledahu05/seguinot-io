# Implementation Plan: Portfolio Website

**Branch**: `001-portfolio-site` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-portfolio-site/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a professional portfolio website for Christophe Seguinot showcasing 12+ years of experience as a Senior Frontend Developer. The site will demonstrate high-end engineering skills through a React 19/TypeScript/TanStack Start application with static CV data, project screenshots, interactive timeline, tech stack grid, and dark/light mode toggle. **Resume data will be typed strictly with Zod schemas to demonstrate type safety, even for a static portfolio.**

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node.js 20+
**Primary Dependencies**: TanStack Start (full-stack framework), TanStack Router (file-based routing), Tailwind CSS v4, Shadcn UI, Framer Motion, Lucide React, Zod (schema validation)
**Storage**: Static JSON files (`data/formatted_seguinot_cv_portfolio.json`), static images (`data/images/`)
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web (Vercel deployment), responsive 320px-2560px
**Project Type**: Web SPA (Single Page Application with SSR via TanStack Start)
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms, Lighthouse 90+ mobile
**Constraints**: Initial JS bundle < 100KB gzipped, images lazy-loaded, Core Web Vitals targets
**Scale/Scope**: 1 page (scrollable sections), 12 projects, 28 screenshots, 7 skill categories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0 Gate)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Feature-based folder structure with FSD principles |
| II. Tech Stack | ✅ PASS | React 19, TypeScript strict, TanStack Start, Tailwind CSS |
| III. Testing First | ✅ PASS | Vitest + RTL for units, Playwright for E2E, >90% coverage target |
| IV. Accessibility | ✅ PASS | React Aria/Radix primitives via Shadcn, semantic HTML, WCAG 2.1 AA |
| V. Performance | ✅ PASS | Core Web Vitals targets defined, lazy loading, code splitting |
| VI. Minimal Dependencies | ✅ PASS | Radix-based Shadcn (headless), no heavy UI frameworks |
| VII. Swiss Style | ✅ PASS | Grid-based layout, high contrast, typography hierarchy |
| VIII. Micro-interactions | ✅ PASS | Framer Motion for subtle animations, respects reduced-motion |
| IX. Content-First | ✅ PASS | Real CV data from JSON, no Lorem Ipsum |
| X. Responsive Design | ✅ PASS | Mobile-first, 320px minimum, Tailwind responsive prefixes |

**Gate Status**: ✅ ALL GATES PASS - Proceeded to Phase 0

### Post-Design Check (Phase 1 Gate)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | `app/lib/schemas/` for Zod schemas, `app/lib/data/` for loaders, feature-based components |
| II. Tech Stack | ✅ PASS | Added Zod for runtime validation, all other stack confirmed |
| III. Testing First | ✅ PASS | Zod schemas are testable; data loader functions have clear test targets |
| IV. Accessibility | ✅ PASS | Screenshot schema enforces alt text; Dialog (lightbox) is Radix-based |
| V. Performance | ✅ PASS | Static data validated at build time; no runtime performance impact |
| VI. Minimal Dependencies | ✅ PASS | Zod is lightweight (~12KB gzipped), justified for type safety demonstration |
| VII. Swiss Style | ✅ PASS | Data model supports grid-based skill categories display |
| VIII. Micro-interactions | ✅ PASS | No changes to animation strategy |
| IX. Content-First | ✅ PASS | Zod validates real CV data structure; enforces data quality |
| X. Responsive Design | ✅ PASS | Data model agnostic to presentation; components handle responsiveness |

**Gate Status**: ✅ ALL GATES PASS - Ready for task generation

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A for static site
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── routes/
│   ├── __root.tsx           # Root layout with theme provider
│   └── index.tsx            # Main portfolio page
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── hero/                # Hero section components
│   ├── timeline/            # Experience timeline components
│   ├── skills/              # Tech stack grid components
│   ├── projects/            # Project case study components
│   ├── contact/             # Contact section components
│   └── shared/              # Shared components (theme toggle, lightbox)
├── lib/
│   ├── schemas/             # Zod schemas for CV data types
│   ├── data/                # Data loading and parsing with Zod validation
│   └── utils/               # Utility functions (cn, theme helpers)
├── hooks/
│   └── use-theme.ts         # Theme context hook
└── styles/
    └── globals.css          # Tailwind CSS global styles

data/
├── formatted_seguinot_cv_portfolio.json  # CV structured data
└── images/                               # Project screenshots (28 files)

tests/
├── unit/                    # Vitest unit tests
│   ├── components/
│   ├── lib/
│   └── hooks/
└── e2e/                     # Playwright E2E tests
    └── portfolio.spec.ts
```

**Structure Decision**: Single-project web structure using TanStack Start file-based routing. The `app/` directory follows TanStack Start conventions with `routes/` for pages and feature-based `components/` organization. Static data remains in `data/` at root level for build-time access.

## Complexity Tracking

> **No violations to justify** - All constitution principles are satisfied with the chosen architecture.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | - | - |
