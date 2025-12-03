# Research: seguinot-io Portfolio Website

**Feature**: 001-portfolio-site
**Date**: 2025-12-03

## Technology Decisions

### 1. TanStack Start Configuration

**Decision**: Use TanStack Start with file-based routing and SSR

**Rationale**:
- Full-stack React framework with built-in SSR for performance (LCP < 2.5s)
- File-based routing aligns with constitution requirement
- Seamless integration with TanStack Router
- Vinxi-powered build system (Vite under the hood)
- Native support for static data loading via loaders

**Alternatives Considered**:
- Next.js: More mature but doesn't align with constitution (TanStack Start mandated)
- Remix: Similar capabilities but TanStack Start specified
- Plain Vite SPA: No SSR, would hurt performance goals

**Implementation Notes**:
```bash
npm create @tanstack/start@latest
```
- Use `app/routes/` for file-based routing
- Configure for Vercel deployment
- Enable SSR for initial page load performance

### 2. Tailwind CSS v4 with shadcn/ui

**Decision**: Tailwind CSS v4 + shadcn/ui components

**Rationale**:
- Tailwind v4 offers CSS-first configuration (no tailwind.config.js needed)
- shadcn/ui provides accessible Radix-based primitives
- Headless approach keeps bundle small (constitution: VI. Minimal Dependencies)
- Copy-paste component model allows full customization
- Built-in dark mode support via CSS variables

**Alternatives Considered**:
- Tailwind v3: Works but v4 specified in requirements
- Radix directly: More setup, shadcn/ui already wraps it
- Headless UI: Less comprehensive than shadcn/ui

**Implementation Notes**:
```bash
npx shadcn@latest init
# Select components: button, card, dialog, badge
```
- Configure CSS variables for dark/light themes
- Use `cn()` utility for conditional classes

### 3. Framer Motion Animation Strategy

**Decision**: Framer Motion for page transitions, scroll reveals, and micro-interactions

**Rationale**:
- Constitution requires Framer Motion (VIII. Micro-interactions)
- Excellent performance with GPU-accelerated transforms
- Built-in `useReducedMotion` hook for accessibility
- AnimatePresence for enter/exit animations
- Scroll-triggered animations via `whileInView`

**Alternatives Considered**:
- CSS animations only: Less control, no scroll triggers
- React Spring: Similar but Framer Motion specified
- GSAP: Heavier, not needed for this scope

**Animation Plan**:
| Element | Animation Type | Duration | Trigger |
|---------|---------------|----------|---------|
| Hero section | Fade in + slide up | 500ms | Page load |
| Timeline entries | Stagger reveal | 300ms each | Scroll into view |
| Skill cards | Scale + fade | 200ms | Scroll into view |
| Project cards | Slide up | 300ms | Scroll into view |
| Theme toggle | Rotate icon | 200ms | Click |
| Lightbox | Fade + scale | 200ms | Open/close |

**Reduced Motion**:
```tsx
const prefersReducedMotion = useReducedMotion()
const animation = prefersReducedMotion ? {} : { opacity: [0, 1], y: [20, 0] }
```

### 4. Theme Implementation

**Decision**: React Context with localStorage persistence, CSS variables

**Rationale**:
- Simple prop drilling not needed (context sufficient)
- localStorage for cross-session persistence
- CSS variables enable instant theme switching
- System preference detection as fallback
- Dark mode default per specification

**Implementation Pattern**:
```tsx
// ThemeProvider.tsx
const ThemeContext = createContext<ThemeContextType>(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(stored ?? (systemPrefersDark ? 'dark' : 'dark')) // Default dark
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
```

### 5. Image Optimization Strategy

**Decision**: Vite image optimization + responsive srcset + lazy loading

**Rationale**:
- Constitution requires WebP/AVIF formats (V. Performance)
- Responsive images for different screen sizes
- Native lazy loading for below-fold images
- Blur placeholder for perceived performance

**Implementation**:
- Use `vite-imagetools` for build-time optimization
- Generate multiple sizes: 320w, 640w, 1024w, 1920w
- Output WebP format with AVIF fallback
- Use `loading="lazy"` for all non-hero images

**Lightbox Solution**:
- Use shadcn/ui Dialog component
- Framer Motion for open/close animation
- Keyboard navigation (arrow keys, escape)
- Touch gestures for mobile

### 6. Screenshot-to-Project Mapping

**Decision**: Convention-based mapping with TypeScript types

**Rationale**:
- Screenshots follow naming convention (e.g., `iris-*.png`)
- Build-time validation ensures all mappings correct
- TypeScript provides compile-time safety

**Mapping Logic**:
```typescript
const SCREENSHOT_MAP: Record<string, string[]> = {
  'IRIS Platform': ['iris-landing-page.png', 'iris-content-type.png', ...],
  'Memory Platform': ['memory-landing-page.png', 'memory-create-ref.png', ...],
  // ... etc
}

function getProjectScreenshots(projectTitle: string): string[] {
  return SCREENSHOT_MAP[projectTitle] ?? []
}
```

### 7. Testing Strategy

**Decision**: Vitest for unit tests, Playwright for E2E

**Rationale**:
- Vitest integrates seamlessly with Vite/TanStack Start
- React Testing Library for component testing
- Playwright for cross-browser E2E testing
- Focus on user scenarios from spec

**Test Coverage Plan**:
| Category | Tool | Focus Areas |
|----------|------|-------------|
| Unit | Vitest + RTL | Hooks (useTheme, useScrollTo), utilities |
| Component | Vitest + RTL | Hero, Timeline, SkillsGrid rendering |
| E2E | Playwright | Full user journeys from spec scenarios |
| Visual | Playwright | Screenshot comparisons (optional) |

**Key E2E Scenarios**:
1. Page loads with dark mode, hero visible
2. Click "View Projects" scrolls to projects section
3. Click timeline entry opens details/screenshots
4. Theme toggle switches to light mode and persists
5. All 12 projects visible in timeline
6. Image lightbox opens and navigates

### 8. Vercel Deployment Configuration

**Decision**: Vercel with TanStack Start adapter

**Rationale**:
- Vercel specified in requirements
- Native SSR support
- Automatic preview deployments
- Edge functions for performance

**Configuration**:
```typescript
// app.config.ts
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'vercel',
  },
})
```

## Unresolved Items

None. All technical decisions resolved.

## Next Steps

1. Generate data-model.md with TypeScript types
2. Create quickstart.md with setup instructions
3. Proceed to task generation
