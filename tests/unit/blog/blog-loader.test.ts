import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs'
import {
  getBlogPosts,
  getBlogIndex,
  getBlogPostBySlug,
  getBlogPostsByTag,
  getAllTags,
  clearBlogCache,
} from '../../../app/lib/data/blog-loader'

// Mock fs module
vi.mock('fs')

const mockFsExistsSync = vi.mocked(fs.existsSync)
const mockFsReaddirSync = vi.mocked(fs.readdirSync) as ReturnType<typeof vi.fn>
const mockFsReadFileSync = vi.mocked(fs.readFileSync)

describe('blog-loader', () => {
  const samplePost1 = `---
title: "First Post"
date: "2025-01-15"
summary: "This is the first test post summary."
tags:
  - react
  - typescript
author: "Test Author"
---

# First Post

This is the content of the first post.

\`\`\`typescript
const code = 'example'
\`\`\`

More content here.
`

  const samplePost2 = `---
title: "Second Post"
date: "2025-01-10"
summary: "This is the second test post summary."
tags:
  - javascript
---

# Second Post

This is the content of the second post.
`

  const samplePost3 = `---
title: "Third Post"
date: "2025-01-20"
summary: "This is the third test post summary."
tags:
  - react
  - tutorial
---

# Third Post

Content for the third post.
`

  beforeEach(() => {
    clearBlogCache()
    vi.resetAllMocks()

    // Default mock setup
    mockFsExistsSync.mockReturnValue(true)
    mockFsReaddirSync.mockReturnValue([
      'first-post.md',
      'second-post.md',
      'third-post.md',
    ])
    mockFsReadFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor) => {
      const pathStr = filePath.toString()
      if (pathStr.includes('first-post.md')) return samplePost1
      if (pathStr.includes('second-post.md')) return samplePost2
      if (pathStr.includes('third-post.md')) return samplePost3
      return ''
    })
  })

  afterEach(() => {
    clearBlogCache()
  })

  describe('getBlogPosts', () => {
    it(
      'returns posts sorted by date (newest first)',
      async () => {
        const posts = await getBlogPosts()

        expect(posts).toHaveLength(3)
        expect(posts[0].slug).toBe('third-post') // 2025-01-20
        expect(posts[1].slug).toBe('first-post') // 2025-01-15
        expect(posts[2].slug).toBe('second-post') // 2025-01-10
      },
      { timeout: 30000 }
    )

    it('excludes content and contentHtml from previews', async () => {
      const posts = await getBlogPosts()

      posts.forEach((post) => {
        expect(post).not.toHaveProperty('content')
        expect(post).not.toHaveProperty('contentHtml')
      })
    })

    it('includes all preview fields', async () => {
      const posts = await getBlogPosts()

      expect(posts[0]).toHaveProperty('slug')
      expect(posts[0]).toHaveProperty('title')
      expect(posts[0]).toHaveProperty('date')
      expect(posts[0]).toHaveProperty('summary')
      expect(posts[0]).toHaveProperty('readingTime')
      expect(posts[0]).toHaveProperty('tags')
    })

    it('returns empty array when blog directory does not exist', async () => {
      mockFsExistsSync.mockReturnValue(false)

      const posts = await getBlogPosts()
      expect(posts).toEqual([])
    })

    it('filters out non-markdown files', async () => {
      mockFsReaddirSync.mockReturnValue([
        'first-post.md',
        'README.txt',
        'image.png',
      ])
      mockFsReadFileSync.mockReturnValue(samplePost1)

      const posts = await getBlogPosts()
      expect(posts).toHaveLength(1)
    })

    it('uses cache on subsequent calls', async () => {
      await getBlogPosts()
      await getBlogPosts()

      // Should only read directory once due to caching
      expect(mockFsReaddirSync).toHaveBeenCalledTimes(1)
    })
  })

  describe('getBlogIndex', () => {
    it('returns posts and tags', async () => {
      const index = await getBlogIndex()

      expect(index.posts).toHaveLength(3)
      expect(index.tags).toContain('react')
      expect(index.tags).toContain('typescript')
      expect(index.tags).toContain('javascript')
      expect(index.tags).toContain('tutorial')
      expect(index.totalCount).toBe(3)
    })

    it('returns sorted tags', async () => {
      const index = await getBlogIndex()

      const sortedTags = [...index.tags].sort()
      expect(index.tags).toEqual(sortedTags)
    })
  })

  describe('getBlogPostBySlug', () => {
    it('returns full post with content for valid slug', async () => {
      const post = await getBlogPostBySlug('first-post')

      expect(post).not.toBeNull()
      expect(post?.slug).toBe('first-post')
      expect(post?.title).toBe('First Post')
      expect(post?.content).toContain('# First Post')
      expect(post?.contentHtml).toContain('<h1')
    })

    it('returns null for non-existent slug', async () => {
      const post = await getBlogPostBySlug('non-existent')
      expect(post).toBeNull()
    })

    it('includes processed HTML content', async () => {
      const post = await getBlogPostBySlug('first-post')

      expect(post?.contentHtml).toBeTruthy()
      expect(post?.contentHtml).toContain('<h1')
      expect(post?.contentHtml).toContain('<p>')
    })

    it('calculates reading time correctly', async () => {
      const post = await getBlogPostBySlug('first-post')
      expect(post?.readingTime).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getBlogPostsByTag', () => {
    it('returns posts matching the tag', async () => {
      const posts = await getBlogPostsByTag('react')

      expect(posts).toHaveLength(2)
      expect(posts.every((p) => p.tags.includes('react'))).toBe(true)
    })

    it('returns empty array for non-existent tag', async () => {
      const posts = await getBlogPostsByTag('non-existent-tag')
      expect(posts).toEqual([])
    })

    it('returns posts sorted by date', async () => {
      const posts = await getBlogPostsByTag('react')

      // third-post (2025-01-20) should be before first-post (2025-01-15)
      expect(posts[0].slug).toBe('third-post')
      expect(posts[1].slug).toBe('first-post')
    })
  })

  describe('getAllTags', () => {
    it('returns all unique tags', async () => {
      const tags = await getAllTags()

      expect(tags).toContain('react')
      expect(tags).toContain('typescript')
      expect(tags).toContain('javascript')
      expect(tags).toContain('tutorial')
    })

    it('returns tags sorted alphabetically', async () => {
      const tags = await getAllTags()

      const sortedTags = [...tags].sort()
      expect(tags).toEqual(sortedTags)
    })

    it('does not include duplicates', async () => {
      const tags = await getAllTags()

      const uniqueTags = [...new Set(tags)]
      expect(tags).toEqual(uniqueTags)
    })
  })

  describe('clearBlogCache', () => {
    it('clears the cache forcing reload', async () => {
      await getBlogPosts()
      expect(mockFsReaddirSync).toHaveBeenCalledTimes(1)

      clearBlogCache()
      await getBlogPosts()

      expect(mockFsReaddirSync).toHaveBeenCalledTimes(2)
    })
  })

  describe('frontmatter validation', () => {
    it('skips posts with invalid frontmatter', async () => {
      // Empty title and invalid date format should trigger validation errors
      const invalidPost = `---
title: ""
date: "not-a-date"
summary: "x"
---

Content
`
      // Reset everything to ensure fresh state
      clearBlogCache()
      vi.clearAllMocks()

      mockFsExistsSync.mockReturnValue(true)
      mockFsReaddirSync.mockReturnValue([
        'only-invalid-post.md',
      ])
      mockFsReadFileSync.mockReturnValue(invalidPost)

      const posts = await getBlogPosts()
      // Invalid posts should be skipped, so we get empty array
      expect(posts).toHaveLength(0)
    })

    it('includes valid posts and skips invalid ones', async () => {
      // Reset everything to ensure fresh state
      clearBlogCache()
      vi.clearAllMocks()

      const validPost = `---
title: "Valid Post"
date: "2025-01-15"
summary: "This is a valid post with proper frontmatter."
tags: []
---

Valid content here.
`
      mockFsExistsSync.mockReturnValue(true)
      mockFsReaddirSync.mockReturnValue([
        'valid-only.md',
      ])
      mockFsReadFileSync.mockReturnValue(validPost)

      const posts = await getBlogPosts()
      expect(posts).toHaveLength(1)
      expect(posts[0].title).toBe('Valid Post')
    })
  })

  describe('markdown processing', () => {
    it('processes GFM features (tables, strikethrough)', async () => {
      const gfmPost = `---
title: "GFM Post"
date: "2025-01-15"
summary: "Testing GitHub Flavored Markdown features."
tags: []
---

~~strikethrough~~

| Header |
|--------|
| Cell   |
`
      mockFsReaddirSync.mockReturnValue(['gfm-post.md'])
      mockFsReadFileSync.mockReturnValue(gfmPost)

      const post = await getBlogPostBySlug('gfm-post')

      expect(post?.contentHtml).toContain('<del>')
      expect(post?.contentHtml).toContain('<table>')
    })

    it('adds ids to headings', async () => {
      const post = await getBlogPostBySlug('first-post')
      expect(post?.contentHtml).toMatch(/<h1[^>]*id="[^"]+"/i)
    })
  })
})
