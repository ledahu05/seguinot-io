---
title: "Implementing SEO Optimization for a TanStack Start Portfolio"
date: "2025-12-17"
summary: "A comprehensive guide to adding SEO features to a React portfolio, covering meta tags, Open Graph, JSON-LD structured data, and validation strategies."
tags:
  - seo
  - tanstack
  - react
  - typescript
  - technical
author: "Christophe Seguinot"
---

# Implementing SEO Optimization for a TanStack Start Portfolio

Having a beautiful portfolio is meaningless if no one can find it. When I realized my portfolio had zero SEO optimization, I decided to tackle it systematically. This article documents the complete implementation of SEO features for a TanStack Start application, from initial requirements to production validation.

The approach I took was to build a reusable SEO utility library that centralizes all meta tag and structured data generation, making it easy to add SEO to new pages while maintaining consistency across the site.

---

## Why SEO Matters for a Portfolio

For developers, a portfolio serves multiple purposes:

1. **Professional visibility**: Recruiters and potential clients search for developers by name or skills
2. **Content discovery**: Blog articles should appear in search results for relevant topics
3. **Social credibility**: When sharing links, attractive previews significantly increase click-through rates
4. **Project showcase**: Game projects and demos should be discoverable and look professional when shared

Without proper SEO, search engines struggle to understand your content, social shares display generic previews, and your carefully crafted work remains invisible.

---

## Requirements Overview

I identified four user stories, prioritized by business impact:

**P1 - Critical (Must Have):**

1. **Search Engine Discoverability**: Every page needs unique titles, descriptions, semantic HTML, and proper meta tags. Target: Lighthouse SEO score 90+ on all pages.

2. **Social Media Sharing**: When links are shared on LinkedIn, Twitter, or Facebook, they should display attractive preview cards with correct titles, descriptions, and images.

**P2 - Important (Should Have):**

3. **Rich Search Results**: JSON-LD structured data enables enhanced search results (author cards, article metadata, breadcrumbs).

**P3 - Nice to Have:**

4. **Internal Linking**: All public pages reachable within 3 clicks from homepage (already satisfied by existing navigation).

### Pages to Optimize

The portfolio has 9 routes to consider:

| Page | Route | Indexable? |
|------|-------|------------|
| Homepage | `/` | Yes |
| Blog Listing | `/blog` | Yes |
| Blog Article | `/blog/$slug` | Yes |
| Quarto Hub | `/games/quarto` | Yes |
| Quarto Rules | `/games/quarto/rules` | Yes |
| Quarto Play | `/games/quarto/play` | No (game session) |
| Quarto Online | `/games/quarto/online` | No (game session) |
| Quarto Join | `/games/quarto/join` | No (temporary) |

Game session pages use `noIndex` since they contain dynamic, user-specific content that shouldn't pollute search results.

---

## Technology Stack

### TanStack Start's `head()` Function

TanStack Start provides a `head()` function in route definitions for managing meta tags. The key insight is that it receives loader data, enabling dynamic meta tags based on page content:

```typescript
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await serverGetBlogPost({ slug: params.slug })
    return post
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.title} | Site Name` },
      { name: 'description', content: loaderData.summary },
      { property: 'og:title', content: loaderData.title },
    ],
  }),
})
```

### Open Graph & Twitter Cards

Open Graph (Facebook/LinkedIn) and Twitter Cards use meta tags to control social previews:

```html
<!-- Open Graph -->
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="https://site.com/images/og/page.png" />
<meta property="og:url" content="https://site.com/page" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://site.com/images/og/page.png" />
```

**Critical**: Image URLs must be absolute (starting with `https://`). Relative paths won't work.

### JSON-LD Structured Data

Schema.org structured data helps search engines understand content semantically:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Developer Name",
  "jobTitle": "Senior Frontend Developer",
  "url": "https://site.com"
}
</script>
```

I implemented four schema types:
- **Person**: Homepage (portfolio owner information)
- **WebSite**: Homepage (site-wide metadata)
- **Article**: Blog posts (headline, author, date, keywords)
- **CollectionPage**: Blog listing (article index)
- **SoftwareApplication**: Quarto game hub (game metadata)

---

## Creating the Default OG Image

For social sharing to work well, you need a default Open Graph image (1200x630 pixels) that represents your site. I used a detailed prompt describing the desired style:

```
Create a professional Open Graph social sharing image for a software developer portfolio.
- Dimensions: 1200 x 630 pixels
- Style: Clean, minimal, modern Swiss design aesthetic
- Background: Dark gradient (slate-900 to slate-800)
- Content: Name prominently displayed, title below, subtle code bracket decorations
- Typography: Clean sans-serif (Inter), high contrast for readability
```

I fed this prompt to **Banano Pro**, which generated an SVG with:
- Dark gradient background matching the portfolio's color scheme
- Name and title with proper typography hierarchy
- Subtle geometric elements (circles, grid pattern, code bracket)
- An animated cursor effect (which gets frozen in the PNG export)

**Important**: Social media platforms don't reliably render SVG images. Facebook, LinkedIn, and Twitter all expect PNG or JPEG formats. I converted the SVG to PNG using [CloudConvert](https://cloudconvert.com/svg-to-png), which preserved the quality at the correct 1200x630 dimensions.

The final image lives at `data/images/og/default.png` and is referenced in the SEO configuration.

---

## The SEO Utility Library

Rather than scatter SEO logic across route files, I created a centralized utility library at `app/lib/seo/`:

```
app/lib/seo/
├── constants.ts      # Site configuration
├── types.ts          # TypeScript interfaces
├── meta.ts           # Meta tag generators
├── structured-data.ts # JSON-LD generators
└── index.ts          # Barrel export
```

### Central Configuration (`constants.ts`)

All site metadata lives in one place:

```typescript
export const SITE_CONFIG = {
  name: 'Christophe Seguinot',
  title: 'Christophe Seguinot | Senior Frontend Developer',
  description: 'Senior Frontend Developer with 12+ years of experience...',
  url: 'https://seguinot.io',
  locale: 'en_US',
  author: {
    name: 'Christophe Seguinot',
    jobTitle: 'Senior Frontend Developer',
    email: 'christophe.seguinot@gmail.com',
    linkedIn: 'https://linkedin.com/in/christophe-seguinot',
    github: 'https://github.com/ledahu05',
  },
  images: {
    default: '/images/og/default.png',
    profile: '/images/profile.jpg',
  },
} as const
```

This ensures consistency and makes updates trivial.

### Type-Safe Meta Generation (`meta.ts`)

The core utility is `generatePageMeta()`:

```typescript
export function generatePageMeta(config: PageMetaConfig): HeadConfig {
  const {
    title,
    description,
    path,
    type = 'website',
    image,
    article,
    noIndex = false,
  } = config

  const fullTitle = `${truncateTitle(title)} | ${SITE_CONFIG.name}`
  const absoluteUrl = getAbsoluteUrl(path)
  const absoluteImageUrl = getAbsoluteImageUrl(image)

  const meta: MetaTag[] = [
    { title: fullTitle },
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: absoluteUrl },
    { property: 'og:image', content: absoluteImageUrl },
    { property: 'og:site_name', content: SITE_CONFIG.name },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteImageUrl },
  ]

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  return {
    meta,
    links: [generateCanonicalLink(path)],
  }
}
```

Key features:
- **Automatic absolute URLs**: All URLs are converted to absolute for social platforms
- **Title truncation**: Titles are truncated to 60 characters for SEO
- **Canonical links**: Every page gets a canonical URL to prevent duplicate content issues
- **noIndex support**: Game sessions can be excluded from indexing

### JSON-LD Generators (`structured-data.ts`)

Each schema type has a dedicated generator:

```typescript
export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  date: string
  author?: string
  tags?: string[]
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author || SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${article.slug}`,
    },
    keywords: article.tags,
  }
}
```

These are then injected into the page via TanStack Start's `scripts` array:

```typescript
head: ({ loaderData }) => {
  const pageMeta = generatePageMeta({ ... })
  const articleSchema = generateArticleSchema({ ... })
  return {
    ...pageMeta,
    scripts: [generateJsonLdScript(articleSchema)],
  }
}
```

---

## noIndex Pattern for Game Sessions

Game session pages (`/play`, `/online`, `/join`) contain ephemeral, user-specific content. Indexing them would:

1. Create broken search results (sessions expire)
2. Pollute results with duplicate "game in progress" pages
3. Expose room codes unnecessarily

The solution is a dedicated helper:

```typescript
export function generateNoIndexMeta(config: {
  title: string
  description: string
  path: string
}): HeadConfig {
  return generatePageMeta({
    ...config,
    type: 'website',
    noIndex: true,
  })
}
```

Usage is minimal:

```typescript
export const Route = createFileRoute('/games/quarto/play')({
  head: () => generateNoIndexMeta({
    title: 'Play Quarto',
    description: 'Currently playing Quarto.',
    path: '/games/quarto/play',
  }),
})
```

---

## Production Validation Results

> **Note**: This section will be updated with actual test results after deployment.

### Lighthouse SEO Scores

| Page | SEO Score | Status |
|------|-----------|--------|
| Homepage (`/`) | _pending_ | |
| Blog Listing (`/blog`) | _pending_ | |
| Blog Article (`/blog/*`) | _pending_ | |
| Quarto Hub (`/games/quarto`) | _pending_ | |
| Quarto Rules (`/games/quarto/rules`) | _pending_ | |

**Target**: All pages scoring 90+.

### Google Rich Results Validation

| Page | Schema Type | Status | Errors |
|------|-------------|--------|--------|
| Homepage | Person + WebSite | _pending_ | |
| Blog Listing | CollectionPage | _pending_ | |
| Blog Article | Article | _pending_ | |
| Quarto Hub | SoftwareApplication | _pending_ | |

**Target**: All schemas pass without errors.

### Social Preview Testing

| Platform | Test Tool | Status |
|----------|-----------|--------|
| Facebook | [Sharing Debugger](https://developers.facebook.com/tools/debug/) | _pending_ |
| Twitter | [Card Validator](https://cards-dev.twitter.com/validator) | _pending_ |
| LinkedIn | [Post Inspector](https://www.linkedin.com/post-inspector/) | _pending_ |

**Target**: All platforms display correct title, description, and image.

---

## Key Takeaways

1. **Centralize SEO configuration**: A single source of truth (`SITE_CONFIG`) prevents inconsistencies and makes updates trivial.

2. **Build a utility library**: Functions like `generatePageMeta()` and `generateArticleSchema()` reduce route-level boilerplate to 2-3 lines.

3. **Use absolute URLs everywhere**: Social platforms and search engines require absolute URLs for images and canonical links. Handle this in the utility layer.

4. **noIndex game sessions**: Dynamic, ephemeral pages should be excluded from indexing to avoid broken search results.

5. **Type everything**: TypeScript interfaces for meta tags and JSON-LD schemas catch errors at compile time and provide excellent autocomplete.

6. **Test with official tools**: Facebook Debugger, Twitter Card Validator, and Google Rich Results Test reveal issues that local testing misses.

---

## Future Improvements

Some enhancements for future iterations:

- **sitemap.xml generation**: Auto-generate a sitemap from routes for better crawlability
- **robots.txt configuration**: Explicitly control crawler behavior
- **Dynamic OG images**: Generate article-specific social images with title overlays
- **Performance monitoring**: Track Core Web Vitals impact on SEO rankings
- **Search Console integration**: Monitor indexing status and search performance

For now, the utility library approach provides solid SEO foundations. The validation results above will be updated as testing progresses in production.
