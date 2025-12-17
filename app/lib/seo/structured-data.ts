/**
 * JSON-LD Structured Data Generators
 * Functions to generate Schema.org structured data for rich search results
 */

import { SITE_CONFIG, EXPERTISE } from './constants'
import type {
  PersonSchema,
  ArticleSchema,
  WebSiteSchema,
  CollectionPageSchema,
  GameSchema,
} from './types'

/**
 * Generate Person schema for homepage
 */
export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.jobTitle,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.author.email,
    sameAs: [SITE_CONFIG.author.linkedIn, SITE_CONFIG.author.github],
    knowsAbout: [...EXPERTISE],
    description: SITE_CONFIG.description,
  }
}

/**
 * Generate WebSite schema for site-wide information
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE_CONFIG.author.name} Portfolio`,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
    },
  }
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(article: {
  title: string
  description: string
  slug: string
  date: string
  modifiedDate?: string
  author?: string
  tags?: string[]
}): ArticleSchema {
  const authorName = article.author || SITE_CONFIG.author.name
  const articleUrl = `${SITE_CONFIG.url}/blog/${article.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.modifiedDate,
    author: {
      '@type': 'Person',
      name: authorName,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: article.tags,
  }
}

/**
 * Generate CollectionPage schema for blog listing
 */
export function generateCollectionPageSchema(posts: {
  slug: string
  title: string
}[]): CollectionPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog',
    description:
      'Articles about frontend development, React, TypeScript, and building modern web applications.',
    url: `${SITE_CONFIG.url}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        url: `${SITE_CONFIG.url}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  }
}

/**
 * Generate SoftwareApplication schema for Quarto game
 */
export function generateGameSchema(): GameSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Quarto',
    applicationCategory: 'GameApplication',
    description:
      'A strategic board game where players must align four pieces sharing a common attribute. Play locally, against AI, or online with friends.',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.author.name,
    },
  }
}

/**
 * Generate JSON-LD script tag for TanStack Start head() scripts array
 */
export function generateJsonLdScript(
  schema: PersonSchema | ArticleSchema | WebSiteSchema | CollectionPageSchema | GameSchema
): { type: string; children: string } {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(schema),
  }
}

/**
 * Generate multiple JSON-LD scripts (e.g., Person + WebSite for homepage)
 */
export function generateMultipleJsonLdScripts(
  schemas: Array<PersonSchema | ArticleSchema | WebSiteSchema | CollectionPageSchema | GameSchema>
): Array<{ type: string; children: string }> {
  return schemas.map(generateJsonLdScript)
}
