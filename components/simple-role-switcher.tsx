"use client"

import { useState, useEffect } from "react"
import { useSimpleRole } from "@/hooks/use-simple-role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleRoleSwitcher() {
  const { role, setRole } = useSimpleRole()
  const [mounted, setMounted] = useState(false)
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(null)

  // Check if component is mounted
  useEffect(() => {
    setMounted(true)
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      setLocalStorageValue(savedRole)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Update localStorage display when role changes
  useEffect(() => {
    if (mounted) {
      try {
        const savedRole = localStorage.getItem("squeedr-user-role")
        setLocalStorageValue(savedRole)
      } catch (error) {
        console.error("Error accessing localStorage:", error)
      }
    }
  }, [role, mounted])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Simple Role Switcher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">
            Current Role: <span className="font-bold">{role}</span>
          </p>
          <p className="text-sm font-medium">
            localStorage Value: <span className="font-bold">{localStorageValue || "Not set"}</span>
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">Switch Role:</p>
          <div className="flex gap-2">
            <Button
              onClick={() => setRole("owner")}
              variant={role === "owner" ? "default" : "outline"}
              className={role === "owner" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Owner
            </Button>
            <Button
              onClick={() => setRole("expert")}
              variant={role === "expert" ? "default" : "outline"}
              className={role === "expert" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Expert
            </Button>
            <Button
              onClick={() => setRole("client")}
              variant={role === "client" ? "default" : "outline"}
              className={role === "client" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              Client
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">Manual localStorage Update:</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                localStorage.setItem("squeedr-user-role", "owner")
                setLocalStorageValue("owner")
              }}
              variant="outline"
              size="sm"
            >
              Set Owner
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("squeedr-user-role", "expert")
                setLocalStorageValue("expert")
              }}
              variant="outline"
              size="sm"
            >
              Set Expert
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem("squeedr-user-role", "client")
                setLocalStorageValue("client")
              }}
              variant="outline"
              size="sm"
            >
              Set Client
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-md border">
          <h4 className="text-sm font-medium mb-2">Troubleshooting:</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>If buttons don't work, check browser console for errors</li>
            <li>Try the manual localStorage buttons to test storage</li>
            <li>Refresh the page after changing localStorage to see if it persists</li>
            <li>Make sure cookies and localStorage are enabled in your browser</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
