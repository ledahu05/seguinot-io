# Implementation Plan: Portfolio Home - Quarto Game Showcase

**Branch**: `005-portfolio-home` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-portfolio-home/spec.md`

## Summary

Add a dedicated showcase section to the portfolio home page highlighting the Quarto game as a technical demonstration. The section will include a description, skill tags, a "Play Now" CTA linking to `/games/quarto`, and a GitHub repository link. It will be positioned prominently after the Hero section.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19
**Primary Dependencies**: TanStack Router, Framer Motion, Tailwind CSS, Lucide React icons
**Storage**: N/A (static content)
**Testing**: Vitest
**Target Platform**: Web (responsive: 320px - 1920px+)
**Project Type**: Web application (existing portfolio site)
**Performance Goals**: LCP < 2.5s, section loads < 1s, 60fps animations
**Constraints**: Mobile-first responsive, WCAG 2.1 AA accessibility
**Scale/Scope**: Single new section component added to home page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Clean Architecture | ✅ PASS | New component in `app/components/quarto-showcase/` |
| II. Tech Stack | ✅ PASS | React 19, TypeScript, Tailwind CSS, Framer Motion |
| III. Testing First | ✅ PASS | Unit tests for component logic |
| IV. Accessibility | ✅ PASS | Semantic HTML, ARIA labels, focus states |
| V. Performance | ✅ PASS | No heavy assets, simple CSS animations |
| VI. Minimal Dependencies | ✅ PASS | Uses existing dependencies only |
| VII. Swiss Style | ✅ PASS | Grid-based, clear typography, high contrast |
| VIII. Micro-interactions | ✅ PASS | Framer Motion for entry animation |
| IX. Content-First | ✅ PASS | Real content, no Lorem Ipsum |
| X. Responsive Design | ✅ PASS | Mobile-first with Tailwind breakpoints |

**Gate Status**: ✅ PASSED - No violations

## Project Structure

### Documentation (this feature)

```text
specs/005-portfolio-home/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── components/
│   └── quarto-showcase/
│       ├── QuartoShowcase.tsx      # Main section component
│       ├── QuartoDescription.tsx   # Description text
│       ├── SkillTags.tsx           # Technology/skill badges
│       └── index.ts                # Barrel export
├── routes/
│   └── index.tsx                   # Home page (add QuartoShowcase)
└── lib/
    └── constants/
        └── quarto-showcase.ts      # Showcase content data
```

**Structure Decision**: Follows existing component organization pattern (e.g., `hero/`, `projects/`). The QuartoShowcase section is placed in its own directory under `app/components/`.

## Complexity Tracking

> No complexity violations. Feature uses existing patterns and dependencies.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
