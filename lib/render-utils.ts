import { memo, useMemo, useCallback, ReactNode, ComponentType } from "react"

/**
 * Higher-order component that memoizes a component with a custom comparison function
 * @param Component Component to memoize
 * @param areEqual Custom comparison function
 * @returns Memoized component
 */
export function memoizeWithCustomComparison<P extends object>(
  Component: ComponentType<P>,
  areEqual: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, areEqual)
}

/**
 * Higher-order component that memoizes a component with a shallow comparison of specific props
 * @param Component Component to memoize
 * @param propKeys Keys of props to compare
 * @returns Memoized component
 */
export function memoizeWithShallowComparison<P extends object>(
  Component: ComponentType<P>,
  propKeys: Array<keyof P>
) {
  return memo(Component, (prevProps, nextProps) => {
    for (const key of propKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false
      }
    }
    return true
  })
}

/**
 * Higher-order component that memoizes a component with a deep comparison of specific props
 * @param Component Component to memoize
 * @param propKeys Keys of props to compare
 * @returns Memoized component
 */
export function memoizeWithDeepComparison<P extends object>(
  Component: ComponentType<P>,
  propKeys: Array<keyof P>
) {
  return memo(Component, (prevProps, nextProps) => {
    for (const key of propKeys) {
      if (JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])) {
        return false
      }
    }
    return true
  })
}

/**
 * Custom hook for memoizing a component's children
 * @param children Component children
 * @returns Memoized children
 */
export function useMemoizedChildren(children: ReactNode) {
  return useMemo(() => children, [children])
}

/**
 * Custom hook for memoizing a component's render function
 * @param renderFn Render function
 * @param deps Dependencies array
 * @returns Memoized render function
 */
export function useMemoizedRender<T>(
  renderFn: () => T,
  deps: any[]
) {
  return useMemo(renderFn, deps)
}

/**
 * Custom hook for memoizing a component's callback
 * @param callback Callback function
 * @param deps Dependencies array
 * @returns Memoized callback
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
) {
  return useCallback(callback, deps)
}

/**
 * Higher-order component that prevents re-renders if props haven't changed
 * @param Component Component to optimize
 * @returns Optimized component
 */
export function withRenderOptimization<P extends object>(
  Component: ComponentType<P>
) {
  return memo(Component)
}

/**
 * Higher-order component that prevents re-renders if specific props haven't changed
 * @param Component Component to optimize
 * @param propKeys Keys of props to compare
 * @returns Optimized component
 */
export function withSelectiveRenderOptimization<P extends object>(
  Component: ComponentType<P>,
  propKeys: Array<keyof P>
) {
  return memo(Component, (prevProps, nextProps) => {
    for (const key of propKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false
      }
    }
    return true
  })
} 