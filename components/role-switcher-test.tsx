"use client"

import { useState, useEffect } from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"

export function RoleSwitcherTest() {
  const { role, setRole, isChangingRole, previousRole, roleTransitionState } = useRole()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Role Switching Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Current Role:</span>
          <RoleBadge role={role} />
        </div>

        {previousRole && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Previous Role:</span>
            <RoleBadge role={previousRole} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-medium">Transition State:</span>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">{roleTransitionState}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Is Changing:</span>
          <span
            className={`text-sm px-2 py-1 rounded ${isChangingRole ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
          >
            {isChangingRole ? "Yes" : "No"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button
            variant={role === "owner" ? "default" : "outline"}
            onClick={() => setRole("owner")}
            disabled={isChangingRole || role === "owner"}
          >
            Owner
          </Button>
          <Button
            variant={role === "expert" ? "default" : "outline"}
            onClick={() => setRole("expert")}
            disabled={isChangingRole || role === "expert"}
          >
            Expert
          </Button>
          <Button
            variant={role === "client" ? "default" : "outline"}
            onClick={() => setRole("client")}
            disabled={isChangingRole || role === "client"}
          >
            Client
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
