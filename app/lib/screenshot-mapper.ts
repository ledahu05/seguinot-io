import { Screenshot, ScreenshotSchema } from './schemas/screenshot.schema'

// T019: Screenshot mapping constant
export const SCREENSHOT_MAP: Record<string, string[]> = {
  'IRIS Platform': [
    'iris-landing-page.png',
    'iris-content-type.png',
    'iris-flows.png',
    'iris-image.png',
    'iris-quote.png',
    'iris-usecase.png',
  ],
  'Memory Platform': [
    'memory-landing-page.png',
    'memory-create-ref.png',
    'memory-create-ref-from-iris.png',
    'memory-view-ref.png',
  ],
  'Clickn Collect': [
    'clickncollect-storefront-home.png',
    'clickncollect-catalog.png',
    'clickncollect-adminui-product.png',
  ],
  Blueplan: ['blueplan-4.png', 'blueplan-5.png', 'blueplan-6.png'],
  Syment: ['syment-1.png', 'syment-2.png', 'syment-3.png', 'syment-4.png'],
  Moona: ['moona-1.png', 'moona-2.png', 'moona-3.png'],
  Lalilo: ['lalilo-1.png', 'lalilo-2.png'],
  RenovationMan: ['renovationman-1.png'],
} as const

// T020: Get project screenshots with Zod validation
function generateAltText(project: string, filename: string): string {
  const description = filename
    .replace(/\.(png|jpg|webp)$/, '')
    .replace(/-/g, ' ')
    .replace(/^\w+\s/, '') // Remove project prefix
  return `${project} - ${description}`
}

export function getProjectScreenshots(projectTitle: string): Screenshot[] {
  const filenames = SCREENSHOT_MAP[projectTitle] ?? []
  return filenames.map((filename) => {
    const screenshot = {
      filename,
      path: `/images/${filename}`,
      alt: generateAltText(projectTitle, filename),
    }
    // Validate at runtime
    return ScreenshotSchema.parse(screenshot)
  })
}

export function hasScreenshots(projectTitle: string): boolean {
  return projectTitle in SCREENSHOT_MAP
}
