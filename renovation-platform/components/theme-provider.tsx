"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "light" | "dark" | "vivid" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isVividMode: boolean
  toggleVividMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isVividMode, setIsVividMode] = useState(false)

  // Initialize from localStorage if available
  useEffect(() => {
    const savedVividMode = localStorage.getItem("vividMode")
    if (savedVividMode) {
      setIsVividMode(savedVividMode === "true")
    }
  }, [])

  // Apply vivid mode class to body
  useEffect(() => {
    if (isVividMode) {
      document.documentElement.classList.add("vivid-mode")
    } else {
      document.documentElement.classList.remove("vivid-mode")
    }

    // Save to localStorage
    localStorage.setItem("vividMode", isVividMode.toString())
  }, [isVividMode])

  const toggleVividMode = () => {
    setIsVividMode((prev) => !prev)
  }

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider
        value={{
          theme: (props.defaultTheme as Theme) || "light",
          setTheme: props.setTheme as (theme: Theme) => void,
          isVividMode,
          toggleVividMode,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}

