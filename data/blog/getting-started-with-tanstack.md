---
title: "Getting Started with TanStack Router"
date: "2025-12-10"
summary: "A practical guide to building type-safe routing in React applications using TanStack Router and TanStack Start."
tags:
  - react
  - typescript
  - tanstack
  - routing
author: "Chris Séguinot"
---

# Getting Started with TanStack Router

TanStack Router is a fully type-safe router for React applications that provides an exceptional developer experience with first-class TypeScript support. In this guide, we'll explore how to set up and use TanStack Router in a modern React project.

## Why TanStack Router?

After years of using React Router, I switched to TanStack Router for several compelling reasons:

- **Full Type Safety**: Route parameters, search params, and loaders are all type-safe
- **Built-in Data Loading**: Integrated data fetching with loaders, similar to Remix
- **File-Based Routing**: Optional file-based routing that generates types automatically
- **Search Params Management**: First-class search parameter validation with Zod
- **Devtools**: Excellent debugging experience with built-in devtools

## Setting Up Your Project

First, create a new project with TanStack Start (the full-stack framework) or add TanStack Router to an existing React project:

```bash
# Create a new TanStack Start project
npx create-tanstack-app@latest my-app

# Or add to existing project
pnpm add @tanstack/react-router
```

## Basic Route Configuration

Here's a simple route configuration:

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

function BlogPage() {
  return (
    <main>
      <h1>Blog</h1>
      <p>Welcome to my blog!</p>
    </main>
  )
}
```

## Data Loading with Loaders

One of the best features is built-in data loading:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { getBlogPosts } from '@/lib/data/blog-loader'

export const Route = createFileRoute('/blog')({
  loader: async () => {
    const posts = await getBlogPosts()
    return { posts }
  },
  component: BlogPage,
})

function BlogPage() {
  const { posts } = Route.useLoaderData()

  return (
    <main>
      <h1>Blog ({posts.length} articles)</h1>
      {posts.map((post) => (
        <article key={post.slug}>
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
        </article>
      ))}
    </main>
  )
}
```

## Type-Safe Route Parameters

Dynamic routes with full type safety:

```typescript
import { createFileRoute, notFound } from '@tanstack/react-router'
import { getBlogPostBySlug } from '@/lib/data/blog-loader'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    // params.slug is fully typed!
    const post = await getBlogPostBySlug(params.slug)
    if (!post) {
      throw notFound()
    }
    return post
  },
  component: ArticlePage,
})

function ArticlePage() {
  const post = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  )
}
```

## Search Parameters with Validation

TanStack Router excels at search parameter management:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const blogSearchSchema = z.object({
  tag: z.string().optional(),
  page: z.number().default(1),
  sort: z.enum(['date', 'title']).default('date'),
})

export const Route = createFileRoute('/blog')({
  validateSearch: blogSearchSchema,
  component: BlogPage,
})

function BlogPage() {
  const { tag, page, sort } = Route.useSearch()

  // All search params are fully typed!
  return (
    <div>
      <p>Filtering by tag: {tag ?? 'all'}</p>
      <p>Page: {page}</p>
      <p>Sort: {sort}</p>
    </div>
  )
}
```

## Navigation

Navigate between routes with full type safety:

```typescript
import { Link } from '@tanstack/react-router'

function BlogCard({ post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="block p-4 border rounded-lg hover:shadow-md"
    >
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
    </Link>
  )
}
```

## Conclusion

TanStack Router has transformed how I build React applications. The type safety catches errors at compile time rather than runtime, and the integrated data loading makes async state management much simpler.

If you're starting a new React project or considering a router upgrade, TanStack Router is worth serious consideration.

### Resources

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [GitHub Repository](https://github.com/tanstack/router)
