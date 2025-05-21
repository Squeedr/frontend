"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { SqueedrLogo } from "./svg-logo"
import { useTheme } from "next-themes"

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "responsive"
  className?: string
  collapsed?: boolean
  useRoleColors?: boolean
  color?: string
  secondaryColor?: string
  responsiveSize?: {
    default: "xs" | "sm" | "md" | "lg" | "xl"
    sm?: "xs" | "sm" | "md" | "lg" | "xl"
    md?: "xs" | "sm" | "md" | "lg" | "xl"
    lg?: "xs" | "sm" | "md" | "lg" | "xl"
    xl?: "xs" | "sm" | "md" | "lg" | "xl"
  }
}

export function Logo({
  size = "md",
  className,
  collapsed = false,
  useRoleColors = true,
  color,
  secondaryColor,
  responsiveSize = {
    default: "sm",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "lg",
  },
}: LogoProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCollapsed, setPrevCollapsed] = useState(collapsed)
  const [displayMode, setDisplayMode] = useState<"full" | "letter">(collapsed ? "letter" : "full")
  const { theme } = useTheme()

  // Detect changes in collapsed state to trigger animation
  useEffect(() => {
    if (prevCollapsed !== collapsed) {
      setIsAnimating(true)

      // Wait a bit before changing the display mode to allow animation to play
      const displayTimer = setTimeout(() => {
        setDisplayMode(collapsed ? "letter" : "full")
      }, 150) // Half of animation time

      const animationTimer = setTimeout(() => {
        setIsAnimating(false)
      }, 600) // Animation duration + buffer

      setPrevCollapsed(collapsed)
      return () => {
        clearTimeout(displayTimer)
        clearTimeout(animationTimer)
      }
    }
  }, [collapsed, prevCollapsed])

  const containerClasses = cn("overflow-hidden transition-all duration-300 flex items-center justify-center", className)

  // Animation classes based on transition direction
  const animationClass = isAnimating ? (collapsed ? "logo-collapsing" : "logo-expanding") : ""

  return (
    <div className={cn(containerClasses, animationClass)}>
      <div className={cn(isAnimating ? "logo-svg-animate" : "")}>
        <SqueedrLogo
          isCollapsed={displayMode === "letter"}
          color={color}
          secondaryColor={secondaryColor}
          useRoleColors={useRoleColors}
          size={size === "responsive" ? "responsive" : size}
          responsiveSize={responsiveSize}
        />
      </div>
    </div>
  )
}
