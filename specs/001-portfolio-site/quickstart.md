# Quickstart: seguinot-io Portfolio Website

**Feature**: 001-portfolio-site
**Date**: 2025-12-03

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm 8+
- Git

## Initial Setup

### 1. Create TanStack Start Project

```bash
# Create new TanStack Start project
npm create @tanstack/start@latest seguinot-io

# Navigate to project
cd seguinot-io

# Select options:
# - TypeScript: Yes
# - Package manager: npm (or pnpm)
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install framer-motion lucide-react zod

# Development dependencies
npm install -D @types/node vitest @testing-library/react @testing-library/jest-dom jsdom playwright @playwright/test
```

### 3. Initialize Tailwind CSS v4 + shadcn/ui

```bash
# Initialize shadcn/ui (includes Tailwind v4 setup)
npx shadcn@latest init

# Select options:
# - Style: Default
# - Base color: Slate (or Zinc for dark theme)
# - CSS variables: Yes
# - React Server Components: No (TanStack Start handles SSR differently)

# Add required components
npx shadcn@latest add button card dialog badge
```

### 4. Copy Data Files

```bash
# Ensure data directory exists
mkdir -p data/images

# Copy CV data (already in repository)
# data/formatted_seguinot_cv_portfolio.json
# data/formatted_seguinot_cv.md
# data/images/*.png (28 screenshots)
```

### 5. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: ['app/components/ui/**']
    }
  }
})
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest'
```

### 6. Configure Playwright

```bash
# Initialize Playwright
npx playwright install
```

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
})
```

### 7. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

## Project Structure Setup

Create the following directory structure:

```bash
mkdir -p app/components/{ui,layout,hero,timeline,skills,projects,contact,shared}
mkdir -p app/hooks
mkdir -p app/lib/{schemas,data,utils}
mkdir -p app/styles
mkdir -p tests/{unit/{components,lib,hooks},e2e}
```

## Development Workflow

### Start Development Server

```bash
npm run dev
# Opens at http://localhost:3000
```

### Run Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npx playwright test --ui
```

### Build for Production

```bash
npm run build
npm run start
```

## Vercel Deployment

### 1. Configure for Vercel

Update `app.config.ts`:

```typescript
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  server: {
    preset: 'vercel',
  },
})
```

### 2. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo via Vercel dashboard
```

### 3. Environment Variables

No environment variables required for this project (all data is static).

## Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads
- [ ] `npm test` passes
- [ ] TypeScript has no errors: `npm run typecheck`
- [ ] Data files are accessible in `data/` directory
- [ ] All 28 images are in `data/images/`

## Key Files to Create First

1. `app/lib/schemas/cv.schema.ts` - Zod schemas for CV data types
2. `app/lib/schemas/screenshot.schema.ts` - Zod schemas for screenshots
3. `app/lib/data/cv-loader.ts` - Data loading with Zod validation
4. `app/lib/screenshot-mapper.ts` - Screenshot mapping
5. `app/hooks/use-theme.ts` - Theme context hook
6. `app/routes/__root.tsx` - Root layout with theme provider
7. `app/routes/index.tsx` - Home page with all sections

## Common Issues

### TanStack Start + Tailwind v4

If Tailwind styles don't apply:
1. Ensure `@import "tailwindcss"` is in your CSS entry point
2. Check that `app/styles/globals.css` is imported in `__root.tsx`

### Image Loading

Images in `data/images/` need to be served statically:
1. Move to `public/images/` for static serving, OR
2. Configure Vite to serve from `data/` directory

### Dark Mode Flash

To prevent light mode flash on load:
1. Add inline script in `<head>` to set class before React hydrates
2. Use `suppressHydrationWarning` on html element

```tsx
// In __root.tsx
<script dangerouslySetInnerHTML={{
  __html: `
    (function() {
      const theme = localStorage.getItem('theme') ?? 'dark';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })()
  `
}} />
```
