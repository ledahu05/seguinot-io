import { useState, useEffect, type ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue } from '@/hooks/use-theme'
import type { Theme } from '@/lib/schemas/theme.schema'

// T024: Theme Provider component with React Context

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    // Read from localStorage on mount
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored && (stored === 'dark' || stored === 'light')) {
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    // Update document class and localStorage when theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
