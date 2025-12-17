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

  tags: z.array(z.string().min(1).max(30)).optional().default([]),

  featuredImage: z
    .string()
    .url()
    .or(z.string().startsWith('/'))
    .optional(),

  author: z.string().min(1).optional(),
})

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>

/**
 * Full blog post with processed content.
 * Used for individual article pages.
 */
export const BlogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),

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

/**
 * Lightweight post preview for listing pages.
 * Excludes content to reduce payload size.
 */
export const BlogPostPreviewSchema = BlogPostSchema.omit({
  content: true,
  contentHtml: true,
})

export type BlogPostPreview = z.infer<typeof BlogPostPreviewSchema>

/**
 * Index of all blog posts for the listing page.
 */
export const BlogIndexSchema = z.object({
  posts: z.array(BlogPostPreviewSchema),
  tags: z.array(z.string()),
  totalCount: z.number().int().nonnegative(),
})

export type BlogIndex = z.infer<typeof BlogIndexSchema>
