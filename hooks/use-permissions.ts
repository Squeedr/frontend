import { useState, useEffect } from "react"

// Define user roles
export type UserRole = "admin" | "expert" | "user"

// Define permissions
export type Permission = 
  | "view_dashboard"
  | "view_sessions"
  | "book_sessions"
  | "manage_experts"
  | "manage_users"
  | "view_settings"

// Define role-based permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "view_dashboard",
    "view_sessions",
    "book_sessions",
    "manage_experts",
    "manage_users",
    "view_settings"
  ],
  expert: [
    "view_dashboard",
    "view_sessions",
    "book_sessions",
    "view_settings"
  ],
  user: [
    "view_dashboard",
    "view_sessions",
    "book_sessions",
    "view_settings"
  ]
}

/**
 * Hook for handling user permissions
 */
export function usePermissions(userRole: UserRole = "user") {
  const [permissions, setPermissions] = useState<Permission[]>([])

  useEffect(() => {
    // Set permissions based on user role
    setPermissions(rolePermissions[userRole] || [])
  }, [userRole])

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission)
  }

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission))
  }

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission))
  }

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  }
} 