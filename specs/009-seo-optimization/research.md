# Research: SEO Implementation Patterns for TanStack Start

**Feature**: SEO Optimization for All Pages
**Date**: 2025-12-17
**Status**: Complete

## Executive Summary

This research documents SEO implementation patterns for the portfolio website using TanStack Start. The codebase already has partial SEO implementation in the blog routes that serves as a reference pattern. Key findings: TanStack Start's `head()` function provides the primary mechanism for dynamic meta tags, and JSON-LD structured data should be rendered inline in the head section.

## Current Implementation Analysis

### Existing SEO Patterns in Codebase

#### 1. Root Layout (`app/routes/__root.tsx`)

Current implementation provides basic default meta tags:

```typescript
head: () => ({
  meta: [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'Christophe Seguinot | Senior Frontend Developer' },
    { name: 'description', content: 'Senior Frontend Developer with 12+ years...' },
  ],
  // ... links and scripts
})
```

**Gap**: Missing Open Graph tags, Twitter Cards, and canonical URL at root level.

#### 2. Blog Article Route (`app/routes/blog/$slug.tsx`)

Best current SEO implementation - serves as reference pattern:

```typescript
head: ({ loaderData }) => ({
  meta: [
    { title: `${loaderData.title} | Christophe Seguinot` },
    { name: 'description', content: loaderData.summary },
    { property: 'og:title', content: loaderData.title },
    { property: 'og:description', content: loaderData.summary },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: loaderData.date },
    ...(loaderData.author ? [{ property: 'article:author', content: loaderData.author }] : []),
    ...(loaderData.tags.map(tag => ({ property: 'article:tag', content: tag }))),
  ],
})
```

**Gap**: Missing og:url, og:image, twitter:card, twitter:site, canonical URL, and JSON-LD structured data.

#### 3. Blog Listing Route (`app/routes/blog/index.tsx`)

Has basic Open Graph implementation:

```typescript
head: ({ loaderData }) => ({
  meta: [
    { title },
    { name: 'description', content: '...' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: '...' },
    { property: 'og:type', content: 'website' },
  ],
})
```

**Gap**: Missing og:url, og:image, twitter:card, and JSON-LD.

#### 4. Quarto Routes (all routes in `app/routes/games/quarto/`)

**No SEO implementation** - all routes missing head() function with meta tags.

### Pages Requiring SEO Implementation

| Route | Current Status | Priority |
|-------|---------------|----------|
| `/` (homepage) | Basic meta in root | High |
| `/blog` | Partial OG tags | Medium |
| `/blog/$slug` | Best implementation | Low (enhance) |
| `/games/quarto` | None | High |
| `/games/quarto/play` | None | Medium |
| `/games/quarto/online` | None | Medium |
| `/games/quarto/join` | None | Low |
| `/games/quarto/rules` | None | High |

## TanStack Start `head()` Function Patterns

### Basic Pattern

```typescript
export const Route = createFileRoute('/path')({
  head: () => ({
    meta: [
      { title: 'Page Title' },
      { name: 'description', content: 'Page description' },
    ],
  }),
  component: PageComponent,
})
```

### Dynamic Pattern with Loader Data

```typescript
export const Route = createFileRoute('/path/$param')({
  loader: async ({ params }) => fetchData(params),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? 'Fallback Title' },
      { name: 'description', content: loaderData?.description ?? 'Fallback' },
    ],
  }),
  component: PageComponent,
})
```

### Adding JSON-LD Scripts

TanStack Start supports inline scripts via the `scripts` property:

```typescript
head: ({ loaderData }) => ({
  meta: [...],
  scripts: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: loaderData.title,
        // ... other properties
      }),
    },
  ],
})
```

## JSON-LD Schema Patterns

### Person Schema (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Christophe Seguinot",
  "jobTitle": "Senior Frontend Developer",
  "url": "https://seguinot.io",
  "sameAs": [
    "https://linkedin.com/in/christophe-seguinot",
    "https://github.com/ledahu05"
  ],
  "knowsAbout": ["React", "TypeScript", "Frontend Development"]
}
```

### Article Schema (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article summary",
  "datePublished": "2025-12-17",
  "author": {
    "@type": "Person",
    "name": "Christophe Seguinot"
  },
  "publisher": {
    "@type": "Person",
    "name": "Christophe Seguinot"
  }
}
```

### WebSite Schema (Site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Christophe Seguinot Portfolio",
  "url": "https://seguinot.io",
  "description": "Portfolio of Christophe Seguinot, Senior Frontend Developer"
}
```

### SoftwareApplication Schema (Quarto Game)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Quarto",
  "applicationCategory": "GameApplication",
  "description": "Strategic board game of shared attributes",
  "operatingSystem": "Web Browser"
}
```

## Open Graph Best Practices

### Required Tags (All Pages)

```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:type" content="website|article">
<meta property="og:url" content="https://seguinot.io/page">
<meta property="og:image" content="https://seguinot.io/images/og/default.png">
```

### Article-Specific Tags

```html
<meta property="article:published_time" content="2025-12-17">
<meta property="article:author" content="Christophe Seguinot">
<meta property="article:tag" content="react">
```

### Image Requirements

- **Dimensions**: 1200x630 pixels (recommended)
- **Format**: PNG or JPG
- **File size**: Under 1MB
- **Location**: Accessible public URL (absolute path required)

## Twitter Card Implementation

### Summary with Large Image (Recommended)

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://seguinot.io/images/og/default.png">
```

## Canonical URL Strategy

```html
<link rel="canonical" href="https://seguinot.io/current-page">
```

### Rules:
- Always use absolute URLs
- Use HTTPS protocol
- Exclude query parameters for content pages
- Match the canonical URL to the page being served

## Utility Function Design

### Proposed Structure (`app/lib/seo/`)

```
app/lib/seo/
├── meta.ts              # Meta tag generation utilities
├── structured-data.ts   # JSON-LD schema generators
└── constants.ts         # Default values, site info
```

### Meta Tag Generator Function

```typescript
// app/lib/seo/meta.ts
interface PageMetaConfig {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
  article?: {
    publishedTime: string;
    author: string;
    tags: string[];
  };
}

export function generatePageMeta(config: PageMetaConfig) {
  const { title, description, url, type = 'website', image, article } = config;

  const meta = [
    { title: `${title} | Christophe Seguinot` },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image ?? DEFAULT_OG_IMAGE },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image ?? DEFAULT_OG_IMAGE },
  ];

  if (article) {
    meta.push(
      { property: 'article:published_time', content: article.publishedTime },
      { property: 'article:author', content: article.author },
      ...article.tags.map(tag => ({ property: 'article:tag', content: tag })),
    );
  }

  return meta;
}
```

## Validation Tools

### Lighthouse SEO Audit
- Run: `npx lighthouse <url> --only-categories=seo`
- Target score: 90+

### Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Validates JSON-LD structured data

### Social Preview Debuggers
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

## Recommendations

### Implementation Order

1. **Create SEO utility library** (`app/lib/seo/`)
   - `constants.ts` - Site metadata, default values
   - `meta.ts` - Meta tag generation functions
   - `structured-data.ts` - JSON-LD generators

2. **Update root layout** - Add default OG/Twitter tags

3. **Enhance homepage** - Add Person JSON-LD, complete OG tags

4. **Enhance blog pages** - Add Article JSON-LD, complete meta

5. **Add Quarto page SEO** - All 5 routes need full implementation

6. **Create default OG image** - 1200x630 PNG

### Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Duplicate meta tags | Use TanStack's head() which properly merges/overrides |
| Invalid JSON-LD | Test with Google Rich Results Test before deployment |
| Missing OG images | Create default fallback image |
| URL mismatches | Generate canonical URLs from route params |

## References

- [TanStack Start Head Documentation](https://tanstack.com/start/latest/docs/framework/react/start/document-head)
- [Schema.org - Person](https://schema.org/Person)
- [Schema.org - Article](https://schema.org/Article)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
