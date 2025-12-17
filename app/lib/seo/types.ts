/**
 * SEO TypeScript Types
 * Type definitions for meta tags and structured data
 */

/**
 * TanStack Start meta tag format
 */
export type MetaTag =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string }

/**
 * Complete head configuration for TanStack Start
 */
export interface HeadConfig {
  meta: MetaTag[]
  links?: Array<{ rel: string; href: string }>
  scripts?: Array<{
    type?: string
    children?: string
    src?: string
  }>
}

/**
 * Article-specific metadata for blog posts
 */
export interface ArticleMetadata {
  /** ISO 8601 publication date */
  publishedTime: string
  /** ISO 8601 modification date */
  modifiedTime?: string
  /** Author name */
  author: string
  /** Article tags/categories */
  tags: string[]
  /** Estimated reading time in minutes */
  readingTime?: number
}

/**
 * Configuration for generating page meta tags
 */
export interface PageMetaConfig {
  /** Page title (will be suffixed with site name) */
  title: string
  /** Meta description (150-160 characters recommended) */
  description: string
  /** Canonical URL path (relative, e.g., '/blog/my-article') */
  path: string
  /** Open Graph type */
  type?: 'website' | 'article' | 'profile'
  /** Custom OG image URL (absolute or relative) */
  image?: string
  /** Article-specific metadata */
  article?: ArticleMetadata
  /** Disable indexing for this page */
  noIndex?: boolean
}

/**
 * Schema.org Person for portfolio owner
 */
export interface PersonSchema {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  jobTitle: string
  url: string
  email?: string
  sameAs?: string[]
  knowsAbout?: string[]
  image?: string
  description?: string
}

/**
 * Schema.org Article for blog posts
 */
export interface ArticleSchema {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  author: {
    '@type': 'Person'
    name: string
    url?: string
  }
  publisher: {
    '@type': 'Person'
    name: string
    url?: string
  }
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  image?: string
  keywords?: string[]
}

/**
 * Schema.org WebSite for site information
 */
export interface WebSiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  author: {
    '@type': 'Person'
    name: string
  }
}

/**
 * Schema.org CollectionPage for blog listing
 */
export interface CollectionPageSchema {
  '@context': 'https://schema.org'
  '@type': 'CollectionPage'
  name: string
  description: string
  url: string
  mainEntity: {
    '@type': 'ItemList'
    numberOfItems: number
    itemListElement: Array<{
      '@type': 'ListItem'
      position: number
      url: string
      name: string
    }>
  }
}

/**
 * Schema.org SoftwareApplication for Quarto game
 */
export interface GameSchema {
  '@context': 'https://schema.org'
  '@type': 'SoftwareApplication'
  name: string
  applicationCategory: 'GameApplication'
  description: string
  operatingSystem: string
  offers: {
    '@type': 'Offer'
    price: string
    priceCurrency: string
  }
  author: {
    '@type': 'Person'
    name: string
  }
}
