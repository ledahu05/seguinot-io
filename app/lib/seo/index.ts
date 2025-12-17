/**
 * SEO Utilities Barrel Export
 * Central export for all SEO-related functionality
 */

// Constants
export { SITE_CONFIG, DEFAULT_DESCRIPTION, EXPERTISE } from './constants'

// Types
export type {
  MetaTag,
  HeadConfig,
  ArticleMetadata,
  PageMetaConfig,
  PersonSchema,
  ArticleSchema,
  WebSiteSchema,
  CollectionPageSchema,
  GameSchema,
} from './types'

// Meta tag generators
export {
  getAbsoluteUrl,
  getAbsoluteImageUrl,
  truncateTitle,
  generateCanonicalLink,
  generatePageMeta,
  generateNoIndexMeta,
} from './meta'

// Structured data generators
export {
  generatePersonSchema,
  generateWebSiteSchema,
  generateArticleSchema,
  generateCollectionPageSchema,
  generateGameSchema,
  generateJsonLdScript,
  generateMultipleJsonLdScripts,
} from './structured-data'
