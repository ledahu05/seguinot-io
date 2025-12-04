import { z } from 'zod'

// T022: Theme Schema
export const ThemeSchema = z.enum(['dark', 'light'])

export type Theme = z.infer<typeof ThemeSchema>
