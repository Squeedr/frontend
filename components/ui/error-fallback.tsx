"use client"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-red-50 text-red-700 rounded-t-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription className="text-red-600">
            We encountered an error while trying to process your request
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="bg-gray-50 p-3 rounded-md text-sm font-mono overflow-auto max-h-[200px]">
              {error.message}
            </div>
          )}
          <p className="mt-4 text-sm text-gray-600">
            Try refreshing the page or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
          {resetErrorBoundary && (
            <Button onClick={resetErrorBoundary} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
