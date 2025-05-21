"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Role = "owner" | "expert" | "client"

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  isLoading: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("expert")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Load role from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      if (savedRole === "owner" || savedRole === "expert" || savedRole === "client") {
        setRoleState(savedRole)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      setIsLoading(false)
    }
  }, [])

  const setRole = (newRole: Role) => {
    if (newRole === role) return

    try {
      // Update localStorage
      localStorage.setItem("squeedr-user-role", newRole)

      // Update state
      setRoleState(newRole)

      // Show toast notification
      toast({
        title: "Role Changed",
        description: `You are now viewing as ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
        duration: 3000,
      })

      // Refresh the page to apply role-based changes
      router.refresh()
    } catch (error) {
      console.error("Error changing role:", error)
      toast({
        title: "Error",
        description: "Failed to change role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isLoading,
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
