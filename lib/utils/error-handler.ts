import type React from "react"
import type { AppError } from "@/lib/types"

// In-memory error store for development
let errorStore: AppError[] = []

/**
 * Captures and logs an error
 */
export function captureError(error: Error, userId?: string, path?: string): AppError {
  console.error("Error captured:", error)

  const appError: AppError = {
    id: generateErrorId(),
    code: getErrorCode(error),
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    userId,
    path,
    resolved: false,
  }

  // In a real app, this would send to a logging service
  if (process.env.NODE_ENV === "development") {
    errorStore.push(appError)
  }

  return appError
}

/**
 * Gets all captured errors (for admin use)
 */
export function getErrors(): AppError[] {
  return errorStore
}

/**
 * Marks an error as resolved
 */
export function resolveError(errorId: string): boolean {
  const errorIndex = errorStore.findIndex((err) => err.id === errorId)
  if (errorIndex >= 0) {
    errorStore[errorIndex].resolved = true
    return true
  }
  return false
}

/**
 * Clears all resolved errors
 */
export function clearResolvedErrors(): number {
  const countBefore = errorStore.length
  errorStore = errorStore.filter((err) => !err.resolved)
  return countBefore - errorStore.length
}

/**
 * Generates a unique error ID
 */
function generateErrorId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * Gets an error code based on the error type
 */
function getErrorCode(error: Error): string {
  if (error.name === "TypeError") return "TYPE_ERROR"
  if (error.name === "SyntaxError") return "SYNTAX_ERROR"
  if (error.name === "ReferenceError") return "REFERENCE_ERROR"
  if (error.name === "RangeError") return "RANGE_ERROR"
  if (error.name === "URIError") return "URI_ERROR"
  if (error.name === "EvalError") return "EVAL_ERROR"
  return "UNKNOWN_ERROR"
}

/**
 * Error boundary component props
 */
export interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}

/**
 * Error boundary component state
 */
export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}
