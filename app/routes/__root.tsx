import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { store } from '../store'

import globalsCss from '../styles/globals.css?url'

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
        title: 'Christophe Seguinot | Senior Frontend Developer',
      },
      {
        name: 'description',
        content:
          'Senior Frontend Developer with 12+ years of experience building enterprise-scale React/TypeScript applications.',
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
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="dark">
        {/* T075: Fixed header with ThemeToggle */}
        <header className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </header>
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
