import type { SkillCategoryKey } from './schemas/cv.schema'

// T026: Application constants

export const SKILL_CATEGORY_ORDER: SkillCategoryKey[] = [
  'Languages',
  'Frontend',
  'Testing',
  'Styling',
  'Tools',
  'Cloud & Infrastructure',
  'Methodologies',
]

export const FEATURED_PROJECTS = ['Memory Platform', 'IRIS Platform'] as const

export const PROJECT_COUNT = 12
export const SCREENSHOT_COUNT = 28
export const SKILL_CATEGORY_COUNT = 7

// Animation durations (in seconds for Framer Motion)
export const ANIMATION = {
  HERO_FADE_IN: 0.5,
  TIMELINE_STAGGER: 0.3,
  SKILL_SCALE: 0.2,
  PROJECT_SLIDE: 0.3,
  THEME_TOGGLE: 0.2,
  LIGHTBOX_FADE: 0.2,
} as const

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
