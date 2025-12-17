# Quickstart: Portfolio Blog Section

**Feature**: 008-portfolio-blog
**Date**: 2025-12-15

## Prerequisites

- Node.js 20+
- pnpm (project uses pnpm)
- Git

## Setup Steps

### 1. Install New Dependencies

```bash
pnpm add gray-matter unified remark-parse remark-gfm remark-rehype rehype-stringify rehype-slug rehype-autolink-headings shiki @tailwindcss/typography
```

### 2. Create Blog Content Directory

```bash
mkdir -p data/blog/images
```

### 3. Create Sample Blog Post

Create `data/blog/hello-world.md`:

```markdown
---
title: "Hello World: My First Blog Post"
date: "2025-12-15"
summary: "Welcome to my blog! This is my first post where I share my thoughts on web development."
tags:
  - introduction
  - web-development
---

# Hello World!

Welcome to my blog. I'm excited to share my journey in web development.

## What I'll Write About

- React and TypeScript best practices
- Building performant web applications
- UI/UX design principles

## Code Example

```typescript
const greeting = 'Hello, World!'
console.log(greeting)
```

Stay tuned for more posts!
```

### 4. Create Blog Schema

Create `app/lib/schemas/blog.schema.ts`:

```typescript
import { z } from 'zod'

export const BlogPostFrontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(10).max(160),
  tags: z.array(z.string()).optional().default([]),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
})

export const BlogPostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  content: z.string(),
  contentHtml: z.string(),
  readingTime: z.number().int().positive(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  author: z.string().optional(),
})

export const BlogPostPreviewSchema = BlogPostSchema.omit({
  content: true,
  contentHtml: true,
})

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>
export type BlogPost = z.infer<typeof BlogPostSchema>
export type BlogPostPreview = z.infer<typeof BlogPostPreviewSchema>
```

### 5. Create Blog Loader

Create `app/lib/data/blog-loader.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { BlogPostFrontmatterSchema, type BlogPost, type BlogPostPreview } from '../schemas/blog.schema'

const BLOG_DIR = path.join(process.cwd(), 'data/blog')
const WORDS_PER_MINUTE = 200

let cachedPosts: BlogPost[] | null = null

function calculateReadingTime(content: string): number {
  const text = content.replace(/```[\s\S]*?```/g, '')
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeStringify)
    .process(content)

  return String(result)
}

async function loadAllPosts(): Promise<BlogPost[]> {
  if (cachedPosts) return cachedPosts

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))
  const posts: BlogPost[] = []

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const frontmatterResult = BlogPostFrontmatterSchema.safeParse(data)
    if (!frontmatterResult.success) {
      console.warn(`Invalid frontmatter in ${file}:`, frontmatterResult.error.format())
      continue
    }

    const slug = file.replace(/\.md$/, '')
    const contentHtml = await processMarkdown(content)

    posts.push({
      slug,
      ...frontmatterResult.data,
      content,
      contentHtml,
      readingTime: calculateReadingTime(content),
    })
  }

  cachedPosts = posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return cachedPosts
}

export async function getBlogPosts(): Promise<BlogPostPreview[]> {
  const posts = await loadAllPosts()
  return posts.map(({ content, contentHtml, ...preview }) => preview)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadAllPosts()
  return posts.find(p => p.slug === slug) ?? null
}

export async function getAllTags(): Promise<string[]> {
  const posts = await loadAllPosts()
  const tags = new Set(posts.flatMap(p => p.tags))
  return Array.from(tags).sort()
}
```

### 6. Create Blog Routes

Create `app/routes/blog/index.tsx`:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts, getAllTags } from '@/lib/data/blog-loader'

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()])
    return { posts, tags }
  },
  component: BlogListPage,
})

function BlogListPage() {
  const { posts, tags } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6">
          {posts.map(post => (
            <article key={post.slug} className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="text-muted-foreground mt-2">{post.summary}</p>
              <div className="mt-4 text-sm text-muted-foreground">
                {post.date} · {post.readingTime} min read
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
```

Create `app/routes/blog/$slug.tsx`:

```typescript
import { createFileRoute, notFound } from '@tanstack/react-router'
import { getBlogPostBySlug } from '@/lib/data/blog-loader'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug(params.slug)
    if (!post) throw notFound()
    return { post }
  },
  component: BlogArticlePage,
})

function BlogArticlePage() {
  const { post } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="text-muted-foreground mt-2">
            {post.date} · {post.readingTime} min read
          </p>
        </header>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  )
}
```

### 7. Run Development Server

```bash
pnpm dev
```

Visit:
- `http://localhost:3000/blog` - Blog listing
- `http://localhost:3000/blog/hello-world` - Sample article

## Verification Checklist

- [ ] Dependencies installed without errors
- [ ] Sample blog post created in `data/blog/`
- [ ] Blog listing page loads at `/blog`
- [ ] Article page loads at `/blog/hello-world`
- [ ] Markdown renders correctly (headings, code blocks, lists)
- [ ] Reading time displays correctly

## Next Steps

1. Add Framer Motion animations to blog components
2. Style blog cards with Tailwind to match portfolio design
3. Add syntax highlighting with Shiki
4. Create navigation link from homepage to blog
5. Add tag filtering functionality

## Troubleshooting

### "Cannot find module 'gray-matter'"

Run: `pnpm add gray-matter`

### "ENOENT: no such file or directory" for blog files

Ensure `data/blog/` directory exists and contains `.md` files.

### Markdown not rendering

Check that `remark-rehype` and `rehype-stringify` are installed and imported correctly.

### Route not found

Run `pnpm dev` to regenerate TanStack Router's route tree. Check `app/routeTree.gen.ts` includes blog routes.
