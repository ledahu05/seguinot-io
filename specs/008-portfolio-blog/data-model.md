# Data Model: Portfolio Blog Section

**Feature**: 008-portfolio-blog
**Date**: 2025-12-15
**Status**: Complete

## Entity Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BlogPost                             │
├─────────────────────────────────────────────────────────────┤
│ slug: string (PK, derived from filename)                    │
│ title: string                                               │
│ date: string (ISO 8601)                                     │
│ summary: string                                             │
│ content: string (raw markdown)                              │
│ contentHtml: string (processed HTML)                        │
│ readingTime: number (minutes)                               │
│ tags: string[]                                              │
│ featuredImage?: string                                      │
│ author?: string                                             │
├─────────────────────────────────────────────────────────────┤
│ Derived from: /data/blog/*.md files                         │
│ Processed at: Build time                                    │
└─────────────────────────────────────────────────────────────┘
         │
         │ aggregates to
         ▼
┌─────────────────────────────────────────────────────────────┐
│                       BlogIndex                             │
├─────────────────────────────────────────────────────────────┤
│ posts: BlogPostPreview[]                                    │
│ tags: string[] (unique, sorted alphabetically)              │
│ totalCount: number                                          │
├─────────────────────────────────────────────────────────────┤
│ Used by: /blog listing page                                 │
│ Sorted by: date (descending)                                │
└─────────────────────────────────────────────────────────────┘
         │
         │ contains
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BlogPostPreview                          │
├─────────────────────────────────────────────────────────────┤
│ slug: string                                                │
│ title: string                                               │
│ date: string                                                │
│ summary: string                                             │
│ readingTime: number                                         │
│ tags: string[]                                              │
│ featuredImage?: string                                      │
├─────────────────────────────────────────────────────────────┤
│ Note: Excludes content/contentHtml for performance          │
└─────────────────────────────────────────────────────────────┘
```

---

## Zod Schemas

### BlogPostFrontmatter Schema

```typescript
// app/lib/schemas/blog.schema.ts
import { z } from 'zod'

/**
 * Schema for frontmatter parsed from markdown files.
 * Required fields must be present; optional fields have defaults.
 */
export const BlogPostFrontmatterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be under 100 characters'),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(160, 'Summary must be under 160 characters for SEO'),

  tags: z
    .array(z.string().min(1).max(30))
    .optional()
    .default([]),

  featuredImage: z
    .string()
    .url()
    .or(z.string().startsWith('/'))
    .optional(),

  author: z
    .string()
    .min(1)
    .optional(),
})

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>
```

### BlogPost Schema

```typescript
/**
 * Full blog post with processed content.
 * Used for individual article pages.
 */
export const BlogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),

  title: z.string().min(1),
  date: z.string(),
  summary: z.string(),
  content: z.string(), // Raw markdown
  contentHtml: z.string(), // Processed HTML
  readingTime: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
})

export type BlogPost = z.infer<typeof BlogPostSchema>
```

### BlogPostPreview Schema

```typescript
/**
 * Lightweight post preview for listing pages.
 * Excludes content to reduce payload size.
 */
export const BlogPostPreviewSchema = BlogPostSchema.omit({
  content: true,
  contentHtml: true,
})

export type BlogPostPreview = z.infer<typeof BlogPostPreviewSchema>
```

### BlogIndex Schema

```typescript
/**
 * Index of all blog posts for the listing page.
 */
export const BlogIndexSchema = z.object({
  posts: z.array(BlogPostPreviewSchema),
  tags: z.array(z.string()),
  totalCount: z.number().int().nonnegative(),
})

export type BlogIndex = z.infer<typeof BlogIndexSchema>
```

---

## Markdown File Format

### File Naming Convention

```
data/blog/[slug].md
```

- Filename becomes the URL slug
- Use lowercase letters, numbers, and hyphens only
- Examples:
  - `building-a-react-portfolio.md` → `/blog/building-a-react-portfolio`
  - `typescript-best-practices-2025.md` → `/blog/typescript-best-practices-2025`

### File Structure

```markdown
---
title: "Building a React Portfolio with TanStack Start"
date: "2025-12-15"
summary: "A deep dive into creating a modern portfolio using React 19, TanStack Start, and Tailwind CSS v4."
tags:
  - react
  - tanstack
  - portfolio
featuredImage: "/blog/images/building-a-react-portfolio/hero.webp"
author: "Chris Séguinot"
---

# Introduction

Your article content starts here...

## Section Heading

More content...

```javascript
// Code blocks are syntax highlighted
const greeting = 'Hello, World!'
console.log(greeting)
```

![Image alt text](/blog/images/building-a-react-portfolio/diagram.webp)
```

---

## Data Loading Functions

### Interface

```typescript
// app/lib/data/blog-loader.ts

/**
 * Get all blog posts for the listing page.
 * Returns posts sorted by date (newest first).
 * Excludes content for performance.
 */
export function getBlogPosts(): BlogPostPreview[]

/**
 * Get the full blog index with tag list.
 */
export function getBlogIndex(): BlogIndex

/**
 * Get a single blog post by slug.
 * Returns null if post not found.
 * Includes full processed HTML content.
 */
export function getBlogPostBySlug(slug: string): BlogPost | null

/**
 * Get posts filtered by tag.
 * Returns posts sorted by date (newest first).
 */
export function getBlogPostsByTag(tag: string): BlogPostPreview[]

/**
 * Get all unique tags across all posts.
 * Returns tags sorted alphabetically.
 */
export function getAllTags(): string[]
```

---

## Validation Rules

### Frontmatter Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | 1-100 characters |
| `date` | string | Yes | ISO 8601 format (YYYY-MM-DD) |
| `summary` | string | Yes | 10-160 characters |
| `tags` | string[] | No | Each tag 1-30 characters |
| `featuredImage` | string | No | Valid URL or path starting with `/` |
| `author` | string | No | Non-empty string |

### Slug Validation

| Rule | Pattern | Example |
|------|---------|---------|
| Lowercase only | `/^[a-z0-9-]+$/` | `my-first-post` ✅ |
| No spaces | - | `my first post` ❌ |
| No special chars | - | `my_post!` ❌ |
| Hyphens OK | - | `react-19-features` ✅ |

### Error Handling

```typescript
// Invalid frontmatter handling
function loadBlogPost(filePath: string): BlogPost | null {
  try {
    const { data, content } = matter(fileContent)
    const result = BlogPostFrontmatterSchema.safeParse(data)

    if (!result.success) {
      console.warn(`Invalid frontmatter in ${filePath}:`, result.error.format())
      return null // Exclude from listing
    }

    // Continue processing...
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error)
    return null
  }
}
```

---

## Reading Time Calculation

### Formula

```typescript
// app/lib/utils/reading-time.ts

const WORDS_PER_MINUTE = 200

export function calculateReadingTime(content: string): number {
  // Remove code blocks (read faster)
  const textContent = content.replace(/```[\s\S]*?```/g, '')

  // Count words
  const words = textContent
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length

  // Calculate minutes, minimum 1
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
```

---

## State Transitions

This feature uses static data with no state transitions. Content is:

1. **Created**: Author writes markdown file
2. **Validated**: Build process validates frontmatter
3. **Processed**: Markdown converted to HTML
4. **Cached**: Processed content cached in memory
5. **Served**: Content returned to client

No runtime mutations occur.

---

## Relationships

```
BlogPost
  └── belongs_to: BlogIndex (via posts array)
  └── has_many: tags (string array)

BlogIndex
  └── has_many: BlogPostPreview
  └── has_many: tags (aggregated unique tags)

Tags
  └── many_to_many: BlogPost (via tags array)
```

---

## Sample Data

### Example Markdown File

**File**: `data/blog/getting-started-with-tanstack-start.md`

```markdown
---
title: "Getting Started with TanStack Start"
date: "2025-12-15"
summary: "Learn how to build a full-stack React application with TanStack Start, the new React framework from the TanStack team."
tags:
  - tanstack
  - react
  - tutorial
featuredImage: "/blog/images/getting-started-with-tanstack-start/hero.webp"
---

# Getting Started with TanStack Start

TanStack Start is a powerful full-stack React framework...

## Installation

```bash
npm create tanstack-start@latest my-app
```

## File-Based Routing

Routes are defined in the `app/routes/` directory...
```

### Parsed BlogPost Object

```typescript
{
  slug: 'getting-started-with-tanstack-start',
  title: 'Getting Started with TanStack Start',
  date: '2025-12-15',
  summary: 'Learn how to build a full-stack React application with TanStack Start...',
  content: '# Getting Started with TanStack Start\n\nTanStack Start is...',
  contentHtml: '<h1>Getting Started with TanStack Start</h1><p>TanStack Start is...</p>',
  readingTime: 5,
  tags: ['tanstack', 'react', 'tutorial'],
  featuredImage: '/blog/images/getting-started-with-tanstack-start/hero.webp',
  author: undefined
}
```
