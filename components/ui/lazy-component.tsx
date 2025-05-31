"use client"

import { Suspense, lazy, ComponentType, ReactNode } from "react"

interface LazyComponentProps {
  importFn: () => Promise<{ default: ComponentType<any> }>
  fallback?: ReactNode
  props?: Record<string, any>
}

export function LazyComponent({
  importFn,
  fallback = <div className="w-full h-full flex items-center justify-center">Loading...</div>,
  props = {},
}: LazyComponentProps) {
  const Component = lazy(importFn)

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  )
}

// Example usage:
// const LazyModal = (props: Record<string, any>) => (
//   <LazyComponent
//     importFn={() => import("@/components/ui/modal")}
//     fallback={<div className="w-full h-full flex items-center justify-center">Loading modal...</div>}
//     props={props}
//   />
// ) 