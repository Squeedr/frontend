"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

type Role = "owner" | "expert" | "client"

interface SimpleRoleContextType {
  role: Role
  setRole: (role: Role) => void
}

const SimpleRoleContext = createContext<SimpleRoleContextType | undefined>(undefined)

export function SimpleRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("expert")
  const { toast } = useToast()

  // Load role from localStorage on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("squeedr-user-role")
      console.log("Initial localStorage role:", savedRole)

      if (savedRole === "owner" || savedRole === "expert" || savedRole === "client") {
        console.log("Setting initial role to:", savedRole)
        setRoleState(savedRole)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Simple direct role setter
  const setRole = (newRole: Role) => {
    console.log("Setting role to:", newRole)

    // Update localStorage
    try {
      localStorage.setItem("squeedr-user-role", newRole)
      console.log("Updated localStorage with:", newRole)
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    // Update state
    setRoleState(newRole)

    // Show toast notification
    toast({
      title: "Role Changed",
      description: `You are now viewing as ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
      duration: 3000,
    })
  }

  const contextValue = {
    role,
    setRole,
  }

  return <SimpleRoleContext.Provider value={contextValue}>{children}</SimpleRoleContext.Provider>
}

export function useSimpleRole() {
  const context = useContext(SimpleRoleContext)
  if (context === undefined) {
    throw new Error("useSimpleRole must be used within a SimpleRoleProvider")
  }
  return context
}
