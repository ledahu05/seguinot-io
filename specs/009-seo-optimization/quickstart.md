# Quickstart: SEO Validation Checklist

**Feature**: SEO Optimization for All Pages
**Date**: 2025-12-17
**Purpose**: Post-implementation validation checklist for SEO features

## Pre-Flight Checks

Before running validation, ensure:

- [ ] All routes have been updated with `head()` function
- [ ] SEO utility library created in `app/lib/seo/`
- [ ] Default OG image created at `data/images/og/default.png`
- [ ] Application builds without errors (`pnpm build`)
- [ ] Application deployed to preview environment

## Automated Validation

### 1. Lighthouse SEO Audit

Run for each public page:

```bash
# Homepage
npx lighthouse https://seguinot.io --only-categories=seo --output=json --output-path=./reports/seo-home.json

# Blog listing
npx lighthouse https://seguinot.io/blog --only-categories=seo --output=json --output-path=./reports/seo-blog.json

# Blog article (any)
npx lighthouse https://seguinot.io/blog/building-the-blog-feature --only-categories=seo --output=json --output-path=./reports/seo-article.json

# Quarto game hub
npx lighthouse https://seguinot.io/games/quarto --only-categories=seo --output=json --output-path=./reports/seo-quarto.json

# Quarto rules
npx lighthouse https://seguinot.io/games/quarto/rules --only-categories=seo --output=json --output-path=./reports/seo-rules.json
```

**Success Criteria**: All pages score 90+ in SEO category

### 2. View Page Source Validation

For each page, verify in browser (View Page Source):

#### Meta Tags Present

- [ ] `<title>` - Unique, 50-60 characters
- [ ] `<meta name="description">` - Unique, 150-160 characters
- [ ] `<meta name="viewport">` - Present
- [ ] `<meta charset="utf-8">` - Present

#### Open Graph Tags Present

- [ ] `<meta property="og:title">` - Matches page title
- [ ] `<meta property="og:description">` - Matches meta description
- [ ] `<meta property="og:type">` - `website` or `article`
- [ ] `<meta property="og:url">` - Full canonical URL
- [ ] `<meta property="og:image">` - Absolute URL to image

#### Twitter Card Tags Present

- [ ] `<meta name="twitter:card">` - `summary_large_image`
- [ ] `<meta name="twitter:title">` - Matches page title
- [ ] `<meta name="twitter:description">` - Matches meta description
- [ ] `<meta name="twitter:image">` - Absolute URL to image

#### Canonical Link Present

- [ ] `<link rel="canonical">` - Full URL matching current page

## Manual Validation

### 3. Google Rich Results Test

Test each page type for JSON-LD validation:

1. Go to: https://search.google.com/test/rich-results
2. Enter URL
3. Verify:
   - [ ] No errors in structured data
   - [ ] Warnings reviewed and acceptable
   - [ ] Preview shows expected rich result

**Pages to test**:
- [ ] Homepage (Person schema)
- [ ] Blog listing (CollectionPage schema)
- [ ] Blog article (Article schema)
- [ ] Quarto hub (SoftwareApplication schema)

### 4. Social Preview Validation

Test social sharing previews:

#### Facebook/LinkedIn (Open Graph)

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter URL, click "Debug"
3. Verify:
   - [ ] Title displays correctly
   - [ ] Description displays correctly
   - [ ] Image loads (1200x630)
   - [ ] No warnings

**Pages to test**:
- [ ] Homepage
- [ ] Blog article
- [ ] Quarto game hub

#### Twitter Cards

1. Go to: https://cards-dev.twitter.com/validator
2. Enter URL
3. Verify:
   - [ ] Card type: Summary Large Image
   - [ ] Title displays correctly
   - [ ] Description displays correctly
   - [ ] Image loads correctly

### 5. Semantic HTML Validation

For each page, verify using browser DevTools:

#### Heading Hierarchy

```javascript
// Run in browser console
document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h =>
  console.log(h.tagName, h.textContent.substring(0, 50))
);
```

- [ ] Exactly one `<h1>` per page
- [ ] Logical hierarchy (no skipping levels)
- [ ] Headings describe content structure

#### Image Alt Text

```javascript
// Run in browser console
document.querySelectorAll('img').forEach(img =>
  console.log(img.src.split('/').pop(), ':', img.alt || 'MISSING ALT')
);
```

- [ ] All images have alt text
- [ ] Alt text is descriptive (not "image" or "photo")
- [ ] Decorative images use `alt=""`

#### Semantic Elements

- [ ] `<nav>` used for navigation
- [ ] `<main>` used for main content
- [ ] `<article>` used for blog posts
- [ ] `<header>` and `<footer>` present

## Page-by-Page Checklist

### Homepage (`/`)

| Check | Status |
|-------|--------|
| Title: "Christophe Seguinot \| Senior Frontend Developer" | [ ] |
| Description: Contains "Senior Frontend Developer" and "React/TypeScript" | [ ] |
| OG type: `profile` | [ ] |
| Person JSON-LD present | [ ] |
| WebSite JSON-LD present | [ ] |
| Single h1: Name or title | [ ] |
| Lighthouse SEO: 90+ | [ ] |

### Blog Listing (`/blog`)

| Check | Status |
|-------|--------|
| Title: "Blog \| Christophe Seguinot" | [ ] |
| Description: Mentions "frontend development" | [ ] |
| OG type: `website` | [ ] |
| CollectionPage JSON-LD present | [ ] |
| Single h1: "Blog" | [ ] |
| Lighthouse SEO: 90+ | [ ] |

### Blog Article (`/blog/$slug`)

| Check | Status |
|-------|--------|
| Title: "{Article Title} \| Christophe Seguinot" | [ ] |
| Description: Article summary | [ ] |
| OG type: `article` | [ ] |
| article:published_time present | [ ] |
| article:author present | [ ] |
| Article JSON-LD present | [ ] |
| Single h1: Article title | [ ] |
| Lighthouse SEO: 90+ | [ ] |

### Quarto Hub (`/games/quarto`)

| Check | Status |
|-------|--------|
| Title: "Quarto Game \| Christophe Seguinot" | [ ] |
| Description: Mentions "strategic board game" | [ ] |
| OG type: `website` | [ ] |
| SoftwareApplication JSON-LD present | [ ] |
| Single h1: "Quarto" | [ ] |
| Lighthouse SEO: 90+ | [ ] |

### Quarto Rules (`/games/quarto/rules`)

| Check | Status |
|-------|--------|
| Title: "Quarto Rules \| Christophe Seguinot" | [ ] |
| Description: Mentions "learn" and "rules" | [ ] |
| OG type: `website` | [ ] |
| Single h1: Rules/How to Play | [ ] |
| Lighthouse SEO: 90+ | [ ] |

### Quarto Play/Online/Join (noIndex pages)

| Check | Status |
|-------|--------|
| Meta robots: `noindex` present | [ ] |
| Basic title present | [ ] |
| Basic description present | [ ] |

## Post-Deployment Verification

After deploying to production:

1. [ ] Clear CDN cache if applicable
2. [ ] Verify OG images load from production URLs
3. [ ] Test social sharing from actual social platforms
4. [ ] Submit updated pages to Google Search Console (optional)

## Troubleshooting

### OG Image Not Loading

- Verify image URL is absolute (starts with `https://`)
- Check image dimensions (1200x630)
- Verify image is publicly accessible
- Clear social platform cache and re-scrape

### Duplicate Meta Tags

- Check for meta tags in both root and page layouts
- Ensure TanStack head() properly overrides parent tags
- Use browser DevTools to inspect final HTML

### JSON-LD Errors

- Validate JSON syntax at https://jsonlint.com/
- Check required properties for schema type
- Ensure dates are ISO 8601 format
- Verify URL values are absolute

### Lighthouse Score Below 90

Common issues:
- Missing meta description
- Title too long/short
- Missing viewport meta tag
- Images without alt text
- Links without discernible text
- Tap targets too small on mobile
