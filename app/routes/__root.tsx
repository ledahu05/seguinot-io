import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { store } from '../store'
import { SITE_CONFIG } from '@/lib/seo'

import globalsCss from '../styles/globals.css?url'

const defaultOgImage = `${SITE_CONFIG.url}${SITE_CONFIG.images.default}`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: SITE_CONFIG.title,
      },
      {
        name: 'description',
        content: SITE_CONFIG.description,
      },
      // Default Open Graph tags (can be overridden by child routes)
      {
        property: 'og:site_name',
        content: SITE_CONFIG.name,
      },
      {
        property: 'og:locale',
        content: SITE_CONFIG.locale,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: defaultOgImage,
      },
      // Default Twitter Card tags
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:image',
        content: defaultOgImage,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: globalsCss,
      },
    ],
    scripts: [
      {
        children: `
          (function() {
            const theme = localStorage.getItem('theme') ?? 'dark';
            document.documentElement.classList.toggle('dark', theme === 'dark');
            document.documentElement.classList.toggle('light', theme === 'light');
          })()
        `,
      },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const location = useLocation()
  const hideThemeToggle = location.pathname === '/games/quarto/play'

  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="dark">
        {/* T075: Fixed header with ThemeToggle */}
        {!hideThemeToggle && (
          <header className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </header>
        )}
        <Outlet />
      </ThemeProvider>
    </ReduxProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
