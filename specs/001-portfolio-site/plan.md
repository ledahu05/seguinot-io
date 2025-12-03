# Implementation Plan: seguinot-io Portfolio Website

**Branch**: `001-portfolio-site` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-portfolio-site/spec.md`

## Summary

Build a Senior Frontend Developer portfolio website (seguinot-io) showcasing 12 projects with 28 screenshots, featuring an interactive experience timeline, tech stack grid (bento-box style), project case studies, and dark/light mode toggle. Content sourced from static JSON data files. Built with TanStack Start, React 19, Tailwind CSS v4, shadcn/ui, and Framer Motion for whimsical animations.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node.js 20+
**Framework**: TanStack Start (full-stack React framework with SSR)
**Routing**: TanStack Router (file-based routing)
**Primary Dependencies**:
- TanStack Start / TanStack Router
- Tailwind CSS v4
- shadcn/ui (Radix-based component primitives)
- Framer Motion (animations)
- Lucide React (icons)

**Storage**: Static JSON files (`data/formatted_seguinot_cv_portfolio.json`), static images (`data/images/`)
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web (Vercel deployment), SSR-enabled
**Project Type**: Single web application (SPA with SSR)
**Performance Goals**:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- INP < 200ms
- Lighthouse 90+ mobile
- Initial JS bundle < 100KB gzipped

**Constraints**:
- Mobile-first responsive design (320px - 2560px)
- WCAG 2.1 AA accessibility compliance
- No backend API (static data)
- Dark mode default with theme persistence

**Scale/Scope**: Single-page portfolio, 12 projects, 28 images, 7 skill categories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. Clean Architecture | ✅ PASS | Feature-based folder structure with components/, features/, hooks/ |
| II. Tech Stack | ✅ PASS | React 19, TypeScript, TanStack Start, Tailwind CSS |
| III. Testing First | ✅ PASS | Vitest + RTL for unit tests, Playwright for E2E |
| IV. Accessibility | ✅ PASS | shadcn/ui (Radix-based), semantic HTML, WCAG 2.1 AA |
| V. Performance | ✅ PASS | SSR, lazy loading, image optimization, < 100KB bundle |
| VI. Minimal Dependencies | ✅ PASS | shadcn/ui (headless), no heavy UI frameworks |
| VII. Swiss Style | ✅ PASS | Grid-based layout, typography hierarchy, high contrast |
| VIII. Micro-interactions | ✅ PASS | Framer Motion for animations, reduced-motion support |
| IX. Content-First | ✅ PASS | CV data from JSON, no Lorem Ipsum |
| X. Responsive Design | ✅ PASS | Mobile-first, Tailwind responsive prefixes |

**All gates passed. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── routes/
│   ├── __root.tsx           # Root layout with theme provider
│   └── index.tsx            # Home page (single-page sections)
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx       # For image lightbox
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Section.tsx
│   ├── hero/
│   │   └── Hero.tsx
│   ├── timeline/
│   │   ├── Timeline.tsx
│   │   ├── TimelineEntry.tsx
│   │   └── TimelineAnimation.tsx
│   ├── skills/
│   │   ├── SkillsGrid.tsx
│   │   └── SkillCategory.tsx
│   ├── projects/
│   │   ├── ProjectShowcase.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ImageLightbox.tsx
│   ├── contact/
│   │   └── Contact.tsx
│   └── theme/
│       ├── ThemeProvider.tsx
│       └── ThemeToggle.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useScrollTo.ts
│   └── useReducedMotion.ts
├── lib/
│   ├── cv-data.ts           # CV data loader and types
│   ├── screenshot-mapper.ts  # Map screenshots to projects
│   └── utils.ts             # cn() and utilities
└── styles/
    └── globals.css          # Tailwind imports, CSS variables

data/
├── formatted_seguinot_cv_portfolio.json
├── formatted_seguinot_cv.md
└── images/
    └── [28 project screenshots]

tests/
├── unit/
│   ├── components/
│   └── hooks/
└── e2e/
    └── portfolio.spec.ts
```

**Structure Decision**: TanStack Start file-based routing with feature-organized components. Single route (index) with section-based navigation using smooth scrolling.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
