"use client"

import { useRef, useEffect } from "react"
import { useVirtualization } from "@/lib/performance-utils"

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
  className,
  onScroll,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    setScrollTop,
  } = useVirtualization(items, itemHeight, containerHeight, overscan)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const newScrollTop = containerRef.current.scrollTop
        setScrollTop(newScrollTop)
        onScroll?.(newScrollTop)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [setScrollTop, onScroll])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: containerHeight,
        overflow: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: offsetY,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 