import { useCallback, useMemo, useRef, useState } from "react"

/**
 * Custom hook for memoizing expensive computations
 * @param factory Function that returns the computed value
 * @param deps Dependencies array
 * @returns Memoized value
 */
export function useMemoizedValue<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps)
}

/**
 * Custom hook for memoizing callbacks
 * @param callback Function to memoize
 * @param deps Dependencies array
 * @returns Memoized callback
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T {
  return useCallback(callback, deps)
}

/**
 * Custom hook for debouncing function calls
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  ) as T
}

/**
 * Custom hook for throttling function calls
 * @param callback Function to throttle
 * @param limit Limit in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const lastRun = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (!lastRun.current) {
        callback(...args)
        lastRun.current = Date.now()
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          if (Date.now() - lastRun.current >= limit) {
            callback(...args)
            lastRun.current = Date.now()
          }
        }, limit - (Date.now() - lastRun.current))
      }
    },
    [callback, limit]
  ) as T
}

/**
 * Custom hook for virtualizing lists
 * @param items Array of items to virtualize
 * @param itemHeight Height of each item in pixels
 * @param containerHeight Height of the container in pixels
 * @param overscan Number of items to render outside the visible area
 * @returns Object containing visible items and their indices
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    setScrollTop,
  }
} 