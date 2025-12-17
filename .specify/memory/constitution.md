<!--
SYNC IMPACT REPORT
==================
Version Change: 1.2.0 → 1.3.0
Modified Principles: None
Added Sections:
  - XI. SEO Optimization (new mandatory principle)
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

Use React 19, TypeScript, TanStack Start, and Tailwind CSS. State management via Redux Toolkit (RTK) only when necessary. Real-time multiplayer via PartyKit.

- React 19 with functional components and hooks MUST be used
- TypeScript strict mode MUST be enabled
- TanStack Start MUST be used as the full-stack framework (routing, SSR, data fetching)
- TanStack Router file-based routing conventions MUST be followed
- Tailwind CSS MUST be used for styling
- RTK MUST only be introduced when local state or context is insufficient
- PartyKit MUST be used for real-time WebSocket multiplayer features
- PartyKit server code MUST be in a separate `/party` directory at project root
- `partysocket` client library MUST be used for WebSocket connections to PartyKit

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

### XI. SEO Optimization (MANDATORY)

Search engine optimization is mandatory for all public-facing pages. Every feature MUST be implemented with SEO best practices.

**Meta Tags & Structure:**
- Every page MUST have a unique, descriptive `<title>` tag (50-60 characters)
- Every page MUST have a unique `<meta name="description">` tag (150-160 characters)
- Heading hierarchy MUST be semantic (single h1 per page, logical h2-h6 nesting)
- URLs MUST be clean, readable, and include relevant keywords (no query strings for content pages)

**Open Graph & Social:**
- All public pages MUST include Open Graph meta tags (og:title, og:description, og:type, og:url)
- Article pages MUST include article-specific OG tags (article:published_time, article:author, article:tag)
- og:image MUST be provided for social sharing previews where applicable

**Technical SEO:**
- TanStack Start's `head()` function MUST be used for dynamic meta tags
- Server-side rendering (SSR) MUST be used for content pages to ensure crawlability
- Canonical URLs MUST be specified to prevent duplicate content issues
- Structured data (JSON-LD) SHOULD be implemented for rich search results (articles, person, organization)

**Content SEO:**
- Images MUST have descriptive alt text for accessibility and SEO
- Internal linking MUST be used to establish content relationships
- Page load speed MUST meet Core Web Vitals (cross-reference Principle V)
- Content MUST be crawlable (no critical content behind JavaScript-only rendering)

**Validation:**
- SEO implementation MUST be verified using Lighthouse SEO audit (score 90+)
- New pages MUST pass SEO checklist review before deployment

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

**Version**: 1.3.0 | **Ratified**: 2025-12-03 | **Last Amended**: 2025-12-17
