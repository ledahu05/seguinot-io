// Server-only blog data fetching functions
// This file contains server functions that use Node.js APIs (fs, path)

import { createServerFn } from '@tanstack/react-start'

// Server function to fetch blog index
export const serverGetBlogIndex = createServerFn().handler(async () => {
  const { getBlogIndex } = await import('../data/blog-loader')
  return getBlogIndex()
})

// Server function to fetch all posts (for filtering client-side)
export const serverGetAllPosts = createServerFn().handler(async () => {
  const { getBlogPosts } = await import('../data/blog-loader')
  return getBlogPosts()
})

// Server function to fetch single post by slug
// Note: slug is passed via URL, so we fetch all and filter
export const serverGetBlogPosts = createServerFn().handler(async () => {
  const { getBlogPosts } = await import('../data/blog-loader')
  return getBlogPosts()
})
