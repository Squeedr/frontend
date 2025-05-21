"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useRole } from "@/hooks/use-role"

interface SVGLogoProps {
  className?: string
  isCollapsed?: boolean
  color?: string
  secondaryColor?: string
  useRoleColors?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "responsive"
  responsiveSize?: {
    default: "xs" | "sm" | "md" | "lg" | "xl"
    sm?: "xs" | "sm" | "md" | "lg" | "xl"
    md?: "xs" | "sm" | "md" | "lg" | "xl"
    lg?: "xs" | "sm" | "md" | "lg" | "xl"
    xl?: "xs" | "sm" | "md" | "lg" | "xl"
  }
}

// Role-based color mapping
const roleColors = {
  owner: {
    primary: "#3b82f6", // Blue
    secondary: "#dbeafe", // Light blue
    dark: {
      primary: "#60a5fa",
      secondary: "#1e3a8a",
    },
  },
  expert: {
    primary: "#171717", // Black
    secondary: "#f5f5f5", // Light gray
    dark: {
      primary: "#a3a3a3", // Gray-400
      secondary: "#171717", // Gray-900
    },
  },
  client: {
    primary: "#8b5cf6", // Purple
    secondary: "#ede9fe", // Light purple
    dark: {
      primary: "#a78bfa",
      secondary: "#4c1d95",
    },
  },
  default: {
    primary: "#171717", // Default to black
    secondary: "#f5f5f5", // Light gray
    dark: {
      primary: "#a3a3a3",
      secondary: "#171717",
    },
  },
}

export function SqueedrLogo({
  className,
  isCollapsed = false,
  color,
  secondaryColor,
  useRoleColors = true,
  size = "md",
  responsiveSize,
}: SVGLogoProps) {
  // Get the current role and theme
  const { role } = useRole()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Handle window resize for responsive sizing
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)

      // Check if dark mode is active
      setIsDarkMode(document.documentElement.classList.contains("dark"))

      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }

      // Listen for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            setIsDarkMode(document.documentElement.classList.contains("dark"))
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })
      window.addEventListener("resize", handleResize)

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  // Determine colors based on role and theme
  const getColors = () => {
    if (!useRoleColors) {
      return {
        primary: color || "#171717",
        secondary: secondaryColor || "#f5f5f5",
      }
    }

    const roleColor = roleColors[role as keyof typeof roleColors] || roleColors.default

    if (isDarkMode) {
      return {
        primary: roleColor.dark.primary,
        secondary: roleColor.dark.secondary,
      }
    }

    return {
      primary: roleColor.primary,
      secondary: roleColor.secondary,
    }
  }

  const { primary, secondary } = getColors()

  // Determine size based on responsive settings and window width
  let currentSize = size

  if (size === "responsive" && responsiveSize && windowWidth !== null) {
    if (windowWidth >= 1280 && responsiveSize.xl) {
      currentSize = responsiveSize.xl
    } else if (windowWidth >= 1024 && responsiveSize.lg) {
      currentSize = responsiveSize.lg
    } else if (windowWidth >= 768 && responsiveSize.md) {
      currentSize = responsiveSize.md
    } else if (windowWidth >= 640 && responsiveSize.sm) {
      currentSize = responsiveSize.sm
    } else {
      currentSize = responsiveSize.default
    }
  }

  // Map size to font sizes and dimensions
  const sizeClasses = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }

  // For the collapsed state, adjust width to maintain square aspect ratio
  const collapsedSizeClasses = {
    xs: "text-sm h-6 w-6",
    sm: "text-base h-7 w-7",
    md: "text-lg h-8 w-8",
    lg: "text-xl h-10 w-10",
    xl: "text-2xl h-12 w-12",
  }

  const sizeClass = isCollapsed
    ? collapsedSizeClasses[currentSize as keyof typeof collapsedSizeClasses]
    : sizeClasses[currentSize as keyof typeof sizeClasses]

  // Full logo for expanded state
  if (!isCollapsed) {
    return (
      <div
        className={cn("logo-font tracking-tight transition-colors duration-300", sizeClass, className)}
        style={{ color: primary }}
      >
        Squeedr
      </div>
    )
  }

  // Compact logo for collapsed state - just the "S"
  return (
    <div
      className={cn(
        "logo-font flex items-center justify-center rounded-full transition-colors duration-300",
        sizeClass,
        className,
      )}
      style={{ backgroundColor: secondary, color: primary }}
    >
      S
    </div>
  )
}
