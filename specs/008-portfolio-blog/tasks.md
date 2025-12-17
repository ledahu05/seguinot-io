# Tasks: Write Blog Article - Building the Portfolio Blog Feature

**Input**: Design documents from `/specs/008-portfolio-blog/` + implemented codebase
**Purpose**: Create a comprehensive technical blog article documenting the blog feature from conception to implementation

**Article Goal**: Document the complete journey of building the blog feature, including technical decisions, implementation details, bugs encountered and fixed, and configuration options.

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different sections, no dependencies)

---

## Phase 1: Research & Gather Source Material

**Purpose**: Collect all documentation and code references needed for the article

- [x] T001 Review `/specs/008-portfolio-blog/spec.md` for user stories and requirements
- [x] T002 [P] Review `/specs/008-portfolio-blog/plan.md` for architecture and tech decisions
- [x] T003 [P] Review `/specs/008-portfolio-blog/research.md` for library selection rationale
- [x] T004 [P] Review `/specs/008-portfolio-blog/data-model.md` for schema design
- [x] T005 [P] Review conversation history for bugs fixed (SSR issues, styling, Shiki)
- [x] T006 Create detailed article outline covering all sections

**Checkpoint**: Complete understanding of feature scope, decisions, and bugs

---

## Phase 2: Write Introduction & Context

**Purpose**: Set the stage for the technical deep dive

- [x] T007 Create article file with frontmatter in `data/blog/building-the-blog-feature.md`
- [x] T008 Write introduction section:
  - Motivation: Portfolio site needed blog for thought leadership
  - Key constraint: Git-based publishing workflow (no CMS)
  - Design goal: Match existing portfolio aesthetic
- [x] T009 Write "Requirements Overview" section:
  - Summarize 5 user stories from spec.md
  - P1: Browse articles, Read articles
  - P2: Publish via git, Navigation integration
  - P3: Tag filtering

---

## Phase 3: Write Technical Architecture

**Purpose**: Document the technology choices and system design

- [x] T010 Write "Technology Stack" section covering:
  - TanStack Start/Router (why: file-based routing, SSR support)
  - unified/remark/rehype (why: modular, build-time processing)
  - Shiki (why: VS Code-quality syntax highlighting)
  - gray-matter (why: industry-standard frontmatter parsing)
  - Zod (why: runtime type validation)
- [x] T011 Write "Processing Pipeline" section:
  - Diagram: `.md` → gray-matter → remark → rehype → Shiki → HTML
  - Why build-time processing (performance, SEO)
  - Reference research.md decisions
- [x] T012 Write "Data Model" section:
  - BlogPost, BlogPostPreview, BlogIndex schemas
  - Frontmatter validation rules
  - File naming → URL slug convention

---

## Phase 4: Write Implementation Details

**Purpose**: Show the actual code patterns with explanations

- [x] T013 Write "Project Structure" section:
  - File tree showing all blog-related files
  - Explain organization following FSD patterns
- [x] T014 Write "Blog Loader" section (`app/lib/data/blog-loader.ts`):
  - File globbing from `data/blog/`
  - Frontmatter extraction with gray-matter
  - Markdown processing pipeline code snippet
  - Caching strategy explanation
- [x] T015 Write "Server Functions" section (`app/lib/server/blog.server.ts`):
  - Why server functions were needed (Node.js APIs: fs, path)
  - The `createServerFn().handler()` pattern
  - Dynamic imports for server-only code
- [x] T016 Write "Routing" section:
  - `/blog` listing route with tag filtering via search params
  - `/blog/$slug` dynamic route
  - SEO implementation with `head()` function
- [x] T017 Write "Styling" section:
  - Tailwind Typography plugin configuration
  - Custom prose styles in `globals.css`
  - Shiki dual-theme support (light/dark mode)

---

## Phase 5: Write Bugs & Solutions

**Purpose**: Document problems encountered and their fixes (high learning value)

- [x] T018 Write "Bug #1: Module Externalization" section:
  - Error message: "Module 'path' has been externalized for browser compatibility"
  - Root cause: Node.js APIs being bundled for client
  - Solution: Created `blog.server.ts` with server functions using dynamic imports
  - Code before/after showing the fix
- [x] T019 Write "Bug #2: Hydration Mismatch" section:
  - Error: "expected content-type header to be set" + SSR/client HTML differences
  - Root cause: Incorrect `createServerFn` API usage with `{ method: 'GET' }`
  - Solution: Use `.handler()` pattern without method config
  - Lesson learned: TanStack Start server function patterns
- [x] T020 Write "Bug #3: Blog Styling Issues" section covering multiple fixes:
  - **Links invisible**: Added `.prose a` with `text-primary` and underline
  - **Lists missing markers**: Added `list-disc` and `list-decimal` to prose styles
  - **Emoji shortcodes not converting**: Added `remark-emoji` plugin to pipeline
  - Code snippets showing each CSS fix
- [x] T021 Write "Bug #4: Shiki Span Backgrounds" section:
  - Problem: Individual token spans had background colors creating dark boxes
  - Root cause: CSS rule applying `background-color` to `.shiki span`
  - Solution: Made span backgrounds `transparent !important`, kept container bg
  - Screenshot reference or visual explanation

---

## Phase 6: Write Configuration & Usage Guide

**Purpose**: Help readers understand how to use and extend the blog

- [x] T022 Write "Adding a New Article" section:
  - Step-by-step: create file, add frontmatter, write content, commit, deploy
  - Frontmatter template with required vs optional fields
  - File naming rules (lowercase, hyphens, becomes URL slug)
- [x] T023 Write "Customization Options" section:
  - Adding new syntax highlighting languages to Shiki
  - Modifying prose styles in `globals.css`
  - Extending frontmatter schema for new fields
  - Changing tag filtering behavior
- [x] T024 Write "Supported Markdown Features" section:
  - GFM: tables, task lists, strikethrough
  - Code blocks with syntax highlighting (languages list)
  - Emoji shortcodes (`:rocket:` → 🚀)
  - Auto-generated heading anchors

---

## Phase 7: Write Conclusion & Polish

**Purpose**: Wrap up the article and ensure quality

- [x] T025 Write "Key Takeaways" section:
  - Build-time processing benefits (performance, SEO, simplicity)
  - Server/client boundary management in TanStack Start
  - CSS specificity challenges with third-party themes
  - Importance of thorough testing across themes
- [x] T026 Write "Future Improvements" section (optional ideas):
  - RSS feed generation
  - Full-text search
  - Related posts suggestions
  - View counter with simple analytics
- [x] T027 Final review and proofreading
- [x] T028 Add code snippets and verify syntax highlighting works
- [x] T029 Verify all internal links and file path references are correct
- [x] T030 Test article renders correctly on both light and dark themes

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Research (no dependencies)
    ↓
Phase 2: Introduction (depends on T006 outline)
    ↓
    ├─→ Phase 3: Architecture (parallel with 4-6)
    ├─→ Phase 4: Implementation (parallel with 3, 5-6)
    ├─→ Phase 5: Bugs & Fixes (parallel with 3-4, 6)
    └─→ Phase 6: Configuration (parallel with 3-5)
            ↓
        Phase 7: Conclusion & Polish
```

### Parallel Writing Opportunities

After outline (T006) is complete:
- T010, T011, T012 (Architecture) - can write in parallel
- T013-T017 (Implementation) - can write in parallel
- T018-T021 (Bugs) - can write in parallel
- T022-T024 (Configuration) - can write in parallel

---

## Article Metadata

**Target file**: `data/blog/building-the-blog-feature.md`

**Frontmatter**:
```yaml
---
title: "Building a Git-Based Blog with TanStack Start"
date: "2025-12-17"
summary: "A deep dive into building a markdown-powered blog section for a portfolio, covering technical decisions, implementation patterns, and bugs fixed along the way."
tags:
  - react
  - tanstack
  - markdown
  - technical
  - portfolio
author: "Christophe Seguinot"
---
```

**Estimated length**: 3000-4000 words (15-20 min read)

---

## Source Material Reference

| Document | Location | Content |
|----------|----------|---------|
| Feature Spec | `specs/008-portfolio-blog/spec.md` | User stories, requirements |
| Implementation Plan | `specs/008-portfolio-blog/plan.md` | Architecture, tech stack |
| Research | `specs/008-portfolio-blog/research.md` | Library comparisons, decisions |
| Data Model | `specs/008-portfolio-blog/data-model.md` | Schemas, validation rules |
| Blog Loader | `app/lib/data/blog-loader.ts` | Markdown processing code |
| Server Functions | `app/lib/server/blog.server.ts` | Server-side data fetching |
| Routes | `app/routes/blog/*.tsx` | Listing and article pages |
| Styles | `app/styles/globals.css` | Prose and Shiki styling |

---

## Task Summary

| Phase | Description | Tasks | Parallel |
|-------|-------------|-------|----------|
| 1 | Research & Gather Material | 6 | 4 |
| 2 | Introduction & Context | 3 | 0 |
| 3 | Technical Architecture | 3 | 0 |
| 4 | Implementation Details | 5 | 0 |
| 5 | Bugs & Solutions | 4 | 4 |
| 6 | Configuration & Usage | 3 | 3 |
| 7 | Conclusion & Polish | 6 | 3 |
| **Total** | | **30** | **14** |

---

## Writing Guidelines

- Include actual code snippets from the implementation (not pseudocode)
- Reference specific file paths for credibility
- Explain the "why" behind decisions, not just the "what"
- Bugs section adds real-world learning value - be detailed here
- Target audience: intermediate React developers familiar with modern tooling
- Use consistent terminology matching the spec and plan documents
- Include before/after code for bug fixes where helpful
