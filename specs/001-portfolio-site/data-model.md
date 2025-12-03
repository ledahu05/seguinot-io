# Data Model: seguinot-io Portfolio Website

**Feature**: 001-portfolio-site
**Date**: 2025-12-03

## Overview

All data is sourced from static JSON files at build time. No database or API required. TypeScript types provide compile-time safety and IDE support.

## Source Files

| File | Purpose |
|------|---------|
| `data/formatted_seguinot_cv_portfolio.json` | Primary structured CV data |
| `data/formatted_seguinot_cv.md` | Extended descriptions (reference only) |
| `data/images/*.png` | Project screenshots (28 files) |

## TypeScript Types

### CVData (Root Entity)

```typescript
// app/lib/cv-data.ts

export interface CVData {
  profile: Profile
  skills: SkillCategories
  projects: Project[]
  education: Education[]
  languages: Language[]
}
```

### Profile

```typescript
export interface Profile {
  name: string                    // "Christophe Seguinot"
  title: string                   // "Senior Frontend Developer"
  location: string                // "Chorges, France"
  summary: string                 // Professional summary paragraph
  contact: ContactInfo
}

export interface ContactInfo {
  email: string                   // "christophe.seguinot@gmail.com"
  phone: string                   // "+33 6 26 33 07 10"
  linkedin: string                // "https://linkedin.com/in/christophe-seguinot"
  github: string                  // Optional, may be empty
  portfolio: string               // Optional, may be empty
}
```

### Skills

```typescript
export interface SkillCategories {
  Languages: string[]             // ["JavaScript", "TypeScript", ...]
  Frontend: string[]              // ["React 19", "Next.js", ...]
  Testing: string[]               // ["Vitest", "Cypress", ...]
  Styling: string[]               // ["Tailwind CSS", ...]
  Tools: string[]                 // ["Git", "Docker", ...]
  "Cloud & Infrastructure": string[]  // ["Azure", "AWS Amplify"]
  Methodologies: string[]         // ["Agile/Scrum", "TDD", ...]
}

// Type for skill category keys
export type SkillCategoryKey = keyof SkillCategories
```

### Project

```typescript
export interface Project {
  title: string                   // "Memory Platform"
  role: string                    // "Senior Frontend Developer"
  company: string                 // "Egis"
  location: string                // "Remote"
  period: ProjectPeriod
  highlights: string[]            // Array of achievement bullets
  technologies: string[]          // ["React", "TypeScript", ...]
}

export interface ProjectPeriod {
  start: string                   // "May 2025"
  end: string                     // "Present" or "December 2023"
}

// Derived type for projects with screenshots
export interface ProjectWithScreenshots extends Project {
  screenshots: Screenshot[]
}

export interface Screenshot {
  filename: string                // "memory-landing-page.png"
  path: string                    // "/images/memory-landing-page.png"
  alt: string                     // Generated from filename
}
```

### Education

```typescript
export interface Education {
  degree: string                  // "Engineering Degree"
  institution: string             // "Ecole Centrale de Marseille"
  period: string                  // "September 2000 - September 2003"
  honors: string[]                // ["Graduated with honors"]
}
```

### Language

```typescript
export interface Language {
  name: string                    // "French"
  level: string                   // "Native" or "Professional"
}
```

## Screenshot Mapping

Static mapping between project titles and screenshot files:

```typescript
// app/lib/screenshot-mapper.ts

export const SCREENSHOT_MAP: Record<string, string[]> = {
  "IRIS Platform": [
    "iris-landing-page.png",
    "iris-content-type.png",
    "iris-flows.png",
    "iris-image.png",
    "iris-quote.png",
    "iris-usecase.png"
  ],
  "Memory Platform": [
    "memory-landing-page.png",
    "memory-create-ref.png",
    "memory-create-ref-from-iris.png",
    "memory-view-ref.png"
  ],
  "Clickn Collect": [
    "clickncollect-storefront-home.png",
    "clickncollect-catalog.png",
    "clickncollect-adminui-product.png"
  ],
  "Blueplan": [
    "blueplan-4.png",
    "blueplan-5.png",
    "blueplan-6.png"
  ],
  "Syment": [
    "syment-1.png",
    "syment-2.png",
    "syment-3.png",
    "syment-4.png"
  ],
  "Moona": [
    "moona-1.png",
    "moona-2.png",
    "moona-3.png"
  ],
  "Lalilo": [
    "lalilo-1.png",
    "lalilo-2.png"
  ],
  "RenovationMan": [
    "renovationman-1.png"
  ]
}

export function getProjectScreenshots(projectTitle: string): Screenshot[] {
  const filenames = SCREENSHOT_MAP[projectTitle] ?? []
  return filenames.map(filename => ({
    filename,
    path: `/images/${filename}`,
    alt: generateAltText(projectTitle, filename)
  }))
}

function generateAltText(project: string, filename: string): string {
  const description = filename
    .replace(/\.(png|jpg|webp)$/, '')
    .replace(/-/g, ' ')
    .replace(/^\w+\s/, '') // Remove project prefix
  return `${project} - ${description}`
}
```

## Theme State

```typescript
// app/hooks/useTheme.ts

export type Theme = 'dark' | 'light'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}
```

## Data Loading

```typescript
// app/lib/cv-data.ts

import cvData from '../../data/formatted_seguinot_cv_portfolio.json'
import { getProjectScreenshots } from './screenshot-mapper'

export function getCVData(): CVData {
  return cvData as CVData
}

export function getProjectsWithScreenshots(): ProjectWithScreenshots[] {
  const data = getCVData()
  return data.projects.map(project => ({
    ...project,
    screenshots: getProjectScreenshots(project.title)
  }))
}

export function getProfile(): Profile {
  return getCVData().profile
}

export function getSkills(): SkillCategories {
  return getCVData().skills
}
```

## Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| Profile | email | Must be valid email format |
| Profile | linkedin | Must be valid URL |
| Project | period.start | Must be non-empty string |
| Project | highlights | Must have at least 1 item |
| Screenshot | filename | Must exist in data/images/ |

## Entity Relationships

```
CVData
├── Profile
│   └── ContactInfo
├── SkillCategories (7 categories)
├── Project[] (12 items)
│   ├── ProjectPeriod
│   └── Screenshot[] (via mapping)
├── Education[] (1 item)
└── Language[] (2 items)
```

## Constants

```typescript
// app/lib/constants.ts

export const SKILL_CATEGORY_ORDER: SkillCategoryKey[] = [
  'Languages',
  'Frontend',
  'Testing',
  'Styling',
  'Tools',
  'Cloud & Infrastructure',
  'Methodologies'
]

export const FEATURED_PROJECTS = [
  'Memory Platform',
  'IRIS Platform'
]

export const PROJECT_COUNT = 12
export const SCREENSHOT_COUNT = 28
export const SKILL_CATEGORY_COUNT = 7
```
