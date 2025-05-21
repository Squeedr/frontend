"use client"

import React, { Component, type ErrorInfo, type ReactNode } from "react"
import { captureError } from "@/lib/utils/error-handler"

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error tracking system
    captureError(error)

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  const showBoundary = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  return { error, showBoundary }
}
