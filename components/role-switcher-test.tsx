"use client"

import { useState, useEffect } from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"

export function RoleSwitcherTest() {
  const { role, setRole, isLoading } = useRole()
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

        <div className="flex items-center gap-2">
          <span className="font-medium">Loading:</span>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">{isLoading.toString()}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button
            variant={role === "owner" ? "default" : "outline"}
            onClick={() => setRole("owner")}
            disabled={isLoading || role === "owner"}
          >
            Owner
          </Button>
          <Button
            variant={role === "expert" ? "default" : "outline"}
            onClick={() => setRole("expert")}
            disabled={isLoading || role === "expert"}
          >
            Expert
          </Button>
          <Button
            variant={role === "client" ? "default" : "outline"}
            onClick={() => setRole("client")}
            disabled={isLoading || role === "client"}
          >
            Client
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
