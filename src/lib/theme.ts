/**
 * Theme utility for managing light/dark mode
 * Uses localStorage for persistence and applies class to html element
 */

export type Theme = 'light' | 'dark'

const THEME_KEY = 'cogiaohaianh-theme'

/**
 * Get the current theme from localStorage, defaults to 'light'
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

/**
 * Set the theme and apply it to the html element
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(THEME_KEY, theme)

  const html = document.documentElement
  // Add transition class for smooth theme change
  html.classList.add('theme-transition')

  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }

  // Remove transition class after animation completes
  setTimeout(() => {
    html.classList.remove('theme-transition')
  }, 350)
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const current = getTheme()
  const next = current === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}

/**
 * Initialize theme on app load - apply stored preference without animation
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return

  const theme = getTheme()
  const html = document.documentElement

  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

/**
 * Check if the current theme is dark
 */
export function isDark(): boolean {
  return getTheme() === 'dark'
}
