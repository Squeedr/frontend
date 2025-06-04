import { useCallback, useEffect, useRef, useState } from "react"

type FetchOptions = RequestInit & {
  params?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type")
  const isJson = contentType && contentType.includes("application/json")

  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new ApiError(response.statusText || "Request failed", response.status, data)
  }

  return data as T
}

export async function fetchApi<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  // Build URL with query parameters
  const url = new URL(endpoint, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })
  }

  // Set default headers
  const headers = new Headers(fetchOptions.headers)

  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  // Make the request
  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
    })

    return handleResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(error instanceof Error ? error.message : "Network error", 0)
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
}

// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>()

/**
 * Fetches data from an API with caching and request deduplication
 * @param url The URL to fetch from
 * @param options Fetch options
 * @param useCache Whether to use the cache
 * @returns The fetched data
 */
export async function fetchWithCache(
  url: string,
  options: RequestInit = {},
  useCache = true
): Promise<any> {
  const cacheKey = `${url}:${JSON.stringify(options)}`

  // Check cache if enabled
  if (useCache) {
    const cachedData = cache.get(cacheKey)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return cachedData.data
    }
  }

  // Check if there's a pending request for this URL
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }

  // Create a new request
  const request = fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      // Cache the response
      if (useCache) {
        cache.set(cacheKey, { data, timestamp: Date.now() })
      }
      return data
    })
    .finally(() => {
      // Remove from pending requests
      pendingRequests.delete(cacheKey)
    })

  // Store the pending request
  pendingRequests.set(cacheKey, request)

  return request
}

/**
 * Custom hook for fetching data with caching and request deduplication
 * @param url The URL to fetch from
 * @param options Fetch options
 * @param useCache Whether to use the cache
 * @returns An object containing the data, loading state, and error
 */
export function useFetch<T>(
  url: string,
  options: RequestInit = {},
  useCache = true
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchWithCache(
        url,
        {
          ...options,
          signal: abortControllerRef.current.signal,
        },
        useCache
      )
      setData(response)
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [url, options, useCache])

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

/**
 * Clears the cache for a specific URL or all URLs
 * @param url The URL to clear from the cache, or undefined to clear all
 */
export function clearCache(url?: string) {
  if (url) {
    // Clear cache for a specific URL
    for (const key of cache.keys()) {
      if (key.startsWith(url)) {
        cache.delete(key)
      }
    }
  } else {
    // Clear all cache
    cache.clear()
  }
}

/**
 * Prefetches data for a URL
 * @param url The URL to prefetch
 * @param options Fetch options
 */
export function prefetch(url: string, options: RequestInit = {}) {
  fetchWithCache(url, options, true).catch(() => {
    // Silently fail on prefetch
  })
}
