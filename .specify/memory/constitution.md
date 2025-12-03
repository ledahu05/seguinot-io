<!--
SYNC IMPACT REPORT
==================
Version Change: 1.1.0 → 1.1.1
Modified Principles:
  - V. Performance: Expanded with additional performance requirements (bundle size limits,
    code splitting, font optimization, critical CSS, performance testing)
Added Sections: None
Removed Sections: None
Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ No updates needed (generic constitution check reference)
  - .specify/templates/spec-template.md: ✅ No updates needed (technology-agnostic)
  - .specify/templates/tasks-template.md: ✅ No updates needed (generic structure)
Follow-up TODOs: None
-->

# Portfolio 2025 Constitution

## Core Principles

### I. Clean Architecture

Follow SOLID principles. Use Feature-Sliced Design (FSD) or a clean modular folder structure (e.g., `features/`, `components/`, `hooks/`).

- Code MUST be organized by feature or domain, not by technical layer alone
- Dependencies MUST flow inward (UI → Business Logic → Data)
- Each module MUST have a single, well-defined responsibility
- Shared code MUST be explicitly extracted into dedicated directories

### II. Tech Stack

Use React 19, TypeScript, TanStack Start, and Tailwind CSS. State management via Redux Toolkit (RTK) only when necessary.

- React 19 with functional components and hooks MUST be used
- TypeScript strict mode MUST be enabled
- TanStack Start MUST be used as the full-stack framework (routing, SSR, data fetching)
- TanStack Router file-based routing conventions MUST be followed
- Tailwind CSS MUST be used for styling
- RTK MUST only be introduced when local state or context is insufficient

### III. Testing First

All logical components must have unit tests (Vitest). Aim for high coverage on utility functions.

- Vitest MUST be used as the testing framework
- Utility functions MUST have >90% test coverage
- Logical components (hooks, services) MUST have accompanying unit tests
- Tests MUST accurately reflect production code behavior

### IV. Accessibility

All components must be accessible (React Aria or equivalent) and semantic HTML.

- Components MUST meet WCAG 2.1 AA standards
- Semantic HTML elements MUST be used over generic divs
- React Aria or equivalent headless accessible primitives MUST be used
- Keyboard navigation MUST be fully supported
- ARIA labels MUST be provided where semantic HTML is insufficient

### V. Performance (CRITICAL)

Performance is a top priority. Optimize aggressively for Core Web Vitals, bundle size, and runtime efficiency.

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint) MUST be under 2.5 seconds
- FID (First Input Delay) MUST be under 100ms
- CLS (Cumulative Layout Shift) MUST be under 0.1
- INP (Interaction to Next Paint) MUST be under 200ms

**Bundle & Loading Optimization:**
- Initial JavaScript bundle MUST be under 100KB gzipped
- Non-critical routes MUST be lazy-loaded via TanStack Router lazy loading
- Code splitting MUST be used for feature-specific modules
- Tree shaking MUST be verified to eliminate dead code

**Asset Optimization:**
- Images MUST be optimized and use modern formats (WebP, AVIF)
- Images MUST use responsive srcset for different screen sizes
- Fonts MUST be subset and self-hosted with font-display: swap
- Critical CSS MUST be inlined for above-the-fold content

**Runtime Performance:**
- Components MUST avoid unnecessary re-renders (use React.memo, useMemo, useCallback appropriately)
- Heavy computations MUST be memoized or deferred
- Animations MUST run at 60fps (use transform/opacity, avoid layout thrashing)

**Performance Testing:**
- Lighthouse performance score MUST be 90+ on mobile
- Performance budgets MUST be enforced in CI/CD pipeline
- Bundle size changes MUST be tracked and reviewed in PRs

### VI. Minimal Dependencies

Do not install heavy UI libraries (like MUI) unless specified. Use Radix UI or headless primitives + Tailwind.

- Heavy UI frameworks (MUI, Chakra, Ant Design) MUST NOT be used unless explicitly approved
- Radix UI or similar headless component libraries SHOULD be preferred
- New dependencies MUST be justified by clear necessity
- Bundle size impact MUST be evaluated before adding dependencies

## Design & UX Principles

### VII. Swiss Style

High contrast, grid-based, excellent typography.

- Layouts MUST follow a consistent grid system
- Typography MUST use a clear hierarchy with limited font families
- Color contrast MUST meet accessibility standards (4.5:1 for normal text)
- Whitespace MUST be used deliberately to create visual hierarchy
- Design MUST prioritize clarity and readability over decoration

### VIII. Micro-interactions

Use Framer Motion for subtle entry animations and hover states.

- Framer Motion MUST be used for animations
- Entry animations MUST be subtle (< 300ms duration)
- Hover states MUST provide visual feedback
- Animations MUST respect user's reduced-motion preferences
- Motion MUST serve a functional purpose (guide attention, indicate state)

### IX. Content-First

The content (CV data) is the source of truth. Do not use Lorem Ipsum; use placeholders if real data is missing.

- CV data from the data directory MUST be the source of truth
- Lorem Ipsum MUST NOT be used anywhere in the application
- When real data is unavailable, descriptive placeholders MUST indicate what content belongs there
- Content structure MUST drive component design, not vice versa

### X. Responsive Design

Mobile-first approach is mandatory. All layouts MUST be designed for mobile screens first, then progressively enhanced for larger viewports.

- Mobile-first CSS approach MUST be used (min-width media queries, not max-width)
- All components MUST be fully functional on screens 320px and wider
- Touch targets MUST be at least 44x44 pixels on mobile
- Layouts MUST adapt gracefully across breakpoints (mobile, tablet, desktop)
- Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) MUST be used consistently
- Content MUST remain readable without horizontal scrolling on any device
- Navigation MUST be accessible and usable on touch devices

## Governance

This constitution supersedes all other development practices for this project. All implementation decisions MUST align with these principles.

### Amendment Procedure

1. Propose changes via documentation update
2. Justify the change with rationale
3. Update version according to semantic versioning:
   - MAJOR: Principle removal or backward-incompatible redefinition
   - MINOR: New principle added or material expansion
   - PATCH: Clarifications, typo fixes, non-semantic refinements
4. Update LAST_AMENDED_DATE to the amendment date
5. Propagate changes to dependent templates if needed

### Compliance Review

- All code reviews MUST verify compliance with these principles
- Violations MUST be justified in the Complexity Tracking section of the implementation plan
- Constitution checks are required gates in the planning phase

**Version**: 1.1.1 | **Ratified**: 2025-12-03 | **Last Amended**: 2025-12-03
