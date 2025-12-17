# Data Model: SEO Optimization

**Feature**: SEO Optimization for All Pages
**Date**: 2025-12-17
**Status**: Complete

## Overview

This document defines the data schemas for SEO meta tags, Open Graph, Twitter Cards, and JSON-LD structured data. All schemas are implemented as TypeScript types for use with TanStack Start's `head()` function.

## Site-Level Constants

### Site Metadata (`app/lib/seo/constants.ts`)

```typescript
export const SITE_CONFIG = {
  name: 'Christophe Seguinot',
  title: 'Christophe Seguinot | Senior Frontend Developer',
  description: 'Senior Frontend Developer with 12+ years of experience building enterprise-scale React/TypeScript applications.',
  url: 'https://seguinot.io',
  locale: 'en_US',
  author: {
    name: 'Christophe Seguinot',
    jobTitle: 'Senior Frontend Developer',
    email: 'christophe.seguinot@gmail.com',
    linkedIn: 'https://linkedin.com/in/christophe-seguinot',
    github: 'https://github.com/ledahu05',
  },
  images: {
    default: '/images/og/default.png',
    profile: '/images/profile.jpg',
  },
} as const;
```

## Meta Tag Schemas

### Base Page Meta Configuration

```typescript
/**
 * Configuration for generating page meta tags
 */
export interface PageMetaConfig {
  /** Page title (will be suffixed with site name) */
  title: string;
  /** Meta description (150-160 characters recommended) */
  description: string;
  /** Canonical URL path (relative, e.g., '/blog/my-article') */
  path: string;
  /** Open Graph type */
  type?: 'website' | 'article' | 'profile';
  /** Custom OG image URL (absolute or relative) */
  image?: string;
  /** Article-specific metadata */
  article?: ArticleMetadata;
  /** Disable indexing for this page */
  noIndex?: boolean;
}

/**
 * Article-specific metadata for blog posts
 */
export interface ArticleMetadata {
  /** ISO 8601 publication date */
  publishedTime: string;
  /** ISO 8601 modification date */
  modifiedTime?: string;
  /** Author name */
  author: string;
  /** Article tags/categories */
  tags: string[];
  /** Estimated reading time in minutes */
  readingTime?: number;
}
```

### Generated Meta Tag Structure

```typescript
/**
 * TanStack Start meta tag format
 */
export type MetaTag =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string };

/**
 * Complete head configuration for TanStack Start
 */
export interface HeadConfig {
  meta: MetaTag[];
  links?: Array<{ rel: string; href: string }>;
  scripts?: Array<{
    type?: string;
    children?: string;
    src?: string;
  }>;
}
```

## JSON-LD Structured Data Schemas

### Person Schema (Homepage)

```typescript
/**
 * Schema.org Person for portfolio owner
 */
export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  url: string;
  email?: string;
  sameAs?: string[];
  knowsAbout?: string[];
  image?: string;
  description?: string;
}

// Example instance
const personSchema: PersonSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Christophe Seguinot',
  jobTitle: 'Senior Frontend Developer',
  url: 'https://seguinot.io',
  email: 'christophe.seguinot@gmail.com',
  sameAs: [
    'https://linkedin.com/in/christophe-seguinot',
    'https://github.com/ledahu05',
  ],
  knowsAbout: [
    'React',
    'TypeScript',
    'Frontend Development',
    'Redux Toolkit',
    'TanStack',
  ],
  description: 'Senior Frontend Developer with 12+ years of experience building enterprise-scale React/TypeScript applications.',
};
```

### Article Schema (Blog Posts)

```typescript
/**
 * Schema.org Article for blog posts
 */
export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  image?: string;
  keywords?: string[];
}

// Example instance
const articleSchema: ArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Building a Git-Based Blog with TanStack Start',
  description: 'A deep dive into building a markdown-powered blog...',
  datePublished: '2025-12-17',
  author: {
    '@type': 'Person',
    name: 'Christophe Seguinot',
    url: 'https://seguinot.io',
  },
  publisher: {
    '@type': 'Person',
    name: 'Christophe Seguinot',
    url: 'https://seguinot.io',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://seguinot.io/blog/building-the-blog-feature',
  },
  keywords: ['react', 'tanstack', 'markdown', 'typescript'],
};
```

### WebSite Schema (Site-wide)

```typescript
/**
 * Schema.org WebSite for site information
 */
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  author: {
    '@type': 'Person';
    name: string;
  };
}

// Example instance
const webSiteSchema: WebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Christophe Seguinot Portfolio',
  url: 'https://seguinot.io',
  description: 'Portfolio of Christophe Seguinot, Senior Frontend Developer',
  author: {
    '@type': 'Person',
    name: 'Christophe Seguinot',
  },
};
```

### CollectionPage Schema (Blog Listing)

```typescript
/**
 * Schema.org CollectionPage for blog listing
 */
export interface CollectionPageSchema {
  '@context': 'https://schema.org';
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  mainEntity: {
    '@type': 'ItemList';
    numberOfItems: number;
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      url: string;
      name: string;
    }>;
  };
}
```

### SoftwareApplication Schema (Quarto Game)

```typescript
/**
 * Schema.org SoftwareApplication for Quarto game
 */
export interface GameSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: 'GameApplication';
  description: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  author: {
    '@type': 'Person';
    name: string;
  };
}

// Example instance
const quartoGameSchema: GameSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Quarto',
  applicationCategory: 'GameApplication',
  description: 'A strategic board game where players must align four pieces sharing a common attribute. Play locally, against AI, or online with friends.',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Christophe Seguinot',
  },
};
```

## Page-Specific Meta Configurations

### Homepage (`/`)

```typescript
const homepageMeta: PageMetaConfig = {
  title: 'Senior Frontend Developer',
  description: 'Senior Frontend Developer with 12+ years of experience building enterprise-scale React/TypeScript applications. View my projects, skills, and professional experience.',
  path: '/',
  type: 'profile',
};
```

### Blog Listing (`/blog`)

```typescript
const blogListingMeta: PageMetaConfig = {
  title: 'Blog',
  description: 'Articles about frontend development, React, TypeScript, and building modern web applications.',
  path: '/blog',
  type: 'website',
};
```

### Blog Article (`/blog/$slug`)

```typescript
// Dynamic from loader data
const blogArticleMeta = (post: BlogPost): PageMetaConfig => ({
  title: post.title,
  description: post.summary,
  path: `/blog/${post.slug}`,
  type: 'article',
  article: {
    publishedTime: post.date,
    author: post.author ?? SITE_CONFIG.author.name,
    tags: post.tags,
    readingTime: post.readingTime,
  },
});
```

### Quarto Game Pages

```typescript
const quartoIndexMeta: PageMetaConfig = {
  title: 'Quarto Game',
  description: 'Play Quarto, the strategic board game of shared attributes. Choose from local multiplayer, AI opponent, or online play with friends.',
  path: '/games/quarto',
  type: 'website',
};

const quartoPlayMeta: PageMetaConfig = {
  title: 'Play Quarto',
  description: 'Currently playing Quarto. Align four pieces with a shared attribute to win!',
  path: '/games/quarto/play',
  type: 'website',
  noIndex: true, // Game session, not indexable
};

const quartoOnlineMeta: PageMetaConfig = {
  title: 'Online Quarto',
  description: 'Play Quarto online with friends. Share a room code and compete in real-time.',
  path: '/games/quarto/online',
  type: 'website',
  noIndex: true, // Dynamic room, not indexable
};

const quartoJoinMeta: PageMetaConfig = {
  title: 'Join Quarto Game',
  description: 'Join an online Quarto game with a room code.',
  path: '/games/quarto/join',
  type: 'website',
  noIndex: true, // Join flow, not indexable
};

const quartoRulesMeta: PageMetaConfig = {
  title: 'Quarto Rules',
  description: 'Learn how to play Quarto in 2 minutes. Understand the rules, piece attributes, and winning strategies.',
  path: '/games/quarto/rules',
  type: 'website',
};
```

## Open Graph Image Requirements

### Default OG Image (`/data/images/og/default.png`)

| Property | Requirement |
|----------|-------------|
| Dimensions | 1200 x 630 pixels |
| Format | PNG or JPG |
| Max file size | < 1MB |
| Content | Portfolio branding, name, title |

### Design Guidelines

- Include portfolio owner's name prominently
- Use consistent brand colors (from Tailwind theme)
- Include job title or tagline
- High contrast for readability on social platforms
- Safe zone: Keep important content within 1100x580px center

## Validation Rules

### Title Tag

- Minimum length: 10 characters
- Maximum length: 60 characters
- Must be unique across pages
- Should contain primary keyword

### Meta Description

- Minimum length: 50 characters
- Maximum length: 160 characters
- Must be unique across pages
- Should be compelling and action-oriented

### Canonical URL

- Must be absolute URL
- Must use HTTPS
- Must match the served page
- No trailing slash (consistency)

### JSON-LD

- Must be valid JSON
- Must pass Google Rich Results Test
- Must include required properties for schema type
- Dates in ISO 8601 format

## Migration Notes

### Current Routes Requiring Updates

| Route | Has head() | OG Tags | JSON-LD | Action |
|-------|-----------|---------|---------|--------|
| `__root.tsx` | Yes | Partial | No | Enhance |
| `index.tsx` | No | No | No | Add full |
| `blog/index.tsx` | Yes | Partial | No | Enhance |
| `blog/$slug.tsx` | Yes | Partial | No | Enhance |
| `games/quarto/index.tsx` | No | No | No | Add full |
| `games/quarto/play.tsx` | No | No | No | Add (noIndex) |
| `games/quarto/online.tsx` | No | No | No | Add (noIndex) |
| `games/quarto/join.tsx` | No | No | No | Add (noIndex) |
| `games/quarto/rules.tsx` | No | No | No | Add full |
