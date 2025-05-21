"use client"

import { useEffect, useState } from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DirectRoleTestPage() {
  const { role, setRole } = useRole()
  const [mounted, setMounted] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      setLocalStorageValue(savedRole)
    } catch (error) {
      setError("Error accessing localStorage: " + (error instanceof Error ? error.message : String(error)))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        const savedRole = localStorage.getItem("squeedr-user-role")
        setLocalStorageValue(savedRole)
      } catch (error) {
        setError("Error accessing localStorage: " + (error instanceof Error ? error.message : String(error)))
      }
    }
  }, [role, mounted])

  const handleDirectRoleChange = (newRole: "owner" | "expert" | "client") => {
    try {
      console.log("Changing role to:", newRole)
      setRole(newRole)
      console.log("Role changed to:", newRole)
    } catch (error) {
      setError("Error changing role: " + (error instanceof Error ? error.message : String(error)))
      console.error("Error changing role:", error)
    }
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Direct Role Test</h1>
      <p className="mb-6 text-gray-600">
        This page uses the main application's role provider but with direct role switching.
      </p>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Direct Role Switcher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium">
              Current Role: <span className="font-bold">{role}</span>
            </p>
            <p className="text-sm font-medium">
              localStorage Value: <span className="font-bold">{localStorageValue || "Not set"}</span>
            </p>
            {error && (
              <p className="text-sm font-medium text-red-500">
                Error: <span className="font-bold">{error}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium">Switch Role Directly:</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDirectRoleChange("owner")}
                variant={role === "owner" ? "default" : "outline"}
                className={role === "owner" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                Owner
              </Button>
              <Button
                onClick={() => handleDirectRoleChange("expert")}
                variant={role === "expert" ? "default" : "outline"}
                className={role === "expert" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Expert
              </Button>
              <Button
                onClick={() => handleDirectRoleChange("client")}
                variant={role === "client" ? "default" : "outline"}
                className={role === "client" ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                Client
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2 text-blue-700">
          <li>Click one of the role buttons above to directly change your role</li>
          <li>Check if the "Current Role" value updates</li>
          <li>Check if the "localStorage Value" updates</li>
          <li>Refresh the page to see if the role persists</li>
          <li>Check the browser console for any errors</li>
        </ol>
      </div>
    </div>
  )
}
