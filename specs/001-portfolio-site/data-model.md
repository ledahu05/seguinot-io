# Data Model: seguinot-io Portfolio Website

**Feature**: 001-portfolio-site
**Date**: 2025-12-03

## Overview

All data is sourced from static JSON files at build time. No database or API required. **Zod schemas provide both runtime validation and compile-time type safety**, demonstrating professional TypeScript practices even for a static portfolio.

## Source Files

| File | Purpose |
|------|---------|
| `data/formatted_seguinot_cv_portfolio.json` | Primary structured CV data |
| `data/formatted_seguinot_cv.md` | Extended descriptions (reference only) |
| `data/images/*.png` | Project screenshots (28 files) |

## Zod Schemas

All data types are defined using Zod schemas with inferred TypeScript types. This provides:
- Runtime validation at build time
- Automatic TypeScript type generation
- Self-documenting data contracts
- Graceful error handling with meaningful messages

### Contact Schema

```typescript
// app/lib/schemas/cv.schema.ts

import { z } from 'zod'

export const ContactSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  linkedin: z.string().url('LinkedIn must be a valid URL'),
  github: z.string().optional().default(''),
  portfolio: z.string().optional().default(''),
})

export type Contact = z.infer<typeof ContactSchema>
```

### Profile Schema

```typescript
export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  summary: z.string().min(1, 'Summary is required'),
  contact: ContactSchema,
})

export type Profile = z.infer<typeof ProfileSchema>
```

### Period Schema

```typescript
export const PeriodSchema = z.object({
  start: z.string().min(1, 'Start date is required'),
  end: z.string().min(1, 'End date is required'),
})

export type Period = z.infer<typeof PeriodSchema>
```

### Project Schema

```typescript
export const ProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  period: PeriodSchema,
  highlights: z.array(z.string()).min(1, 'At least one highlight is required'),
  technologies: z.array(z.string()).default([]),
})

export type Project = z.infer<typeof ProjectSchema>
```

### Skills Schema

```typescript
export const SkillsSchema = z.object({
  Languages: z.array(z.string()),
  Frontend: z.array(z.string()),
  Testing: z.array(z.string()),
  Styling: z.array(z.string()),
  Tools: z.array(z.string()),
  'Cloud & Infrastructure': z.array(z.string()),
  Methodologies: z.array(z.string()),
})

export type Skills = z.infer<typeof SkillsSchema>
export type SkillCategoryKey = keyof Skills
```

### Education Schema

```typescript
export const EducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  period: z.string().min(1, 'Period is required'),
  honors: z.array(z.string()).optional().default([]),
})

export type Education = z.infer<typeof EducationSchema>
```

### Language Schema

```typescript
export const LanguageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  level: z.string().min(1, 'Proficiency level is required'),
})

export type Language = z.infer<typeof LanguageSchema>
```

### CVData Schema (Root)

```typescript
export const CVDataSchema = z.object({
  profile: ProfileSchema,
  skills: SkillsSchema,
  projects: z.array(ProjectSchema).min(1, 'At least one project is required'),
  education: z.array(EducationSchema),
  languages: z.array(LanguageSchema),
})

export type CVData = z.infer<typeof CVDataSchema>
```

## Screenshot Schema

```typescript
// app/lib/schemas/screenshot.schema.ts

import { z } from 'zod'

export const ScreenshotSchema = z.object({
  filename: z.string().regex(/\.(png|jpg|jpeg|webp)$/i, 'Must be an image file'),
  path: z.string().startsWith('/images/', 'Path must start with /images/'),
  alt: z.string().min(1, 'Alt text is required for accessibility'),
})

export type Screenshot = z.infer<typeof ScreenshotSchema>

// Extended project with screenshots
export const ProjectWithScreenshotsSchema = ProjectSchema.extend({
  screenshots: z.array(ScreenshotSchema),
})

export type ProjectWithScreenshots = z.infer<typeof ProjectWithScreenshotsSchema>
```

## Screenshot Mapping

Static mapping between project titles and screenshot files:

```typescript
// app/lib/screenshot-mapper.ts

import { Screenshot, ScreenshotSchema } from './schemas/screenshot.schema'

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
} as const

export function getProjectScreenshots(projectTitle: string): Screenshot[] {
  const filenames = SCREENSHOT_MAP[projectTitle] ?? []
  return filenames.map(filename => {
    const screenshot = {
      filename,
      path: `/images/${filename}`,
      alt: generateAltText(projectTitle, filename)
    }
    // Validate at runtime
    return ScreenshotSchema.parse(screenshot)
  })
}

function generateAltText(project: string, filename: string): string {
  const description = filename
    .replace(/\.(png|jpg|webp)$/, '')
    .replace(/-/g, ' ')
    .replace(/^\w+\s/, '') // Remove project prefix
  return `${project} - ${description}`
}
```

## Theme State Schema

```typescript
// app/lib/schemas/theme.schema.ts

import { z } from 'zod'

export const ThemeSchema = z.enum(['dark', 'light'])

export type Theme = z.infer<typeof ThemeSchema>

export const ThemeContextSchema = z.object({
  theme: ThemeSchema,
  setTheme: z.function().args(ThemeSchema).returns(z.void()),
  toggleTheme: z.function().returns(z.void()),
})

export type ThemeContext = z.infer<typeof ThemeContextSchema>
```

## Data Loading with Validation

```typescript
// app/lib/data/cv-loader.ts

import { CVDataSchema, CVData, Profile, Skills, Project } from '../schemas/cv.schema'
import { ProjectWithScreenshots } from '../schemas/screenshot.schema'
import { getProjectScreenshots } from '../screenshot-mapper'
import rawCvData from '../../../data/formatted_seguinot_cv_portfolio.json'

// Validate and parse CV data at load time
function loadCVData(): CVData {
  const result = CVDataSchema.safeParse(rawCvData)

  if (!result.success) {
    console.error('CV Data validation failed:', result.error.format())
    throw new Error('Unable to load content: CV data is malformed')
  }

  return result.data
}

// Cached parsed data
let cachedData: CVData | null = null

export function getCVData(): CVData {
  if (!cachedData) {
    cachedData = loadCVData()
  }
  return cachedData
}

export function getProfile(): Profile {
  return getCVData().profile
}

export function getSkills(): Skills {
  return getCVData().skills
}

export function getProjects(): Project[] {
  return getCVData().projects
}

export function getProjectsWithScreenshots(): ProjectWithScreenshots[] {
  return getProjects().map(project => ({
    ...project,
    screenshots: getProjectScreenshots(project.title)
  }))
}

export function getEducation() {
  return getCVData().education
}

export function getLanguages() {
  return getCVData().languages
}
```

## Validation Rules Summary

| Schema | Field | Validation |
|--------|-------|------------|
| Contact | email | Valid email format |
| Contact | linkedin | Valid URL format |
| Profile | name, title, location, summary | Non-empty strings |
| Project | highlights | At least 1 item required |
| Screenshot | filename | Must match image file pattern |
| Screenshot | path | Must start with /images/ |
| Screenshot | alt | Non-empty (accessibility) |
| Theme | value | Must be 'dark' or 'light' |

## Entity Relationships

```
CVData (validated by CVDataSchema)
├── Profile (ProfileSchema)
│   └── Contact (ContactSchema)
├── Skills (SkillsSchema) - 7 categories
├── Project[] (ProjectSchema) - 12 items
│   ├── Period (PeriodSchema)
│   └── Screenshot[] (ScreenshotSchema) - via mapping
├── Education[] (EducationSchema) - 1 item
└── Language[] (LanguageSchema) - 2 items
```

## Constants

```typescript
// app/lib/constants.ts

import { SkillCategoryKey } from './schemas/cv.schema'

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
] as const

export const PROJECT_COUNT = 12
export const SCREENSHOT_COUNT = 28
export const SKILL_CATEGORY_COUNT = 7
```

## Error Handling

The Zod schemas enable graceful error handling as specified in the edge cases:

```typescript
// Example: Handling malformed JSON
try {
  const data = getCVData()
} catch (error) {
  // Display: "Unable to load content"
  // Log detailed Zod validation errors for debugging
}
```

This approach ensures:
1. **Build-time validation**: Malformed data caught during development
2. **Runtime safety**: Graceful error states in production
3. **Type inference**: Full TypeScript support via `z.infer<>`
4. **Documentation**: Schemas serve as living data contracts
