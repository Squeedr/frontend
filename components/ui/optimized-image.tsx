"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { getImageWithFallback } from "@/lib/image-utils"

export interface OptimizedImageProps {
  src: string
  fallbackSrc?: string
  alt: string
  width?: number
  height?: number
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  quality?: number
  priority?: boolean
  className?: string
  skeletonClassName?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  fallbackSrc = "/placeholder.jpg",
  alt,
  width,
  height,
  objectFit = "cover",
  quality = 75,
  priority = false,
  className,
  skeletonClassName,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true)
    setHasError(false)
    setCurrentSrc(src)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    if (!hasError) {
      // Only try fallback once
      setHasError(true)
      setCurrentSrc(fallbackSrc)
      onError?.()
    } else {
      // If fallback also fails, show error state
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <Skeleton
          className={cn(
            "absolute inset-0 z-10",
            skeletonClassName
          )}
        />
      )}
      <Image
        src={getImageWithFallback(currentSrc, fallbackSrc)}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === "contain" && "object-contain",
          objectFit === "cover" && "object-cover",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down",
          className
        )}
      />
    </div>
  )
} 