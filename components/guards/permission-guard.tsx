"use client"

import type { ReactNode } from "react"
import { usePermissions } from "@/hooks/permissions-provider"
import { useRole } from "@/hooks/use-role"
import type { Permission } from "@/lib/permissions"
import type { UserRole } from "@/lib/types"

interface PermissionGuardProps {
  children: ReactNode
  requiredPermission?: Permission | Permission[]
  allowedRoles?: UserRole[]
  fallback?: ReactNode
}

export function PermissionGuard({
  children,
  requiredPermission,
  allowedRoles,
  fallback = <div className="p-4 text-center">You don't have permission to view this content.</div>,
}: PermissionGuardProps) {
  const { checkPermission } = usePermissions()
  const { role } = useRole()

  // Check if user has required role
  const hasAllowedRole = allowedRoles ? allowedRoles.includes(role) : true

  // Check if user has required permission
  const hasRequiredPermission = requiredPermission ? checkPermission(requiredPermission) : true

  // User needs to have both an allowed role (if specified) and the required permission (if specified)
  if (!hasAllowedRole || !hasRequiredPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
