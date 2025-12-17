# Research: Portfolio Blog Section

**Feature**: 008-portfolio-blog
**Date**: 2025-12-15
**Status**: Complete

## Research Areas

1. Markdown processing for React/TanStack Start
2. Syntax highlighting solutions
3. Frontmatter parsing
4. Build-time vs runtime processing
5. SEO considerations for blog pages

---

## 1. Markdown Processing Library

### Decision: **unified + remark + rehype ecosystem**

### Rationale
- Industry standard for static site markdown processing
- Highly modular - include only needed plugins
- Excellent TypeScript support
- Active maintenance and large community
- Works seamlessly with build-time processing

### Alternatives Considered

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **unified/remark/rehype** | Modular, extensible, TypeScript support, GFM support | Multiple packages to install | ✅ Selected |
| **marked** | Simple, fast, single package | Less extensible, no plugin ecosystem | ❌ Rejected |
| **markdown-it** | Fast, plugins available | Weaker TypeScript support | ❌ Rejected |
| **MDX** | JSX in markdown | Overkill for static blog, adds complexity | ❌ Rejected |

### Required Packages
```json
{
  "unified": "^11.0.0",
  "remark-parse": "^11.0.0",
  "remark-gfm": "^4.0.0",
  "remark-rehype": "^11.0.0",
  "rehype-stringify": "^10.0.0",
  "rehype-slug": "^6.0.0",
  "rehype-autolink-headings": "^7.0.0"
}
```

**Estimated bundle impact**: ~25KB gzipped (build-time only, not shipped to client)

---

## 2. Syntax Highlighting

### Decision: **Shiki**

### Rationale
- VS Code-quality syntax highlighting
- CSS-based output (no runtime JS needed)
- Supports 100+ languages
- Tree-shakeable - only load languages used
- Better performance than Prism.js for many languages
- Native TypeScript support

### Alternatives Considered

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **Shiki** | VS Code themes, CSS output, fast | Initial setup complexity | ✅ Selected |
| **Prism.js** | Popular, many themes | Requires runtime JS, larger bundle | ❌ Rejected |
| **highlight.js** | Auto-detection | Larger bundle, runtime processing | ❌ Rejected |
| **rehype-pretty-code** | Shiki wrapper for rehype | Additional abstraction layer | ⚠️ Alternative |

### Implementation Strategy
- Process code blocks at build time
- Generate inline CSS with theme colors
- Lazy-load uncommon language grammars
- Use `shiki/bundle/web` for smaller bundle

### Required Packages
```json
{
  "shiki": "^1.0.0",
  "rehype-shiki": "^1.0.0"
}
```

**Languages to preload**: JavaScript, TypeScript, CSS, HTML, JSON, Bash, Python

---

## 3. Frontmatter Parsing

### Decision: **gray-matter**

### Rationale
- De facto standard for frontmatter parsing
- YAML frontmatter support (industry convention)
- Tiny bundle size (~3KB)
- Excellent TypeScript definitions
- Battle-tested in Gatsby, Next.js, Astro

### Alternatives Considered

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **gray-matter** | Standard, fast, tiny | None significant | ✅ Selected |
| **front-matter** | Simple | Less features | ❌ Rejected |
| **Custom regex** | No dependency | Error-prone, maintenance burden | ❌ Rejected |

### Required Package
```json
{
  "gray-matter": "^4.0.3"
}
```

### Frontmatter Schema
```yaml
---
title: "Article Title"           # Required
date: "2025-12-15"               # Required (ISO 8601)
summary: "Brief description..."   # Required (max 160 chars for SEO)
tags:                            # Optional
  - react
  - typescript
featuredImage: "/blog/images/..." # Optional
author: "Chris Séguinot"         # Optional (defaults to profile.name)
---
```

---

## 4. Build-Time vs Runtime Processing

### Decision: **Build-time processing via TanStack Start loader**

### Rationale
- Zero runtime overhead for users
- SEO-friendly (HTML ready at request time)
- Faster page loads
- Consistent with portfolio's static-first approach
- TanStack Start's `loader` function perfect for this pattern

### Implementation Pattern

```typescript
// app/routes/blog/$slug.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getBlogPostBySlug } from '@/lib/data/blog-loader'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug(params.slug)
    if (!post) throw new Error('Post not found')
    return { post }
  },
  component: BlogArticlePage,
})
```

### Content Processing Pipeline

```
Build Time:
1. Glob /data/blog/*.md files
2. Parse frontmatter (gray-matter)
3. Validate with Zod schema
4. Convert markdown to HTML (remark → rehype)
5. Apply syntax highlighting (shiki)
6. Cache processed content

Request Time:
1. Route loader fetches from cache
2. Return pre-processed HTML
3. Render in React component
```

---

## 5. SEO Considerations

### Decision: **TanStack Start head() function + structured data**

### Rationale
- Native SSR support in TanStack Start
- Dynamic meta tags per article
- Open Graph support for social sharing
- JSON-LD for structured data

### Implementation

```typescript
// app/routes/blog/$slug.tsx
export const Route = createFileRoute('/blog/$slug')({
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.post.title} | Chris Séguinot Blog` },
      { name: 'description', content: loaderData.post.summary },
      { property: 'og:title', content: loaderData.post.title },
      { property: 'og:description', content: loaderData.post.summary },
      { property: 'og:type', content: 'article' },
      { property: 'article:published_time', content: loaderData.post.date },
    ],
  }),
  // ...
})
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "datePublished": "2025-12-15",
  "author": {
    "@type": "Person",
    "name": "Chris Séguinot"
  }
}
```

---

## 6. Typography & Prose Styling

### Decision: **@tailwindcss/typography plugin**

### Rationale
- Native Tailwind integration
- Prose classes for article content
- Customizable via theme
- Handles all HTML elements (h1-h6, p, ul, ol, blockquote, code, pre, etc.)
- Dark mode support built-in

### Required Package
```json
{
  "@tailwindcss/typography": "^0.5.0"
}
```

### Usage
```tsx
<article className="prose prose-invert lg:prose-lg max-w-none">
  <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
</article>
```

### Custom Prose Configuration
Extend in `tailwind.config.ts` to match portfolio design tokens:
- Heading colors: `--blog-prose-headings`
- Body text: `--blog-prose-body`
- Code background: `--blog-prose-code-bg`
- Link colors: Inherit from `--primary`

---

## 7. Image Handling in Blog Posts

### Decision: **Relative paths + existing ImageWithFallback component**

### Rationale
- Consistent with existing portfolio image handling
- Fallback support for missing images
- Lazy loading built-in
- WebP/AVIF support via existing patterns

### Image Path Convention
```markdown
![Alt text](/blog/images/article-slug/image-name.webp)
```

### Storage Structure
```
data/
└── blog/
    ├── my-first-post.md
    └── images/
        └── my-first-post/
            ├── hero.webp
            └── diagram.webp
```

---

## 8. Navigation Integration

### Decision: **Add blog link to homepage Hero section**

### Rationale
- Consistent with existing CTA button pattern
- Visible without adding a navbar
- Non-intrusive to current design
- Can be enhanced later with dedicated navigation

### Implementation
Add "Read Blog" link to `CTAButtons.tsx`:
```tsx
<Link to="/blog" className={buttonVariants({ variant: 'outline' })}>
  Read Blog
</Link>
```

---

## Summary of Decisions

| Area | Decision | Package(s) |
|------|----------|------------|
| Markdown parsing | unified ecosystem | unified, remark-parse, remark-gfm, remark-rehype, rehype-stringify |
| Syntax highlighting | Shiki | shiki, rehype-shiki |
| Frontmatter | gray-matter | gray-matter |
| Processing time | Build-time | (TanStack Start loaders) |
| Typography | Tailwind Typography | @tailwindcss/typography |
| SEO | TanStack head() | (built-in) |

### Total New Dependencies: 9 packages
### Estimated Bundle Impact: Minimal (build-time processing)

---

## Resolved Clarifications

All technical unknowns from the Technical Context have been resolved:

1. ✅ **Markdown library choice** → unified/remark/rehype
2. ✅ **Syntax highlighting** → Shiki (build-time CSS)
3. ✅ **Frontmatter parsing** → gray-matter
4. ✅ **Processing strategy** → Build-time via TanStack loaders
5. ✅ **SEO approach** → TanStack head() + JSON-LD
6. ✅ **Typography** → @tailwindcss/typography
7. ✅ **Image handling** → Relative paths + existing components
