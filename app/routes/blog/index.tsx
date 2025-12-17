// T018 & T019 & T044 & T047: Blog listing route with loader, SEO, and tag filtering

import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { serverGetBlogIndex } from '@/lib/server/blog.server'
import { BlogList } from '@/components/blog/BlogList'
import { TagFilter } from '@/components/blog/TagFilter'

const blogSearchSchema = z.object({
  tag: z.string().optional(),
})

export const Route = createFileRoute('/blog/')({
  validateSearch: blogSearchSchema,
  loaderDeps: ({ search }) => ({ tag: search.tag }),
  loader: async ({ deps }) => {
    const index = await serverGetBlogIndex()

    // Filter by tag if provided (client-side filtering)
    const posts = deps.tag
      ? index.posts.filter((p) => p.tags.includes(deps.tag!))
      : index.posts

    return {
      posts,
      tags: index.tags,
      totalCount: index.totalCount,
      activeTag: deps.tag,
    }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.activeTag
      ? `Articles tagged "${loaderData.activeTag}" | Blog`
      : 'Blog | Christophe Seguinot'

    return {
      meta: [
        { title },
        {
          name: 'description',
          content:
            'Articles about frontend development, React, TypeScript, and building modern web applications.',
        },
        { property: 'og:title', content: title },
        {
          property: 'og:description',
          content:
            'Articles about frontend development, React, TypeScript, and building modern web applications.',
        },
        { property: 'og:type', content: 'website' },
      ],
    }
  },
  component: BlogPage,
})

function BlogPage() {
  const { posts, tags, totalCount, activeTag } = Route.useLoaderData()

  const displayCount = activeTag
    ? `${posts.length} of ${totalCount} articles`
    : `${totalCount} articles`

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back to home link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Page header */}
        <header className="mb-8">
          <h1 className="mb-3 text-4xl font-bold text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Thoughts on frontend development, best practices, and lessons
            learned.
            {totalCount > 0 && (
              <span className="ml-2 text-sm">({displayCount})</span>
            )}
          </p>
        </header>

        {/* Tag filter */}
        <TagFilter tags={tags} activeTag={activeTag} />

        {/* Blog posts grid */}
        <BlogList posts={posts} />
      </div>
    </main>
  )
}
