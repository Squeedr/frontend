"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRole } from "@/hooks/use-role"
import { getPermissionsForRole, type Permission } from "@/lib/permissions"
import type { UserRole } from "@/lib/types"

// Re-export the Permission type
export type { Permission, UserRole }

interface PermissionsContextType {
  checkPermission: (permission: Permission | Permission[]) => boolean
  userPermissions: Permission[]
  isLoading: boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { role, isLoading: roleLoading } = useRole()
  const [userPermissions, setUserPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!roleLoading) {
      // Get permissions based on user role
      const permissions = getPermissionsForRole(role)
      setUserPermissions(permissions)
      setIsLoading(false)
    }
  }, [role, roleLoading])

  const checkPermission = (requiredPermission: Permission | Permission[]): boolean => {
    if (isLoading) return false

    if (Array.isArray(requiredPermission)) {
      // If any of the permissions are required, check if user has at least one
      return requiredPermission.some((permission) => userPermissions.includes(permission))
    }

    // Check for a single permission
    return userPermissions.includes(requiredPermission)
  }

  return (
    <PermissionsContext.Provider value={{ checkPermission, userPermissions, isLoading }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return context
} 