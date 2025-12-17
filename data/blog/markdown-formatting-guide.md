---
title: "The Complete Guide to Markdown Formatting"
date: "2025-12-15"
summary: "A comprehensive showcase of all markdown formatting options supported by this blog, from basic text styling to advanced code blocks."
tags:
  - markdown
  - tutorial
  - formatting
author: "Chris Séguinot"
---

# The Complete Guide to Markdown Formatting

Welcome to this comprehensive guide showcasing all the markdown formatting capabilities supported by this blog. Whether you're writing technical tutorials, sharing thoughts, or documenting projects, this reference will help you create beautifully formatted content.

## Heading Hierarchy

Headings help organize your content and create a clear structure. Here's the full hierarchy:

# Heading 1 - Main Title
## Heading 2 - Major Section
### Heading 3 - Subsection
#### Heading 4 - Sub-subsection
##### Heading 5 - Detail Level
###### Heading 6 - Finest Detail

---

## Text Formatting

Markdown supports various text styling options:

- **Bold text** is created with double asterisks
- *Italic text* uses single asterisks
- ***Bold and italic*** combines both with triple asterisks
- ~~Strikethrough~~ uses double tildes
- `Inline code` is wrapped in backticks
- You can also combine styles: ***~~bold italic strikethrough~~***

Here's a regular paragraph demonstrating flow. The text wraps naturally and maintains readability across different screen sizes. Good writing uses proper punctuation, varied sentence lengths, and clear structure.

---

## Code Blocks

Code blocks are essential for technical content. Here are examples in various languages:

### TypeScript (React Component)

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function Button({ variant, children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }), disabled && 'opacity-50')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### JavaScript (Async Function)

```javascript
async function fetchBlogPosts(tag) {
  const response = await fetch(`/api/posts?tag=${encodeURIComponent(tag)}`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.posts.map(post => ({
    ...post,
    date: new Date(post.date)
  }))
}
```

### CSS (Tailwind-style)

```css
/* Custom prose styling for blog articles */
.prose {
  @apply text-foreground leading-relaxed;
}

.prose h1 {
  @apply text-4xl font-bold mt-8 mb-4;
}

.prose h2 {
  @apply text-3xl font-semibold mt-6 mb-3;
}

.prose code {
  @apply bg-muted px-1.5 py-0.5 rounded text-sm;
}
```

### Bash / Shell Commands

```bash
# Clone the repository
git clone https://github.com/username/portfolio-2025.git
cd portfolio-2025

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### JSON Configuration

```json
{
  "name": "portfolio-2025",
  "version": "1.0.0",
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "@tanstack/react-router": "^1.132.0"
  }
}
```

### Python

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class BlogPost:
    slug: str
    title: str
    summary: str
    content: str
    date: datetime
    tags: List[str]
    author: Optional[str] = None

    @property
    def reading_time(self) -> int:
        words = len(self.content.split())
        return max(1, words // 200)

    def to_dict(self) -> dict:
        return {
            'slug': self.slug,
            'title': self.title,
            'readingTime': self.reading_time
        }
```

---

## Blockquotes

Blockquotes are great for highlighting important information or quoting sources.

> This is a simple blockquote. It's useful for emphasizing key points or providing context.

> **Nested blockquotes** work too:
>
> > This is a nested quote within a quote.
> > It can contain multiple paragraphs.
>
> And then return to the outer level.

> "The best way to predict the future is to invent it."
>
> — Alan Kay

---

## Lists

### Unordered Lists

- First item in the list
- Second item with more detail
- Third item
  - Nested item under third
  - Another nested item
    - Even deeper nesting
- Fourth item back at root level

### Ordered Lists

1. First step: Set up your development environment
2. Second step: Install dependencies
3. Third step: Configure your project
   1. Create configuration files
   2. Set environment variables
   3. Initialize the database
4. Fourth step: Start building!

### Task Lists (GFM)

- [x] Set up project structure
- [x] Install dependencies
- [x] Create blog schema
- [ ] Add syntax highlighting
- [ ] Implement tag filtering
- [ ] Write documentation

---

## Links and Images

### Inline Links

Visit the [React documentation](https://react.dev) to learn more about building user interfaces.

Here's a link with a title attribute: [TanStack Router](https://tanstack.com/router "The best React router").

### Reference-Style Links

For repeated links, use reference-style: Check out [MDN][mdn] for web documentation, or read more on [MDN][mdn] later.

[mdn]: https://developer.mozilla.org "Mozilla Developer Network"

### URLs and Email

Autolinked URL: https://github.com

Email: contact@example.com

---

## Tables

### Simple Table

| Feature | Status | Priority |
|---------|--------|----------|
| Blog Listing | Complete | P1 |
| Article Pages | Complete | P1 |
| Tag Filtering | Pending | P3 |

### Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text | Text | Text |
| More text | More text | More text |
| Even more | Even more | Even more |

### Table with Code

| Function | Description | Returns |
|----------|-------------|---------|
| `getBlogPosts()` | Fetch all posts | `BlogPostPreview[]` |
| `getBlogPostBySlug(slug)` | Fetch single post | `BlogPost \| null` |
| `getAllTags()` | Get unique tags | `string[]` |

---

## Horizontal Rules

Use three or more dashes, asterisks, or underscores to create horizontal rules:

---

Content above the rule.

***

Content between rules.

___

Content after all rules.

---

## Advanced Features

### Footnotes

Here's a sentence with a footnote[^1]. You can also use named footnotes[^note].

[^1]: This is the first footnote content.
[^note]: Named footnotes can be more descriptive.

### Definition Lists (if supported)

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Can have multiple definitions

### Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium

---

## Emoji Support

GitHub Flavored Markdown supports emoji shortcodes:

- :rocket: Rocket for launches
- :sparkles: Sparkles for new features
- :bug: Bug for fixes
- :books: Books for documentation

Or use native emoji: 🚀 ✨ 🐛 📚

---

## Summary

This guide covered all the major markdown formatting options:

1. **Headings** (h1-h6) for structure
2. **Text formatting** (bold, italic, strikethrough, code)
3. **Code blocks** with syntax highlighting
4. **Blockquotes** for emphasis
5. **Lists** (unordered, ordered, task lists)
6. **Links and images** for references
7. **Tables** for structured data
8. **Horizontal rules** for separation
9. **Advanced features** like footnotes

Use this article as a reference when writing your own blog posts!
