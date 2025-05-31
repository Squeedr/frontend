"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Role = "owner" | "expert" | "client"

interface AppRole {
  id: number
  name: string
}

interface User {
  id: number
  username: string
  email: string
  app_roles: AppRole[]
}

interface RoleContextType {
  // Current active role
  role: Role | null
  setRole: (role: Role) => void
  isLoading: boolean
  
  // Multiple roles support
  availableRoles: Role[]
  setAvailableRoles: (roles: Role[]) => void
  needsRoleSelection: boolean
  setNeedsRoleSelection: (needs: boolean) => void
  
  // User data
  user: User | null
  setUser: (user: User | null) => void
  
  // JWT token
  token: string | null
  setToken: (token: string | null) => void
  
  // Role selection methods
  selectRole: (role: Role) => void
  switchRole: (role: Role) => void
  saveRoleSelections: (roles: Role[]) => void
  logout: () => void
  
  // Login response processor
  processLoginResponse: (loginData: { jwt: string; user: User }) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()

  // Load persisted data from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      const savedUser = localStorage.getItem("squeedr-user")
      const savedToken = localStorage.getItem("squeedr-token")
      const savedAvailableRoles = localStorage.getItem("squeedr-available-roles")
      
      if (savedToken) {
        setToken(savedToken)
      }
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        
        // Extract available roles from user data
        if (parsedUser.app_roles && Array.isArray(parsedUser.app_roles)) {
          const roles = parsedUser.app_roles
            .map((appRole: AppRole) => appRole.name.toLowerCase() as Role)
            .filter((roleName: string): roleName is Role => 
              ["owner", "expert", "client"].includes(roleName)
            )
          setAvailableRoles(roles)
        }
      } else if (savedAvailableRoles) {
        setAvailableRoles(JSON.parse(savedAvailableRoles))
      }
      
      if (savedRole === "owner" || savedRole === "expert" || savedRole === "client") {
        setRoleState(savedRole)
      } else {
        // If no valid role is saved, default to client after loading
        setRoleState("client")
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      setIsLoading(false)
    }
  }, [])

  // Handle post-login role processing
  const processLoginResponse = async (loginData: { jwt: string; user: User }) => {
    const { jwt, user: userData } = loginData
    
    // Store JWT token
    setToken(jwt)
    localStorage.setItem("squeedr-token", jwt)
    localStorage.setItem("jwt", jwt) // Use 'jwt' key as primary (backend expects this)
    
    // Store user data
    setUser(userData)
    localStorage.setItem("squeedr-user", JSON.stringify(userData))
    
    // Check if user has app_roles from Strapi backend (this is the primary method)
    if (userData.app_roles && userData.app_roles.length > 0) {
      // Extract role names from app_roles array
      const backendRoles = userData.app_roles
        .map((appRole: AppRole) => appRole.name.toLowerCase() as Role)
        .filter((roleName: string): roleName is Role => 
          ["owner", "expert", "client"].includes(roleName)
        )
      
      if (backendRoles.length > 0) {
        // Use the first role as primary (backend assigns one role per user)
        const primaryRole = backendRoles[0]
        
        setRoleState(primaryRole)
        localStorage.setItem("squeedr-user-role", primaryRole)
        setAvailableRoles(backendRoles)
        localStorage.setItem("squeedr-available-roles", JSON.stringify(backendRoles))
        setNeedsRoleSelection(false)
        
        // Redirect to dashboard with role-specific content
        router.push(getRoleDashboardPath(primaryRole))
        
        toast({
          title: "Welcome!",
          description: `Logged in as ${primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}`,
          duration: 3000,
        })
        return
      }
    }
    
    // If app_roles not populated in login/register response, fetch fresh user data
    try {
      console.log("app_roles not found in login response, fetching current user...")
      const { authApi } = await import("@/lib/api/auth")
      const freshUserData = await authApi.getCurrentUser()
      
      if (freshUserData.app_roles && freshUserData.app_roles.length > 0) {
        // Extract role names from app_roles array
        const backendRoles = freshUserData.app_roles
          .map((appRole: AppRole) => appRole.name.toLowerCase() as Role)
          .filter((roleName: string): roleName is Role => 
            ["owner", "expert", "client"].includes(roleName)
          )
        
        if (backendRoles.length > 0) {
          // Use the first role as primary (backend assigns one role per user)
          const primaryRole = backendRoles[0]
          
          setRoleState(primaryRole)
          localStorage.setItem("squeedr-user-role", primaryRole)
          setAvailableRoles(backendRoles)
          localStorage.setItem("squeedr-available-roles", JSON.stringify(backendRoles))
          setNeedsRoleSelection(false)
          
          // Update user data with fresh data
          setUser(freshUserData)
          localStorage.setItem("squeedr-user", JSON.stringify(freshUserData))
          
          // Redirect to dashboard with role-specific content
          router.push(getRoleDashboardPath(primaryRole))
          
          toast({
            title: "Welcome!",
            description: `Logged in as ${primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1)}`,
            duration: 3000,
          })
          return
        }
      }
    } catch (error) {
      console.error("Failed to fetch fresh user data:", error)
    }
    
    // Fallback for users without proper app_roles (shouldn't happen with fixed backend)
    console.warn("User logged in without app_roles array - this should not happen with proper backend setup")
    
    // Default to client role for backward compatibility
    const fallbackRole: Role = "client"
    setRoleState(fallbackRole)
    localStorage.setItem("squeedr-user-role", fallbackRole)
    setAvailableRoles([fallbackRole])
    localStorage.setItem("squeedr-available-roles", JSON.stringify([fallbackRole]))
    setNeedsRoleSelection(false)
    
    router.push(getRoleDashboardPath(fallbackRole))
    
    toast({
      title: "Welcome!",
      description: "Logged in with default client role",
      duration: 3000,
    })
  }

  const getRoleDashboardPath = (role: Role): string => {
    // Always redirect to main dashboard which handles role-specific content
    // instead of role-specific routes that just redirect back
    return "/dashboard"
  }

  const selectRole = (selectedRole: Role) => {
    try {
      // Update role state FIRST
      setRoleState(selectedRole)
      localStorage.setItem("squeedr-user-role", selectedRole)
      
      // Add selected role to user's role list if not already present
      const savedUserRoles = localStorage.getItem("squeedr-user-selected-roles")
      const userSelectedRoles = savedUserRoles ? JSON.parse(savedUserRoles) : []
      
      if (!userSelectedRoles.includes(selectedRole)) {
        userSelectedRoles.push(selectedRole)
        localStorage.setItem("squeedr-user-selected-roles", JSON.stringify(userSelectedRoles))
        setAvailableRoles(userSelectedRoles)
      }
      
      // Clear role selection flag
      setNeedsRoleSelection(false)
      
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        // Redirect to main dashboard which will show role-specific content
        router.push(getRoleDashboardPath(selectedRole))
        
        toast({
          title: "Role Selected",
          description: `Now acting as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
          duration: 3000,
        })
      }, 100)
      
    } catch (error) {
      console.error("Error selecting role:", error)
      toast({
        title: "Error",
        description: "Failed to select role. Please try again.",
        variant: "destructive",
      })
    }
  }

  // New method to save multiple role selections at once
  const saveRoleSelections = (roles: Role[]) => {
    try {
      localStorage.setItem("squeedr-user-selected-roles", JSON.stringify(roles))
      setAvailableRoles(roles)
      
      toast({
        title: "Roles Saved",
        description: `You can now switch between: ${roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}`,
        duration: 4000,
      })
    } catch (error) {
      console.error("Error saving role selections:", error)
      toast({
        title: "Error",
        description: "Failed to save role selections. Please try again.",
        variant: "destructive",
      })
    }
  }

  const switchRole = (newRole: Role) => {
    if (!availableRoles.includes(newRole)) {
      toast({
        title: "Invalid Role",
        description: "You don't have permission for this role",
        variant: "destructive",
      })
      return
    }

    if (newRole === role) return

    try {
      // Update localStorage and state FIRST
      localStorage.setItem("squeedr-user-role", newRole)
      setRoleState(newRole)
      
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        // Redirect to dashboard which will show role-specific content
        router.push(getRoleDashboardPath(newRole))
        
        // Show toast notification
        toast({
          title: "Role Switched",
          description: `Now acting as ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
          duration: 3000,
        })
      }, 100)
      
    } catch (error) {
      console.error("Error switching role:", error)
      toast({
        title: "Error",
        description: "Failed to switch role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const setRole = (newRole: Role) => {
    switchRole(newRole)
  }

  const logout = () => {
    try {
      // Clear all stored data
      localStorage.removeItem("squeedr-user-role")
      localStorage.removeItem("squeedr-user")
      localStorage.removeItem("squeedr-token")
      localStorage.removeItem("squeedr-available-roles")
      localStorage.removeItem("squeedr-user-selected-roles") // Clear user-selected roles
      localStorage.removeItem("jwt") // Backward compatibility
      
      // Reset state
      setRoleState(null)
      setUser(null)
      setToken(null)
      setAvailableRoles([])
      setNeedsRoleSelection(false)
      
      // Redirect to auth page
      router.push("/auth")
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isLoading,
        availableRoles,
        setAvailableRoles,
        needsRoleSelection,
        setNeedsRoleSelection,
        user,
        setUser,
        token,
        setToken,
        selectRole,
        switchRole,
        saveRoleSelections,
        logout,
        processLoginResponse,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

// Export types for use in other components
export type { Role, AppRole, User }
