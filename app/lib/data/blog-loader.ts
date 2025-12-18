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
import {
  BlogPostFrontmatterSchema,
  type BlogPost,
  type BlogPostPreview,
  type BlogIndex,
} from '../schemas/blog.schema'
import { calculateReadingTime } from '../utils/reading-time'

interface BlogCache {
  posts: BlogPost[]
  tags: string[]
  generatedAt: string
}

/**
 * Get the blog directory path.
 * Works in both local dev (process.cwd()) and Vercel deployment.
 */
function getBlogDir(): string {
  // Try process.cwd() first (works in local dev)
  const cwdPath = path.join(process.cwd(), 'data/blog')
  if (fs.existsSync(cwdPath)) {
    return cwdPath
  }

  // Vercel serverless: blog folder is copied to function root
  const vercelPath = '/var/task/blog'
  if (fs.existsSync(vercelPath)) {
    return vercelPath
  }

  // Return cwd path for error messaging
  return cwdPath
}

/**
 * Get the blog cache file path.
 * Works in both local dev and Vercel deployment.
 */
function getBlogCachePath(): string | null {
  // Try process.cwd() first (works in local dev and build)
  const cwdPath = path.join(process.cwd(), 'data/blog-cache/index.json')
  if (fs.existsSync(cwdPath)) {
    return cwdPath
  }

  // Vercel serverless: cache folder is copied to function root
  const vercelPath = '/var/task/blog-cache/index.json'
  if (fs.existsSync(vercelPath)) {
    return vercelPath
  }

  return null
}

/**
 * Try to load posts from pre-built cache.
 * Returns null if cache doesn't exist (development mode).
 */
function loadFromCache(): BlogPost[] | null {
  const cachePath = getBlogCachePath()
  if (!cachePath) {
    return null
  }

  try {
    const cacheContent = fs.readFileSync(cachePath, 'utf-8')
    const cache: BlogCache = JSON.parse(cacheContent)
    console.log(`Loaded ${cache.posts.length} posts from cache (built: ${cache.generatedAt})`)
    return cache.posts
  } catch (error) {
    console.warn('Failed to load blog cache:', error)
    return null
  }
}

let cachedPosts: BlogPost[] | null = null

/**
 * Process markdown content to HTML using unified pipeline.
 * Includes GFM support (tables, strikethrough, task lists), heading anchors,
 * and syntax highlighting via Shiki.
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

/**
 * Load and process all blog posts from the data/blog directory.
 * Uses pre-built cache if available (production), falls back to runtime processing (development).
 */
async function loadAllPosts(): Promise<BlogPost[]> {
  if (cachedPosts) return cachedPosts

  // Try to load from pre-built cache first (fast path for production)
  const fromCache = loadFromCache()
  if (fromCache) {
    cachedPosts = fromCache
    return cachedPosts
  }

  // Fall back to runtime processing (development mode)
  console.log('No blog cache found, processing markdown at runtime...')
  const blogDir = getBlogDir()

  // Check if blog directory exists
  if (!fs.existsSync(blogDir)) {
    console.warn(`Blog directory not found: ${blogDir}`)
    cachedPosts = []
    return cachedPosts
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))
  const posts: BlogPost[] = []

  for (const file of files) {
    const filePath = path.join(blogDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const frontmatterResult = BlogPostFrontmatterSchema.safeParse(data)
    if (!frontmatterResult.success) {
      console.warn(
        `Invalid frontmatter in ${file}:`,
        frontmatterResult.error.format()
      )
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
  cachedPosts = posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return cachedPosts
}

/**
 * Get all blog posts for the listing page.
 * Returns posts sorted by date (newest first).
 * Excludes content for performance.
 */
export async function getBlogPosts(): Promise<BlogPostPreview[]> {
  const posts = await loadAllPosts()
  return posts.map(({ content, contentHtml, ...preview }) => preview)
}

/**
 * Get the full blog index with tag list.
 */
export async function getBlogIndex(): Promise<BlogIndex> {
  const posts = await getBlogPosts()
  const tags = await getAllTags()

  return {
    posts,
    tags,
    totalCount: posts.length,
  }
}

/**
 * Get a single blog post by slug.
 * Returns null if post not found.
 * Includes full processed HTML content.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

/**
 * Get posts filtered by tag.
 * Returns posts sorted by date (newest first).
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPostPreview[]> {
  const posts = await getBlogPosts()
  return posts.filter((p) => p.tags.includes(tag))
}

/**
 * Get all unique tags across all posts.
 * Returns tags sorted alphabetically.
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await loadAllPosts()
  const tags = new Set(posts.flatMap((p) => p.tags))
  return Array.from(tags).sort()
}

/**
 * Clear the cached posts (useful for development/testing).
 */
export function clearBlogCache(): void {
  cachedPosts = null
}

/**
 * Get all posts with full content (for article pages).
 * Used by server functions to fetch complete post data.
 */
export async function loadAllPostsWithContent(): Promise<BlogPost[]> {
  return loadAllPosts()
}
