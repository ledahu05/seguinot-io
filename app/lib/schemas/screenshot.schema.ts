import { z } from 'zod'
import { ProjectSchema } from './cv.schema'

// T017: Screenshot Schema
export const ScreenshotSchema = z.object({
  filename: z.string().regex(/\.(png|jpg|jpeg|webp)$/i, 'Must be an image file'),
  path: z.string().startsWith('/images/', 'Path must start with /images/'),
  alt: z.string().min(1, 'Alt text is required for accessibility'),
})

export type Screenshot = z.infer<typeof ScreenshotSchema>

// T018: Extended project with screenshots
export const ProjectWithScreenshotsSchema = ProjectSchema.extend({
  screenshots: z.array(ScreenshotSchema),
})

export type ProjectWithScreenshots = z.infer<typeof ProjectWithScreenshotsSchema>
