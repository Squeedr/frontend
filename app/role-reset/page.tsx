"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function RoleResetPage() {
  const [status, setStatus] = useState<"checking" | "ready" | "success" | "error">("checking")
  const [message, setMessage] = useState<string>("Checking localStorage access...")
  const [canUseStorage, setCanUseStorage] = useState<boolean>(false)

  // Check if localStorage is accessible
  useEffect(() => {
    checkLocalStorage()
  }, [])

  const checkLocalStorage = () => {
    try {
      // Test if localStorage is accessible
      const testKey = "squeedr-storage-test"
      const testValue = `test-${Date.now()}`

      // Try to write
      localStorage.setItem(testKey, testValue)

      // Try to read
      const readValue = localStorage.getItem(testKey)

      // Verify
      if (readValue === testValue) {
        setCanUseStorage(true)
        setStatus("ready")
        setMessage("localStorage is accessible. Ready to reset role.")
      } else {
        setCanUseStorage(false)
        setStatus("error")
        setMessage(`localStorage verification failed: expected "${testValue}", got "${readValue}"`)
      }

      // Clean up
      localStorage.removeItem(testKey)
    } catch (err) {
      setCanUseStorage(false)
      setStatus("error")
      setMessage(`Error accessing localStorage: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const resetRole = () => {
    try {
      // Get current role for reporting
      const currentRole = localStorage.getItem("squeedr-user-role")

      // Remove the role
      localStorage.removeItem("squeedr-user-role")

      // Set to default
      localStorage.setItem("squeedr-user-role", "expert")

      // Verify
      const newRole = localStorage.getItem("squeedr-user-role")

      if (newRole === "expert") {
        setStatus("success")
        setMessage(`Role successfully reset from "${currentRole || "not set"}" to "expert"`)
      } else {
        setStatus("error")
        setMessage(`Role reset failed: expected "expert", got "${newRole}"`)
      }
    } catch (err) {
      setStatus("error")
      setMessage(`Error resetting role: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const goToDashboard = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Role Reset Tool</h1>

      {/* Status Alert */}
      <Alert
        className={`mb-6 ${
          status === "success"
            ? "bg-green-50 border-green-200"
            : status === "error"
              ? "bg-red-50 border-red-200"
              : status === "checking"
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
        }`}
      >
        {status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
        {status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
        {status === "checking" && <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />}

        <AlertTitle>
          {status === "success"
            ? "Success"
            : status === "error"
              ? "Error"
              : status === "checking"
                ? "Checking"
                : "Ready"}
        </AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Reset User Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This tool will reset your role to "expert" and fix any issues with role switching.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={resetRole}
              disabled={!canUseStorage || status === "checking"}
              className={status === "success" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Reset Role to Expert
            </Button>

            <Button onClick={goToDashboard} variant="outline" disabled={status === "checking"}>
              Go to Dashboard
            </Button>

            <Button
              onClick={checkLocalStorage}
              variant="outline"
              size="sm"
              disabled={status === "checking"}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Check localStorage Again
            </Button>
          </div>

          {status === "success" && (
            <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-4">
              <p className="text-sm text-green-800 font-medium">Role has been reset successfully!</p>
              <p className="text-xs text-green-700 mt-1">You can now go to the dashboard and try switching roles.</p>
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-red-50 rounded-md border border-red-200 mt-4">
              <p className="text-sm text-red-800 font-medium">There was a problem with localStorage</p>
              <p className="text-xs text-red-700 mt-1">
                Try using a different browser or disabling private/incognito mode.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>If problems persist after reset, try clearing your browser cache or using a different browser.</p>
      </div>
    </div>
  )
}
