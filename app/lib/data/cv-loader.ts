import {
  CVDataSchema,
  type CVData,
  type Profile,
  type Skills,
  type Project,
  type Education,
  type Language,
} from '../schemas/cv.schema'
import type { ProjectWithScreenshots } from '../schemas/screenshot.schema'
import { getProjectScreenshots } from '../screenshot-mapper'
import rawCvData from '../../../data/formatted_seguinot_cv_portfolio.json'

// T021: CV Data loader with Zod validation

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
  return getProjects().map((project) => ({
    ...project,
    screenshots: getProjectScreenshots(project.title),
  }))
}

export function getEducation(): Education[] {
  return getCVData().education
}

export function getLanguages(): Language[] {
  return getCVData().languages
}
