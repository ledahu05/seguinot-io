import { describe, it, expect } from 'vitest'
import {
  BlogPostFrontmatterSchema,
  BlogPostSchema,
  BlogPostPreviewSchema,
  BlogIndexSchema,
} from '../../../app/lib/schemas/blog.schema'

describe('BlogPostFrontmatterSchema', () => {
  const validFrontmatter = {
    title: 'Test Article',
    date: '2025-01-15',
    summary: 'A brief summary of the test article for SEO purposes.',
  }

  it('validates correct frontmatter', () => {
    const result = BlogPostFrontmatterSchema.safeParse(validFrontmatter)
    expect(result.success).toBe(true)
  })

  it('provides default empty array for tags when not provided', () => {
    const result = BlogPostFrontmatterSchema.parse(validFrontmatter)
    expect(result.tags).toEqual([])
  })

  it('validates tags when provided', () => {
    const withTags = { ...validFrontmatter, tags: ['react', 'typescript'] }
    const result = BlogPostFrontmatterSchema.parse(withTags)
    expect(result.tags).toEqual(['react', 'typescript'])
  })

  it('validates optional featuredImage with URL', () => {
    const withImage = {
      ...validFrontmatter,
      featuredImage: 'https://example.com/image.jpg',
    }
    const result = BlogPostFrontmatterSchema.safeParse(withImage)
    expect(result.success).toBe(true)
  })

  it('validates optional featuredImage with local path', () => {
    const withImage = {
      ...validFrontmatter,
      featuredImage: '/images/blog/cover.jpg',
    }
    const result = BlogPostFrontmatterSchema.safeParse(withImage)
    expect(result.success).toBe(true)
  })

  it('validates optional author field', () => {
    const withAuthor = { ...validFrontmatter, author: 'Chris Séguinot' }
    const result = BlogPostFrontmatterSchema.parse(withAuthor)
    expect(result.author).toBe('Chris Séguinot')
  })

  describe('title validation', () => {
    it('rejects empty title', () => {
      const invalid = { ...validFrontmatter, title: '' }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects title over 100 characters', () => {
      const invalid = { ...validFrontmatter, title: 'a'.repeat(101) }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('accepts title at exactly 100 characters', () => {
      const valid = { ...validFrontmatter, title: 'a'.repeat(100) }
      const result = BlogPostFrontmatterSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('date validation', () => {
    it('rejects invalid date format', () => {
      const invalid = { ...validFrontmatter, date: '01-15-2025' }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects date with wrong separator', () => {
      const invalid = { ...validFrontmatter, date: '2025/01/15' }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('accepts valid YYYY-MM-DD format', () => {
      const valid = { ...validFrontmatter, date: '2025-12-31' }
      const result = BlogPostFrontmatterSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('summary validation', () => {
    it('rejects summary under 10 characters', () => {
      const invalid = { ...validFrontmatter, summary: 'Short' }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects summary over 160 characters', () => {
      const invalid = { ...validFrontmatter, summary: 'a'.repeat(161) }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('accepts summary at exactly 160 characters', () => {
      const valid = { ...validFrontmatter, summary: 'a'.repeat(160) }
      const result = BlogPostFrontmatterSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('tags validation', () => {
    it('rejects empty string tags', () => {
      const invalid = { ...validFrontmatter, tags: ['valid', ''] }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects tags over 30 characters', () => {
      const invalid = { ...validFrontmatter, tags: ['a'.repeat(31)] }
      const result = BlogPostFrontmatterSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})

describe('BlogPostSchema', () => {
  const validPost = {
    slug: 'test-article',
    title: 'Test Article',
    date: '2025-01-15',
    summary: 'A brief summary of the test article.',
    content: '# Test\n\nThis is the raw markdown content.',
    contentHtml: '<h1>Test</h1>\n<p>This is the raw markdown content.</p>',
    readingTime: 1,
    tags: ['test'],
  }

  it('validates correct blog post', () => {
    const result = BlogPostSchema.safeParse(validPost)
    expect(result.success).toBe(true)
  })

  describe('slug validation', () => {
    it('rejects slug with uppercase letters', () => {
      const invalid = { ...validPost, slug: 'Test-Article' }
      const result = BlogPostSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects slug with spaces', () => {
      const invalid = { ...validPost, slug: 'test article' }
      const result = BlogPostSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects slug with special characters', () => {
      const invalid = { ...validPost, slug: 'test_article!' }
      const result = BlogPostSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('accepts slug with numbers', () => {
      const valid = { ...validPost, slug: 'article-2025-01' }
      const result = BlogPostSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('readingTime validation', () => {
    it('rejects zero reading time', () => {
      const invalid = { ...validPost, readingTime: 0 }
      const result = BlogPostSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects negative reading time', () => {
      const invalid = { ...validPost, readingTime: -1 }
      const result = BlogPostSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects non-integer reading time', () => {
      const invalid = { ...validPost, readingTime: 1.5 }
      const result = BlogPostSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})

describe('BlogPostPreviewSchema', () => {
  it('excludes content and contentHtml fields', () => {
    const preview = {
      slug: 'test-article',
      title: 'Test Article',
      date: '2025-01-15',
      summary: 'A brief summary of the test article.',
      readingTime: 1,
      tags: ['test'],
    }
    const result = BlogPostPreviewSchema.safeParse(preview)
    expect(result.success).toBe(true)
  })

  it('strips content fields if provided', () => {
    const withContent = {
      slug: 'test-article',
      title: 'Test Article',
      date: '2025-01-15',
      summary: 'A brief summary of the test article.',
      readingTime: 1,
      tags: ['test'],
      content: 'should be stripped',
      contentHtml: '<p>should be stripped</p>',
    }
    const result = BlogPostPreviewSchema.parse(withContent)
    expect(result).not.toHaveProperty('content')
    expect(result).not.toHaveProperty('contentHtml')
  })
})

describe('BlogIndexSchema', () => {
  it('validates correct blog index', () => {
    const index = {
      posts: [
        {
          slug: 'test-article',
          title: 'Test Article',
          date: '2025-01-15',
          summary: 'A brief summary of the test article.',
          readingTime: 1,
          tags: ['test'],
        },
      ],
      tags: ['test', 'react'],
      totalCount: 1,
    }
    const result = BlogIndexSchema.safeParse(index)
    expect(result.success).toBe(true)
  })

  it('allows empty posts array', () => {
    const index = {
      posts: [],
      tags: [],
      totalCount: 0,
    }
    const result = BlogIndexSchema.safeParse(index)
    expect(result.success).toBe(true)
  })

  it('rejects negative totalCount', () => {
    const invalid = {
      posts: [],
      tags: [],
      totalCount: -1,
    }
    const result = BlogIndexSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})
