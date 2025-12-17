// T017 & T021: BlogList component with Framer Motion staggered animation and responsive grid

'use client'

import { motion } from 'framer-motion'
import { BlogCard } from './BlogCard'
import { EmptyState } from './EmptyState'
import type { BlogPostPreview } from '@/lib/schemas/blog.schema'

interface BlogListProps {
  posts: BlogPostPreview[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </motion.div>
  )
}
