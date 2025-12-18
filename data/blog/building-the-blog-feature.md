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

# Building a Git-Based Blog with TanStack Start

When I decided to add a blog section to my portfolio, I had a clear vision: a simple, developer-friendly publishing workflow where writing an article means creating a markdown file and pushing to git. No CMS, no database, no admin panel - just markdown files in a repository.

This article documents the complete journey from conception to implementation, including the technical decisions made, the bugs encountered, and how they were solved. If you're building a similar feature with TanStack Start, this should save you some headaches.

## Requirements Overview

The blog needed to support five core user stories, prioritized by importance:

**P1 - Core Functionality:**
1. **Browse Blog Articles**: Visitors see a list of articles sorted by date, with titles, summaries, and reading time estimates
2. **Read a Blog Article**: Full article pages with properly rendered markdown, syntax-highlighted code blocks, and responsive images

**P2 - Author Experience:**
3. **Publish via Git**: Create a markdown file, add frontmatter, commit, push - done
4. **Navigation Integration**: Seamless transitions between the blog and main portfolio

**P3 - Discovery:**
5. **Tag Filtering**: Filter articles by topic tags

The key constraint was **build-time processing** - no runtime markdown parsing allowed. This ensures fast page loads and SEO-friendly static HTML.

---

## Technology Stack

### Why These Libraries?

| Library | Purpose | Why Chosen |
|---------|---------|------------|
| **unified/remark/rehype** | Markdown processing | Industry standard, modular, excellent TypeScript support |
| **Shiki** | Syntax highlighting | VS Code-quality highlighting, CSS-based output, no runtime JS |
| **gray-matter** | Frontmatter parsing | De facto standard (~3KB), battle-tested in Gatsby/Next.js/Astro |
| **Zod** | Schema validation | Runtime type checking, great error messages, TypeScript inference |
| **TanStack Start** | Framework | Already using it for the portfolio, native SSR support |

### Alternatives Considered

For markdown processing, I evaluated **marked** (simpler but less extensible), **markdown-it** (good but weaker TypeScript support), and **MDX** (overkill for static content). The unified ecosystem won because it's modular - you only include the plugins you need.

For syntax highlighting, **Prism.js** was the obvious alternative, but it requires runtime JavaScript. Shiki processes at build time and outputs CSS, meaning zero client-side overhead.

---

## Processing Pipeline

The markdown processing happens entirely at build time:

```
.md files → gray-matter → remark → rehype → Shiki → HTML
```

Here's the actual pipeline implementation:

```typescript
// app/lib/data/blog-loader.ts
async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkEmoji)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)

  return String(result)
}
```

**Key plugins:**
- `remarkGfm`: GitHub Flavored Markdown (tables, task lists, strikethrough)
- `remarkEmoji`: Converts shortcodes like `:rocket:` to emojis
- `rehypeShiki`: Syntax highlighting with dual theme support (light/dark)
- `rehypeSlug` + `rehypeAutolinkHeadings`: Auto-generated heading anchors

---

## Data Model

Three main types power the blog:

```typescript
// Full post with content (article pages)
type BlogPost = {
  slug: string           // Derived from filename
  title: string          // From frontmatter
  date: string           // ISO 8601 format
  summary: string        // Max 160 chars for SEO
  content: string        // Raw markdown
  contentHtml: string    // Processed HTML
  readingTime: number    // Calculated from word count
  tags: string[]         // Optional categorization
  author?: string        // Optional author name
}

// Lightweight preview (listing page)
type BlogPostPreview = Omit<BlogPost, 'content' | 'contentHtml'>

// Index for the listing page
type BlogIndex = {
  posts: BlogPostPreview[]
  tags: string[]         // All unique tags
  totalCount: number
}
```

Frontmatter validation uses Zod with strict rules:

```typescript
const BlogPostFrontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(10).max(160),  // SEO-friendly length
  tags: z.array(z.string()).optional().default([]),
  author: z.string().optional(),
})
```

Invalid frontmatter causes the article to be **excluded from the listing** (not a build error) - graceful degradation.

---

## Project Structure

```
app/
├── lib/
│   ├── data/
│   │   └── blog-loader.ts      # Markdown processing & caching
│   ├── server/
│   │   └── blog.server.ts      # Server functions (critical!)
│   ├── schemas/
│   │   └── blog.schema.ts      # Zod validation schemas
│   └── utils/
│       └── reading-time.ts     # Word count calculation
├── routes/
│   └── blog/
│       ├── index.tsx           # /blog listing with tag filtering
│       └── $slug.tsx           # /blog/[slug] article pages
├── components/
│   └── blog/
│       ├── BlogList.tsx        # Article grid with animations
│       ├── BlogCard.tsx        # Preview card component
│       └── TagFilter.tsx       # Tag filtering controls

data/
└── blog/
    ├── markdown-formatting-guide.md
    └── getting-started-with-tanstack.md
```

---

## Server Functions: The Critical Pattern

This was the source of the most frustrating bugs. TanStack Start server functions have a specific pattern that **must** be followed.

### The Problem

The blog loader uses Node.js APIs (`fs`, `path`) to read markdown files. When I initially imported it directly in route files:

```typescript
// DON'T DO THIS - causes build errors
import { getBlogPosts } from '@/lib/data/blog-loader'
```

The build failed with:

```
Module 'path' has been externalized for browser compatibility
```

### The Solution

Create a separate server functions file with **dynamic imports**:

```typescript
// app/lib/server/blog.server.ts
import { createServerFn } from '@tanstack/react-start'

export const serverGetBlogIndex = createServerFn().handler(async () => {
  // Dynamic import ensures Node.js modules only load on server
  const { getBlogIndex } = await import('../data/blog-loader')
  return getBlogIndex()
})
```

Then use it in routes:

```typescript
// app/routes/blog/index.tsx
import { serverGetBlogIndex } from '@/lib/server/blog.server'

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const index = await serverGetBlogIndex()
    return { posts: index.posts, tags: index.tags }
  },
})
```

**Key insight**: The `createServerFn().handler()` pattern (without method config) is the correct approach. Earlier attempts with `{ method: 'GET' }` caused hydration mismatches.

---

## Routing Implementation

### Listing Page with Tag Filtering

Tag filtering uses URL search params (`/blog?tag=react`):

```typescript
const blogSearchSchema = z.object({
  tag: z.string().optional(),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: blogSearchSchema,
  loaderDeps: ({ search }) => ({ tag: search.tag }),
  loader: async ({ deps }) => {
    const index = await serverGetBlogIndex()
    const posts = deps.tag
      ? index.posts.filter((p) => p.tags.includes(deps.tag!))
      : index.posts
    return { posts, tags: index.tags, activeTag: deps.tag }
  },
})
```

### Article Page with SEO

The `head()` function provides dynamic meta tags:

```typescript
export const Route = createFileRoute('/blog/$slug')({
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.title} | Christophe Seguinot` },
      { name: 'description', content: loaderData.summary },
      { property: 'og:title', content: loaderData.title },
      { property: 'og:type', content: 'article' },
      { property: 'article:published_time', content: loaderData.date },
    ],
  }),
})
```

---

## Bugs Encountered & Fixed

### Bug #1: Module Externalization

**Error**: `Module 'path' has been externalized for browser compatibility`

**Cause**: Node.js modules (`fs`, `path`) were being bundled for the client because the blog-loader was imported directly in route files.

**Fix**: Created `blog.server.ts` with server functions using dynamic imports. The dynamic import ensures Node.js modules only load in the server context.

### Bug #2: Hydration Mismatch

**Error**: `expected content-type header to be set` + SSR/client HTML differences

**Cause**: Incorrect `createServerFn` API usage. I was passing `{ method: 'GET' }` which caused issues.

**Fix**: Use the simpler `.handler()` pattern:
```typescript
// Wrong
createServerFn({ method: 'GET' }).handler(...)

// Correct
createServerFn().handler(...)
```

### Bug #3: Invisible Links and Missing List Markers

**Problem**: Links in article content were the same color as regular text. Lists had no bullet points or numbers.

**Fix**: Added explicit prose styles in `globals.css`:

```css
/* Links - make them visible */
.prose a {
  @apply text-primary underline underline-offset-2 hover:text-primary/80;
}

/* Lists - restore markers */
.prose ul {
  @apply list-disc;
}

.prose ol {
  @apply list-decimal;
}
```

### Bug #4: Shiki Span Backgrounds

**Problem**: Individual tokens in code blocks had dark background boxes, making syntax highlighting look broken.

**Cause**: CSS rules applied `background-color` to both `.shiki` and `.shiki span`. The span backgrounds were creating visual artifacts.

**Fix**: Make span backgrounds transparent:

```css
.shiki {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

.shiki span {
  color: var(--shiki-light);
  background-color: transparent !important;  /* Key fix */
}
```

The container keeps its background, but individual tokens don't interfere.

### Bug #5: Blog Directory Not Found in Production

**Error**: `Blog directory not found: /var/task/data/blog`

**Cause**: The blog loader used `path.join(process.cwd(), 'data/blog')` to locate markdown files. While this works locally where `process.cwd()` points to the project root, on Vercel serverless functions `process.cwd()` is `/var/task` - and Nitro's build process doesn't include the `data/blog` directory in the deployment bundle.

**Fix**: Two changes were needed:
1. Add a post-build step in `package.json` to copy the blog directory into the serverless function output
2. Update `blog-loader.ts` to check both local and Vercel paths

```json
// package.json
"build": "vite build && cp -r data/blog .vercel/output/functions/__server.func/"
```

```typescript
// blog-loader.ts
function getBlogDir(): string {
  // Local dev
  const cwdPath = path.join(process.cwd(), 'data/blog')
  if (fs.existsSync(cwdPath)) return cwdPath

  // Vercel serverless
  const vercelPath = '/var/task/blog'
  if (fs.existsSync(vercelPath)) return vercelPath

  return cwdPath
}
```

This ensures the markdown files are bundled with the serverless function and the loader can find them regardless of the deployment environment.

---

## Adding a New Article

Creating a new blog post is straightforward:

1. **Create the file**: `data/blog/your-article-slug.md`
   - Filename becomes the URL slug
   - Use lowercase letters, numbers, and hyphens only

2. **Add frontmatter**:
```yaml
---
title: "Your Article Title"
date: "2025-12-17"
summary: "A brief description (max 160 chars for SEO)."
tags:
  - react
  - typescript
author: "Your Name"  # Optional
---
```

3. **Write content** in standard markdown

4. **Commit and push** - the article appears after deployment

### Supported Markdown Features

- GitHub Flavored Markdown: tables, task lists, strikethrough
- Syntax highlighting for 30+ languages
- Emoji shortcodes: `:rocket:` becomes :rocket:
- Auto-generated heading anchors
- Images with responsive sizing

---

## Key Takeaways

1. **Build-time processing is worth it**: Zero runtime overhead, SEO-friendly HTML, fast page loads. The unified ecosystem handles this elegantly.

2. **Server/client boundaries matter**: TanStack Start requires careful separation of Node.js code. Dynamic imports in server functions are the solution.

3. **CSS specificity with third-party themes is tricky**: Shiki's dual-theme support required explicit `transparent !important` on spans to prevent visual artifacts.

4. **Graceful degradation beats hard failures**: Invalid frontmatter excludes an article from the listing rather than breaking the build. Console warnings help debugging.

5. **Test across themes**: The Shiki span background bug only appeared because I was thorough about testing both light and dark modes.

---

## Future Improvements

Some features that could enhance the blog:

- **RSS feed generation**: Automatically generate an RSS feed from the blog index
- **Full-text search**: Add client-side search with Fuse.js or similar
- **Related posts**: Show related articles based on shared tags
- **View counter**: Simple analytics without external services

For now, the git-based workflow serves its purpose: write markdown, push, publish. Sometimes the simplest solution is the best one.
