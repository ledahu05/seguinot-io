// T025 & T026 & T030: Article detail route with slug parameter and SEO
// T015-T016: Enhanced article SEO with og:url, og:image, canonical, and Article JSON-LD

import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ArrowLeft } from 'lucide-react'
import {
  generatePageMeta,
  generateArticleSchema,
  generateJsonLdScript,
  SITE_CONFIG,
} from '@/lib/seo'

// Server function to fetch blog post by slug
const fetchBlogPostBySlug = createServerFn().handler(async () => {
  const { loadAllPostsWithContent } = await import('@/lib/data/blog-loader')
  return loadAllPostsWithContent()
})

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const posts = await fetchBlogPostBySlug()
    const post = posts.find((p) => p.slug === params.slug)
    if (!post) {
      throw notFound()
    }
    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: 'Article Not Found | Blog' }],
      }
    }

    const pageMeta = generatePageMeta({
      title: loaderData.title,
      description: loaderData.summary,
      path: `/blog/${loaderData.slug}`,
      type: 'article',
      article: {
        publishedTime: loaderData.date,
        author: loaderData.author || SITE_CONFIG.author.name,
        tags: loaderData.tags,
        readingTime: loaderData.readingTime,
      },
    })

    // Generate Article JSON-LD
    const articleSchema = generateArticleSchema({
      title: loaderData.title,
      description: loaderData.summary,
      slug: loaderData.slug,
      date: loaderData.date,
      author: loaderData.author,
      tags: loaderData.tags,
    })

    return {
      ...pageMeta,
      scripts: [generateJsonLdScript(articleSchema)],
    }
  },
  notFoundComponent: () => (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Article Not Found
          </h1>
          <p className="text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    </main>
  ),
  component: ArticlePage,
})

function ArticlePage() {
  const post = Route.useLoaderData()

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back to blog link */}
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article header */}
        <header className="mb-8">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            {post.author && (
              <>
                <span>·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
        </header>

        {/* Article content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  )
}
