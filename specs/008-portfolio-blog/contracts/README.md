# API Contracts: Portfolio Blog Section

**Feature**: 008-portfolio-blog
**Date**: 2025-12-15

## No API Contracts Required

This feature is a **static site implementation** with no backend API. All data processing occurs at build time.

### Why No API Contracts?

1. **Static content**: Blog posts are markdown files processed at build time
2. **No runtime API**: All data is pre-computed and embedded in the built application
3. **Client-side only**: The blog uses TanStack Router's file-based routing with data loaders

### Data Flow

```
Build Time:
  /data/blog/*.md → blog-loader.ts → Pre-computed JSON → Built static files

Request Time:
  Client request → Static HTML/JS → Rendered React components
```

### Alternative: Data Loader Interface

Instead of REST/GraphQL contracts, the blog uses TypeScript interfaces for data loading functions. These are documented in [data-model.md](../data-model.md):

```typescript
// Data loading interface (not HTTP API)
function getBlogPosts(): BlogPostPreview[]
function getBlogPostBySlug(slug: string): BlogPost | null
function getBlogPostsByTag(tag: string): BlogPostPreview[]
function getAllTags(): string[]
```

### Future Consideration

If the blog were to add dynamic features (comments, search, etc.), API contracts would be added here:

- `POST /api/comments` - Add comment
- `GET /api/search?q=query` - Full-text search

These are currently **out of scope** per the feature specification.
