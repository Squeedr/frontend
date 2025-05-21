import type { ReactNode } from "react"
import { usePermissions } from "@/hooks/permissions-provider"
import type { Permission } from "@/lib/permissions"

interface PermissionRequiredProps {
  children: ReactNode
  permissions: Permission | Permission[]
  fallback?: ReactNode
}

export function PermissionRequired({ children, permissions, fallback = null }: PermissionRequiredProps) {
  const { checkPermission } = usePermissions()

  if (!checkPermission(permissions)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
