"use client"

import { useEffect, useState } from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleSwitcher } from "@/components/role-switcher"

export default function RoleDebugPage() {
  const { role, setRole, isLoading } = useRole()
  const [mounted, setMounted] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      setLocalStorageValue(savedRole)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [role])

  const handleDirectRoleChange = (newRole: "owner" | "expert" | "client") => {
    setRole(newRole)
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Role Switching Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Role State</CardTitle>
            <CardDescription>Information about the current role state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Current Role:</p>
              <p className="text-lg bg-gray-100 p-2 rounded">{role}</p>
            </div>

            <div>
              <p className="font-medium">Loading:</p>
              <p className="text-lg bg-gray-100 p-2 rounded">{isLoading.toString()}</p>
            </div>

            <div>
              <p className="font-medium">localStorage Value:</p>
              <p className="text-lg bg-gray-100 p-2 rounded">{localStorageValue || "Not set"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Switching</CardTitle>
            <CardDescription>Test role switching functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="font-medium mb-2">Using RoleSwitcher Component:</p>
              <RoleSwitcher />
            </div>

            <div>
              <p className="font-medium mb-2">Direct Role Change:</p>
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

            <div>
              <p className="font-medium mb-2">Manual localStorage Update:</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    localStorage.setItem("squeedr-user-role", "owner")
                    setLocalStorageValue("owner")
                  }}
                  variant="outline"
                >
                  Set Owner
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem("squeedr-user-role", "expert")
                    setLocalStorageValue("expert")
                  }}
                  variant="outline"
                >
                  Set Expert
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem("squeedr-user-role", "client")
                    setLocalStorageValue("client")
                  }}
                  variant="outline"
                >
                  Set Client
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: This only updates localStorage, not the actual role state.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>If role switching doesn't work, check browser console for errors</li>
              <li>Make sure localStorage is enabled in your browser</li>
              <li>Try clearing your browser cache and reloading the page</li>
              <li>Verify that the RoleProvider is correctly set up in your app layout</li>
              <li>Check that the role state is being updated correctly in the RoleProvider</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
