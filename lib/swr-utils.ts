import useSWR, { SWRConfiguration, SWRResponse } from "swr"
import { useCallback } from "react"

/**
 * Custom hook for fetching data with SWR
 * @param key Key for the data
 * @param fetcher Function to fetch the data
 * @param options SWR options
 * @returns SWR response
 */
export function useData<T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  options?: SWRConfiguration
): SWRResponse<T, Error> {
  return useSWR<T, Error>(key, fetcher, options)
}

/**
 * Custom hook for fetching data with SWR and automatic revalidation
 * @param key Key for the data
 * @param fetcher Function to fetch the data
 * @param options SWR options
 * @returns SWR response and revalidation function
 */
export function useDataWithRevalidation<T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  options?: SWRConfiguration
): [SWRResponse<T, Error>, () => Promise<T | undefined>] {
  const response = useSWR<T, Error>(key, fetcher, options)
  const revalidate = useCallback(() => response.mutate(), [response])
  return [response, revalidate]
}

/**
 * Custom hook for fetching data with SWR and optimistic updates
 * @param key Key for the data
 * @param fetcher Function to fetch the data
 * @param options SWR options
 * @returns SWR response and optimistic update function
 */
export function useDataWithOptimisticUpdates<T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  options?: SWRConfiguration
): [SWRResponse<T, Error>, (data: T) => void] {
  const response = useSWR<T, Error>(key, fetcher, options)
  const optimisticUpdate = useCallback(
    (data: T) => {
      response.mutate(data, false)
    },
    [response]
  )
  return [response, optimisticUpdate]
}

/**
 * Custom hook for fetching data with SWR and infinite loading
 * @param getKey Function to get the key for the data
 * @param fetcher Function to fetch the data
 * @param options SWR options
 * @returns SWR response and load more function
 */
export function useInfiniteData<T>(
  getKey: (pageIndex: number, previousPageData: T | null) => string | null,
  fetcher: (url: string) => Promise<T>,
  options?: SWRConfiguration
): [SWRResponse<T[], Error>, () => void] {
  const response = useSWR<T[], Error>(
    () => getKey(0, null),
    fetcher,
    options
  )

  const loadMore = useCallback(() => {
    if (!response.data) return

    const nextPageIndex = response.data.length
    const nextKey = getKey(nextPageIndex, response.data[nextPageIndex - 1])

    if (nextKey) {
      response.mutate([...response.data, null], false)
      fetcher(nextKey).then((nextPageData) => {
        response.mutate([...response.data, nextPageData], false)
      })
    }
  }, [response, getKey, fetcher])

  return [response, loadMore]
}

/**
 * Custom hook for prefetching data with SWR
 * @param key Key for the data
 * @param fetcher Function to fetch the data
 * @param options SWR options
 * @returns Prefetch function
 */
export function usePrefetch<T>(
  key: string | null,
  fetcher: (url: string) => Promise<T>,
  options?: SWRConfiguration
): () => void {
  const prefetch = useCallback(() => {
    if (key) {
      fetcher(key).catch(() => {
        // Silently fail on prefetch
      })
    }
  }, [key, fetcher])

  return prefetch
} 