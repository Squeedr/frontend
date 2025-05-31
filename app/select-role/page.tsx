"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RoleSelectionPage } from "@/components/role-selection-modal"
import { useRole } from "@/hooks/use-role"

export default function SelectRolePage() {
  const { needsRoleSelection, availableRoles, user, isLoading } = useRole()
  const router = useRouter()

  useEffect(() => {
    // Redirect if no role selection is needed
    if (!isLoading && (!needsRoleSelection || availableRoles.length <= 1)) {
      router.replace("/dashboard")
    }
  }, [needsRoleSelection, availableRoles.length, isLoading, router])

  useEffect(() => {
    // Redirect if user is not logged in
    if (!isLoading && !user) {
      router.replace("/auth")
    }
  }, [user, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if conditions aren't met (will redirect)
  if (!needsRoleSelection || availableRoles.length <= 1 || !user) {
    return null
  }

  return <RoleSelectionPage />
} 