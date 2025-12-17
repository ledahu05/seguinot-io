/**
 * SEO Meta Tag Generation Utilities
 * Functions to generate meta tags for TanStack Start head() function
 */

import { SITE_CONFIG } from './constants'
import type { PageMetaConfig, MetaTag, HeadConfig } from './types'

/**
 * Generate absolute URL from path
 */
export function getAbsoluteUrl(path: string): string {
  // Handle already absolute URLs
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_CONFIG.url}${normalizedPath}`
}

/**
 * Generate absolute image URL for OG/Twitter
 */
export function getAbsoluteImageUrl(imagePath?: string): string {
  const path = imagePath || SITE_CONFIG.images.default
  return getAbsoluteUrl(path)
}

/**
 * Truncate title to 60 characters for SEO
 */
export function truncateTitle(title: string, maxLength: number = 57): string {
  if (title.length <= maxLength) {
    return title
  }
  return `${title.substring(0, maxLength)}...`
}

/**
 * Generate canonical link tag
 */
export function generateCanonicalLink(path: string): { rel: string; href: string } {
  return {
    rel: 'canonical',
    href: getAbsoluteUrl(path),
  }
}

/**
 * Generate complete page meta tags for TanStack Start head() function
 */
export function generatePageMeta(config: PageMetaConfig): HeadConfig {
  const {
    title,
    description,
    path,
    type = 'website',
    image,
    article,
    noIndex = false,
  } = config

  const fullTitle = `${truncateTitle(title)} | ${SITE_CONFIG.name}`
  const absoluteUrl = getAbsoluteUrl(path)
  const absoluteImageUrl = getAbsoluteImageUrl(image)

  const meta: MetaTag[] = [
    // Basic meta tags
    { title: fullTitle },
    { name: 'description', content: description },

    // Open Graph tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: absoluteUrl },
    { property: 'og:image', content: absoluteImageUrl },
    { property: 'og:site_name', content: SITE_CONFIG.name },
    { property: 'og:locale', content: SITE_CONFIG.locale },

    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteImageUrl },
  ]

  // Add noindex if specified
  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  // Add article-specific meta tags
  if (article) {
    meta.push(
      { property: 'article:published_time', content: article.publishedTime }
    )
    if (article.modifiedTime) {
      meta.push({ property: 'article:modified_time', content: article.modifiedTime })
    }
    meta.push({ property: 'article:author', content: article.author })
    article.tags.forEach((tag) => {
      meta.push({ property: 'article:tag', content: tag })
    })
  }

  return {
    meta,
    links: [generateCanonicalLink(path)],
  }
}

/**
 * Generate minimal meta tags for noIndex pages (game sessions, etc.)
 */
export function generateNoIndexMeta(config: {
  title: string
  description: string
  path: string
}): HeadConfig {
  return generatePageMeta({
    ...config,
    type: 'website',
    noIndex: true,
  })
}
