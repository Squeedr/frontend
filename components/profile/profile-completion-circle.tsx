"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  calculateProfileCompletion,
  getCompletionColor,
  getCompletionBgColor,
  type UserProfileData,
} from "@/lib/profile-completion"

interface ProfileCompletionCircleProps {
  profile: UserProfileData
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function ProfileCompletionCircle({
  profile,
  size = "md",
  showLabel = true,
  className,
}: ProfileCompletionCircleProps) {
  const [mounted, setMounted] = useState(false)
  const { percentage } = calculateProfileCompletion(profile)
  const completionColor = getCompletionColor(percentage)
  const completionBgColor = getCompletionBgColor(percentage)

  // Handle SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Size mappings
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-16 w-16 text-base",
    lg: "h-24 w-24 text-xl",
  }

  // Calculate circle properties
  const radius = size === "sm" ? 15 : size === "md" ? 30 : 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />

          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={completionColor}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center font-semibold">{percentage}%</div>
      </div>

      {/* Status indicator */}
      {showLabel && (
        <div className={cn("flex items-center mt-2 text-sm gap-1", completionColor)}>
          {percentage === 100 ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>Incomplete</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
