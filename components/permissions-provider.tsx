import { createContext, useContext, ReactNode } from "react"
import { usePermissions, Permission, UserRole } from "@/hooks/permissions-provider"
import { useRole } from "@/hooks/use-role"

interface PermissionsContextType {
  checkPermission: (permission: Permission | Permission[]) => boolean
  userPermissions: Permission[]
  isLoading: boolean
  currentRole: UserRole
  availableRoles: UserRole[]
  changeRole: (role: UserRole) => void
  hasRole: (role: UserRole) => boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

interface PermissionsProviderProps {
  children: ReactNode
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { role, isLoading: roleLoading } = useRole()
  const { checkPermission, userPermissions, isLoading } = usePermissions()

  // Mock implementation for the additional properties
  const availableRoles: UserRole[] = ["owner", "expert", "client"]
  const changeRole = (newRole: UserRole) => {
    // This would be implemented to actually change the role
    console.log(`Changing role to ${newRole}`)
  }
  const hasRole = (roleToCheck: UserRole) => role === roleToCheck

  const value = {
    checkPermission,
    userPermissions,
    isLoading,
    currentRole: role,
    availableRoles,
    changeRole,
    hasRole
  }

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissionsContext() {
  const context = useContext(PermissionsContext)
  
  if (context === undefined) {
    throw new Error("usePermissionsContext must be used within a PermissionsProvider")
  }
  
  return context
} 