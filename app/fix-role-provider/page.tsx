"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function FixRoleProviderPage() {
  const [currentRole, setCurrentRole] = useState<string>("loading...")
  const [localStorageValue, setLocalStorageValue] = useState<string>("checking...")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const { toast } = useToast()

  // Check current state on load
  useEffect(() => {
    checkCurrentState()
  }, [])

  // Function to check current state
  const checkCurrentState = () => {
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      setLocalStorageValue(savedRole || "not set")
      setCurrentRole(savedRole || "not set")
      setMessage("Current state checked successfully")
      setStatus("success")
    } catch (err) {
      setMessage(`Error checking state: ${err instanceof Error ? err.message : String(err)}`)
      setStatus("error")
    }
  }

  // Function to fix role provider
  const fixRoleProvider = () => {
    try {
      // 1. Clear any existing role
      localStorage.removeItem("squeedr-user-role")
      setMessage("Cleared existing role")

      // 2. Set default role
      localStorage.setItem("squeedr-user-role", "expert")
      setMessage((prev) => `${prev}\nSet default role to 'expert'`)

      // 3. Verify it was set
      const verifyRole = localStorage.getItem("squeedr-user-role")
      if (verifyRole === "expert") {
        setMessage((prev) => `${prev}\nVerified role was set correctly`)
        setStatus("success")

        // 4. Update state
        setCurrentRole("expert")
        setLocalStorageValue("expert")

        // 5. Show success toast
        toast({
          title: "Role Provider Fixed",
          description: "Default role has been set to 'expert'",
          duration: 3000,
        })
      } else {
        setMessage((prev) => `${prev}\nVerification failed: expected 'expert', got '${verifyRole}'`)
        setStatus("error")
      }
    } catch (err) {
      setMessage(`Error fixing role provider: ${err instanceof Error ? err.message : String(err)}`)
      setStatus("error")
    }
  }

  // Function to test role switching
  const testRoleSwitch = (newRole: string) => {
    try {
      // 1. Save to localStorage
      localStorage.setItem("squeedr-user-role", newRole)
      setMessage(`Set role to '${newRole}'`)

      // 2. Verify it was set
      const verifyRole = localStorage.getItem("squeedr-user-role")
      if (verifyRole === newRole) {
        setMessage((prev) => `${prev}\nVerified role was set to '${newRole}'`)
        setStatus("success")

        // 3. Update state
        setCurrentRole(newRole)
        setLocalStorageValue(newRole)

        // 4. Show success toast
        toast({
          title: "Role Changed",
          description: `Role has been changed to '${newRole}'`,
          duration: 3000,
        })
      } else {
        setMessage((prev) => `${prev}\nVerification failed: expected '${newRole}', got '${verifyRole}'`)
        setStatus("error")
      }
    } catch (err) {
      setMessage(`Error testing role switch: ${err instanceof Error ? err.message : String(err)}`)
      setStatus("error")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Fix Role Provider</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Current Role:</strong> {currentRole}
            </p>
            <p>
              <strong>localStorage Value:</strong> {localStorageValue}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-600"
                }
              >
                {status}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Fix Role Provider:</h3>
              <Button onClick={fixRoleProvider} className="bg-green-600 hover:bg-green-700">
                Reset & Fix Role Provider
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                This will reset the role to 'expert' and ensure localStorage is working correctly.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Test Role Switching:</h3>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => testRoleSwitch("owner")} variant="outline" className="bg-blue-100">
                  Switch to Owner
                </Button>
                <Button onClick={() => testRoleSwitch("expert")} variant="outline" className="bg-green-100">
                  Switch to Expert
                </Button>
                <Button onClick={() => testRoleSwitch("client")} variant="outline" className="bg-purple-100">
                  Switch to Client
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Utilities:</h3>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={checkCurrentState} variant="outline">
                  Refresh State
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="bg-yellow-100">
                  Reload Page
                </Button>
                <Button onClick={() => (window.location.href = "/dashboard")} variant="outline">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debug Log</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded border">
            {message || "No messages yet"}
          </pre>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h2 className="font-semibold mb-2 text-blue-800">Next Steps After Fixing:</h2>
        <ol className="list-decimal pl-5 space-y-1 text-blue-800">
          <li>After fixing the role provider, go to the dashboard to see if role switching works</li>
          <li>If it still doesn't work, try clearing your browser cache and cookies</li>
          <li>If issues persist, try using a different browser</li>
          <li>Make sure you're not in private/incognito mode, which can limit localStorage</li>
        </ol>
      </div>
    </div>
  )
}
