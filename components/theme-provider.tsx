"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useRole } from "@/hooks/use-role"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { role } = useRole()
  const [mounted, setMounted] = React.useState(false)
  const [previousRole, setPreviousRole] = React.useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Apply role-based theme class to the document element
  React.useEffect(() => {
    if (!mounted) return

    // If role has changed, trigger transition
    if (previousRole && previousRole !== role) {
      setIsTransitioning(true)

      // After a short delay, update the theme classes
      const timer = setTimeout(() => {
        // Remove all theme classes first
        document.documentElement.classList.remove("theme-owner", "theme-expert", "theme-client")

        // Add the appropriate theme class based on role
        if (role === "expert") {
          document.documentElement.classList.add("theme-expert")
        } else if (role === "client") {
          document.documentElement.classList.add("theme-client")
        } else if (role === "owner") {
          document.documentElement.classList.add("theme-owner")
        }

        // End transition after theme is applied
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      // Initial theme setup (no transition)
      document.documentElement.classList.remove("theme-owner", "theme-expert", "theme-client")

      // Add the appropriate theme class based on role
      if (role === "expert") {
        document.documentElement.classList.add("theme-expert")
      } else if (role === "client") {
        document.documentElement.classList.add("theme-client")
      } else if (role === "owner") {
        document.documentElement.classList.add("theme-owner")
      }
    }

    // Update previous role
    setPreviousRole(role)
  }, [role, mounted, previousRole])

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading theme...</p>
        </div>
      </div>
    )
  }

  return (
    <NextThemesProvider {...props}>
      <div
        className={`role-transition-container ${isTransitioning ? "role-transition-exit" : "role-transition-enter"}`}
      >
        {children}
      </div>
    </NextThemesProvider>
  )
}
