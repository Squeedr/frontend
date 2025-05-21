"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRole } from "@/hooks/use-role"
import { Shield, Code, User, CheckCircle, AlertCircle } from "lucide-react"

export function TestRoleSwitcher() {
  const { role, setRole } = useRole()
  const [localStorageRole, setLocalStorageRole] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [actionStatus, setActionStatus] = useState<"success" | "error" | null>(null)
  const [mounted, setMounted] = useState(false)

  // Check localStorage on mount and after role changes
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("squeedr-user-role")
      setLocalStorageRole(storedRole)
      setMounted(true)
    } catch (error) {
      console.error("Error reading localStorage:", error)
      setLocalStorageRole("error")
    }
  }, [role])

  // Switch role function
  const switchRole = (newRole: "owner" | "expert" | "client") => {
    try {
      console.log(`TestRoleSwitcher: Switching to ${newRole} role`)
      setLastAction(`Switching to ${newRole} role`)

      // Save old role for verification
      const oldRole = role

      // Set new role
      setRole(newRole)

      // Verify localStorage was updated
      setTimeout(() => {
        try {
          const updatedRole = localStorage.getItem("squeedr-user-role")
          setLocalStorageRole(updatedRole)

          if (updatedRole === newRole) {
            console.log(`TestRoleSwitcher: Successfully switched to ${newRole} role`)
            setLastAction(`Switched to ${newRole} role`)
            setActionStatus("success")
          } else {
            console.error(
              `TestRoleSwitcher: Role switch verification failed. Expected: ${newRole}, Got: ${updatedRole}`,
            )
            setLastAction(`Failed to switch to ${newRole} role`)
            setActionStatus("error")
          }
        } catch (error) {
          console.error("Error reading localStorage after role switch:", error)
          setLastAction(`Error verifying role switch: ${error instanceof Error ? error.message : String(error)}`)
          setActionStatus("error")
        }
      }, 100)
    } catch (error) {
      console.error("Error switching role:", error)
      setLastAction(`Error switching role: ${error instanceof Error ? error.message : String(error)}`)
      setActionStatus("error")
    }
  }

  if (!mounted) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Role Switcher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md border mb-4">
          <div>
            <p className="text-sm font-medium mb-1">Current Role:</p>
            <p className="text-lg font-bold">{role || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">localStorage Value:</p>
            <p className="text-lg font-bold">{localStorageRole || "Not set"}</p>
          </div>
          {lastAction && (
            <div className="col-span-2">
              <p className="text-sm font-medium mb-1">Last Action:</p>
              <div className="flex items-center">
                {actionStatus === "success" && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                {actionStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                <p>{lastAction}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => switchRole("owner")}
            variant="outline"
            className={`flex items-center justify-center py-6 ${role === "owner" ? "bg-blue-100 border-blue-300" : ""}`}
          >
            <div className="flex flex-col items-center">
              <Shield className="h-6 w-6 mb-2 text-blue-600" />
              <span>Owner</span>
            </div>
          </Button>

          <Button
            onClick={() => switchRole("expert")}
            variant="outline"
            className={`flex items-center justify-center py-6 ${
              role === "expert" ? "bg-green-100 border-green-300" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <Code className="h-6 w-6 mb-2 text-green-600" />
              <span>Expert</span>
            </div>
          </Button>

          <Button
            onClick={() => switchRole("client")}
            variant="outline"
            className={`flex items-center justify-center py-6 ${
              role === "client" ? "bg-purple-100 border-purple-300" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <User className="h-6 w-6 mb-2 text-purple-600" />
              <span>Client</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
