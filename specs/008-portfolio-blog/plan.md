# Implementation Plan: Portfolio Blog Section

**Branch**: `008-portfolio-blog` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-portfolio-blog/spec.md`

## Summary

Add a blog section to the portfolio that enables the author to publish articles via markdown files in the codebase. The blog will feature a listing page with article previews, individual article pages with rendered markdown and syntax-highlighted code blocks, and tag-based filtering. The implementation follows existing portfolio patterns: TanStack Router for routing, Zod for validation, Tailwind CSS + Framer Motion for styling/animations, and build-time content processing.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Node.js 20+
**Primary Dependencies**: TanStack Start/Router, Tailwind CSS v4, Framer Motion, Zod, unified/remark/rehype (markdown processing), shiki (syntax highlighting)
**Storage**: Static markdown files in `/data/blog/` directory (build-time processing)
**Testing**: Vitest (unit), Playwright (e2e)
**Target Platform**: Static web (Vercel/Netlify deployment)
**Project Type**: Web application (React SPA with SSR via TanStack Start)
**Performance Goals**: LCP < 2.5s, Lighthouse 90+ mobile, sub-100KB initial bundle contribution
**Constraints**: No runtime markdown processing (all at build time), no backend API, mobile-first responsive design
**Scale/Scope**: Initial launch with 5-10 articles, scalable to 100+ articles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Architecture | ✅ PASS | Blog feature organized in `app/components/blog/` and `app/lib/data/blog-loader.ts` following FSD patterns |
| II. Tech Stack | ✅ PASS | Uses React 19, TypeScript, TanStack Start, Tailwind CSS - no new frameworks required |
| III. Testing First | ✅ PASS | Unit tests for blog-loader, schema validation; e2e tests for blog navigation |
| IV. Accessibility | ✅ PASS | Semantic HTML for articles, ARIA labels, keyboard navigation, proper heading hierarchy |
| V. Performance | ✅ PASS | Build-time markdown processing, lazy-loaded routes, optimized images, syntax highlighting via CSS |
| VI. Minimal Dependencies | ⚠️ MONITOR | Adding unified/remark/rehype ecosystem for markdown - justified by static site necessity |
| VII. Swiss Style | ✅ PASS | Consistent typography hierarchy, grid layout, high contrast |
| VIII. Micro-interactions | ✅ PASS | Framer Motion entry animations, hover states on article cards |
| IX. Content-First | ✅ PASS | Markdown files drive the blog; no Lorem Ipsum |
| X. Responsive Design | ✅ PASS | Mobile-first with Tailwind responsive prefixes, 320px minimum support |

**Pre-Phase Gate**: ✅ PASSED (VI. Minimal Dependencies monitored but justified)

## Project Structure

### Documentation (this feature)

```text
specs/008-portfolio-blog/
├── plan.md              # This file
├── research.md          # Phase 0 output - markdown processing research
├── data-model.md        # Phase 1 output - blog article schema
├── quickstart.md        # Phase 1 output - setup guide
├── contracts/           # Phase 1 output - N/A (no API contracts for static site)
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── components/
│   └── blog/                     # New: Blog UI components
│       ├── BlogList.tsx          # Article listing grid
│       ├── BlogCard.tsx          # Article preview card
│       ├── BlogArticle.tsx       # Full article layout
│       ├── BlogHeader.tsx        # Article header (title, date, reading time)
│       ├── BlogContent.tsx       # Rendered markdown content
│       ├── TagBadge.tsx          # Clickable tag pill
│       ├── TagFilter.tsx         # Tag filter controls
│       └── EmptyState.tsx        # No articles message
├── lib/
│   ├── data/
│   │   └── blog-loader.ts        # New: Blog data loading & caching
│   ├── schemas/
│   │   └── blog.schema.ts        # New: Zod schema for blog articles
│   └── utils/
│       └── reading-time.ts       # New: Calculate reading time
├── routes/
│   └── blog/
│       ├── index.tsx             # /blog - Article listing page
│       └── $slug.tsx             # /blog/[slug] - Individual article page

data/
└── blog/                         # New: Markdown content directory
    ├── example-post.md           # Sample article (frontmatter + content)
    └── images/                   # Blog-specific images
        └── [article-images]/

tests/
├── unit/
│   └── blog/
│       ├── blog-loader.test.ts   # Data loading tests
│       ├── reading-time.test.ts  # Reading time calculation tests
│       └── blog.schema.test.ts   # Schema validation tests
└── e2e/
    └── blog.spec.ts              # Blog navigation e2e tests
```

**Structure Decision**: Following existing portfolio patterns - feature components in `app/components/blog/`, data utilities in `app/lib/`, routes in `app/routes/blog/`, static content in `data/blog/`. This mirrors the cv-loader.ts pattern and games/quarto route structure.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Adding unified/remark/rehype ecosystem | Markdown parsing at build time is essential for blog functionality | Manual regex parsing would be error-prone and miss edge cases; runtime parsing violates performance constraints |
| Adding shiki for syntax highlighting | Technical blog requires code block syntax highlighting | CSS-only highlighting insufficient for 30+ languages; Prism.js has larger bundle |

## Key Technical Decisions

### Markdown Processing Pipeline

**Build-time strategy**: Process markdown files at build time using TanStack Start's data loaders. This ensures:
- Zero runtime parsing overhead
- SEO-friendly static HTML
- Fast page loads

**Pipeline**:
```
.md files → gray-matter (frontmatter) → unified/remark (parse) → rehype (HTML) → shiki (syntax highlighting) → React components
```

### Data Loading Pattern

Follows existing `cv-loader.ts` pattern:
1. Glob markdown files from `/data/blog/`
2. Parse frontmatter with `gray-matter`
3. Validate with Zod schema
4. Cache parsed data
5. Export typed getter functions: `getBlogPosts()`, `getBlogPostBySlug()`

### Routing Strategy

TanStack Router file-based routing:
- `/blog` → `app/routes/blog/index.tsx` (listing)
- `/blog/[slug]` → `app/routes/blog/$slug.tsx` (article)

Tag filtering uses URL search params: `/blog?tag=react`

### Component Architecture

- **BlogList**: Renders grid of BlogCard components with Framer Motion stagger
- **BlogCard**: Clickable card with title, date, summary, tags, reading time
- **BlogArticle**: Full article layout with BlogHeader + BlogContent
- **BlogContent**: Renders processed HTML with Tailwind prose styling

## Design Tokens (Blog-specific)

Extends existing portfolio design system:

```css
/* Article typography (prose) */
--blog-prose-body: oklch(0.85 0 0);
--blog-prose-headings: oklch(0.985 0 0);
--blog-prose-code: oklch(0.708 0 0);
--blog-prose-code-bg: oklch(0.2 0 0);

/* Card styling */
--blog-card-bg: var(--card);
--blog-card-hover: var(--secondary);
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Markdown processing bundle size | Medium | Medium | Use selective imports, tree-shake unused plugins |
| Syntax highlighting performance | Low | High | Pre-compute at build time, lazy-load language grammars |
| Image optimization in articles | Medium | Medium | Use existing ImageWithFallback component, enforce WebP |
| SEO for blog pages | Low | Medium | Add meta tags via TanStack Start head() function |

---

## Post-Phase 1 Constitution Re-Check

*Re-evaluated after design phase completion.*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Clean Architecture | ✅ PASS | Data model follows FSD; blog-loader.ts mirrors cv-loader.ts pattern |
| II. Tech Stack | ✅ PASS | All new dependencies are standard React ecosystem tools |
| III. Testing First | ✅ PASS | Test strategy defined in quickstart.md |
| IV. Accessibility | ✅ PASS | Semantic article tags, heading hierarchy maintained in data model |
| V. Performance | ✅ PASS | Build-time processing confirmed; no runtime markdown parsing |
| VI. Minimal Dependencies | ✅ JUSTIFIED | 9 packages added - all essential for markdown blog; justified in research.md |
| VII. Swiss Style | ✅ PASS | Design tokens extend existing OKLCH system |
| VIII. Micro-interactions | ✅ PASS | Framer Motion patterns documented |
| IX. Content-First | ✅ PASS | Markdown files are source of truth |
| X. Responsive Design | ✅ PASS | Mobile-first prose styling planned |

**Post-Design Gate**: ✅ PASSED - Ready for Phase 2 task generation
