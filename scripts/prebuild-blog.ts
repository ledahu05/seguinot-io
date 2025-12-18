/**
 * Prebuild script for blog content.
 * Processes markdown files at build time to avoid Shiki cold-start delays at runtime.
 *
 * Run with: npx tsx scripts/prebuild-blog.ts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkEmoji from 'remark-emoji'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShiki from '@shikijs/rehype'
import { z } from 'zod'

// Schema for frontmatter validation (matching blog.schema.ts)
const BlogPostFrontmatterSchema = z.object({
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

interface BlogPost {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  featuredImage?: string
  author?: string
  content: string
  contentHtml: string
  readingTime: number
}

interface BlogCache {
  posts: BlogPost[]
  tags: string[]
  generatedAt: string
}

const BLOG_DIR = path.join(process.cwd(), 'data/blog')
const CACHE_DIR = path.join(process.cwd(), 'data/blog-cache')
const CACHE_FILE = path.join(CACHE_DIR, 'index.json')

/**
 * Calculate reading time based on word count.
 * Assumes average reading speed of 200 words per minute.
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

/**
 * Process markdown content to HTML using unified pipeline.
 */
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

async function main() {
  console.log('Building blog cache...')
  const startTime = Date.now()

  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }

  // Check if blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`Blog directory not found: ${BLOG_DIR}`)
    const emptyCache: BlogCache = {
      posts: [],
      tags: [],
      generatedAt: new Date().toISOString(),
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(emptyCache, null, 2))
    console.log('Created empty blog cache.')
    return
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  console.log(`Found ${files.length} markdown files to process.`)

  const posts: BlogPost[] = []

  for (const file of files) {
    console.log(`  Processing: ${file}`)
    const filePath = path.join(BLOG_DIR, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const frontmatterResult = BlogPostFrontmatterSchema.safeParse(data)
    if (!frontmatterResult.success) {
      console.warn(`  Skipping ${file}: Invalid frontmatter`)
      console.warn(`    ${frontmatterResult.error.format()}`)
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

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Extract unique tags
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  const cache: BlogCache = {
    posts,
    tags,
    generatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\nBlog cache built successfully in ${duration}s`)
  console.log(`  Posts: ${posts.length}`)
  console.log(`  Tags: ${tags.length}`)
  console.log(`  Output: ${CACHE_FILE}`)
}

main().catch((error) => {
  console.error('Failed to build blog cache:', error)
  process.exit(1)
})
