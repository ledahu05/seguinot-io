import { z } from 'zod'

// T010: Contact Schema
export const ContactSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  linkedin: z.string().url('LinkedIn must be a valid URL'),
  github: z.string().default(''),
  portfolio: z.string().default(''),
})

export type Contact = z.infer<typeof ContactSchema>

// T011: Profile Schema
export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  summary: z.string().min(1, 'Summary is required'),
  contact: ContactSchema,
})

export type Profile = z.infer<typeof ProfileSchema>

// T012: Period Schema
export const PeriodSchema = z.object({
  start: z.string().min(1, 'Start date is required'),
  end: z.string().min(1, 'End date is required'),
})

export type Period = z.infer<typeof PeriodSchema>

// T013: Project Schema
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

// T014: Skills Schema
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

// T015: Education Schema
export const EducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  period: z.string().min(1, 'Period is required'),
  honors: z.array(z.string()).optional().default([]),
})

export type Education = z.infer<typeof EducationSchema>

// T015: Language Schema
export const LanguageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  level: z.string().min(1, 'Proficiency level is required'),
})

export type Language = z.infer<typeof LanguageSchema>

// T016: CVData Schema (Root)
export const CVDataSchema = z.object({
  profile: ProfileSchema,
  skills: SkillsSchema,
  projects: z.array(ProjectSchema).min(1, 'At least one project is required'),
  education: z.array(EducationSchema),
  languages: z.array(LanguageSchema),
})

export type CVData = z.infer<typeof CVDataSchema>
