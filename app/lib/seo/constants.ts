/**
 * SEO Constants and Site Configuration
 * Central source of truth for all SEO-related metadata
 */

export const SITE_CONFIG = {
  name: 'Christophe Seguinot',
  title: 'Christophe Seguinot | Senior Frontend Developer',
  description:
    'Senior Frontend Developer with 12+ years of experience building enterprise-scale React/TypeScript applications.',
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
} as const

/**
 * Default meta description fallback
 */
export const DEFAULT_DESCRIPTION = SITE_CONFIG.description

/**
 * Skills/expertise for JSON-LD knowsAbout property
 */
export const EXPERTISE = [
  'React',
  'TypeScript',
  'Frontend Development',
  'Redux Toolkit',
  'TanStack',
  'JavaScript',
  'Web Applications',
] as const
