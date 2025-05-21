"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function StandaloneRoleTest() {
  // Local state for role
  const [role, setRole] = useState<string>("loading...")
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [testId, setTestId] = useState<string>(`test-${Date.now()}`)

  // Load initial role from localStorage
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      setRole(savedRole || "not set")
      setMessage(`Initial role loaded: ${savedRole || "not set"}`)
    } catch (err) {
      setError(`Error reading from localStorage: ${err instanceof Error ? err.message : String(err)}`)
      setRole("error")
    }
  }, [])

  // Function to change role
  const changeRole = (newRole: string) => {
    setMessage(`Attempting to change role to: ${newRole}`)

    try {
      // Save to localStorage
      localStorage.setItem("squeedr-user-role", newRole)
      setMessage((prev) => `${prev}\nSaved to localStorage: ${newRole}`)

      // Update state
      setRole(newRole)
      setMessage((prev) => `${prev}\nUpdated state: ${newRole}`)

      // Verify localStorage was updated
      const verifyRole = localStorage.getItem("squeedr-user-role")
      setMessage((prev) => `${prev}\nVerified localStorage: ${verifyRole}`)

      if (verifyRole !== newRole) {
        setError(`Verification failed: expected ${newRole}, got ${verifyRole}`)
      } else {
        setError(null)
      }
    } catch (err) {
      setError(`Error changing role: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Function to test localStorage directly
  const testLocalStorage = () => {
    const testValue = `test-value-${Date.now()}`
    setMessage(`Testing localStorage with value: ${testValue}`)

    try {
      // Test writing
      localStorage.setItem("squeedr-test-key", testValue)
      setMessage((prev) => `${prev}\nWrote test value to localStorage`)

      // Test reading
      const readValue = localStorage.getItem("squeedr-test-key")
      setMessage((prev) => `${prev}\nRead test value from localStorage: ${readValue}`)

      if (readValue !== testValue) {
        setError(`localStorage test failed: expected ${testValue}, got ${readValue}`)
      } else {
        setMessage((prev) => `${prev}\nlocalStorage test PASSED!`)
        setError(null)
      }
    } catch (err) {
      setError(`localStorage test error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Function to clear localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem("squeedr-user-role")
      setMessage("Cleared squeedr-user-role from localStorage")
      setRole("not set")
    } catch (err) {
      setError(`Error clearing localStorage: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Function to reload the page
  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Standalone Role Test</h1>
      <p className="mb-2">Test ID: {testId}</p>

      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <h2 className="font-semibold mb-2">Current State:</h2>
        <p>
          <strong>Current Role:</strong> {role}
        </p>
        {error && (
          <p className="text-red-600 mt-2">
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold mb-2">Change Role:</h2>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => changeRole("owner")} variant="outline" className="bg-blue-100">
              Set to Owner
            </Button>
            <Button onClick={() => changeRole("expert")} variant="outline" className="bg-green-100">
              Set to Expert
            </Button>
            <Button onClick={() => changeRole("client")} variant="outline" className="bg-purple-100">
              Set to Client
            </Button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Utilities:</h2>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testLocalStorage} variant="outline">
              Test localStorage
            </Button>
            <Button onClick={clearStorage} variant="outline" className="bg-red-100">
              Clear Role
            </Button>
            <Button onClick={reloadPage} variant="outline" className="bg-yellow-100">
              Reload Page
            </Button>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Debug Log:</h2>
          <pre className="whitespace-pre-wrap text-sm bg-white p-2 rounded border">{message || "No messages yet"}</pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h2 className="font-semibold mb-2 text-blue-800">Instructions:</h2>
          <ol className="list-decimal pl-5 space-y-1 text-blue-800">
            <li>First, click "Test localStorage" to verify browser storage is working</li>
            <li>Try setting the role to different values using the buttons above</li>
            <li>Check if the "Current Role" updates correctly</li>
            <li>Click "Reload Page" to see if the role persists after reload</li>
            <li>If the role changes but doesn't persist, there's an issue with localStorage</li>
            <li>If localStorage tests pass but role switching fails, there's an issue with the role management</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
