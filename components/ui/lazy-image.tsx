"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getImageWithFallback } from "@/lib/image-utils"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder.jpg",
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  objectFit = "cover",
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(priority)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {isInView ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fallbackSrc={fallbackSrc}
          quality={quality}
          priority={priority}
          objectFit={objectFit}
          className={cn(
            fill && "absolute inset-0 w-full h-full"
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
} 