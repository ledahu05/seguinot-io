// T016 & T020: BlogCard component for article preview with portfolio design system

'use client'

import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { Calendar, Clock } from 'lucide-react'
import type { BlogPostPreview } from '@/lib/schemas/blog.schema'
import { ANIMATION } from '@/lib/constants'

interface BlogCardProps {
  post: BlogPostPreview
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: ANIMATION.PROJECT_SLIDE,
        delay: index * 0.1,
      }}
      className="group"
    >
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="block h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
      >
        {/* Optional featured image */}
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={post.featuredImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-5">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h2 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          {/* Summary */}
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {post.summary}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={post.date}>{formattedDate}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
