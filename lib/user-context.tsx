"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { UserProfileData } from "@/lib/profile-completion"
import { useRole } from "@/hooks/use-role"
import { authApi } from "@/lib/api/auth"

interface UserContextValue {
  user: UserProfileData & {
    joinDate: string
    company?: string
    businessCategory?: string
    paymentInfo?: boolean
    stats?: any
    skills?: string[]
    hourlyRate?: number
    availability?: boolean
    education?: string[]
    rating?: number
    communicationPreference?: string
    projectInterests?: string[]
    budgetRange?: [number, number]
    app_roles?: string[]
  }
  setUser: (user: Partial<UserContextValue["user"]>) => void
  setRole: (role: "owner" | "expert" | "client") => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode; initialUser: UserContextValue["user"] }> = ({ children, initialUser }) => {
  const [user, setUserState] = useState(initialUser)
  const setUser = useCallback((updates: Partial<UserContextValue["user"]>) => {
    setUserState((prev) => ({ ...prev, ...updates }))
  }, [])
  const setRole = useCallback((role: "owner" | "expert" | "client") => {
    // Provide sensible defaults for each role
    if (role === "owner") {
      setUserState({
        name: "John Doe",
        email: "john@squeedr.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        bio: "Platform owner and administrator with over 10 years of experience in managing expert networks.",
        joinDate: "January 2022",
        role: "owner",
        avatar: undefined,
        company: "Squeedr Inc.",
        businessCategory: "Technology",
        paymentInfo: true,
        stats: { experts: 25, sessions: 150, workspaces: 8 },
      })
    } else if (role === "expert") {
      setUserState({
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 (555) 987-6543",
        location: "New York, NY",
        bio: "Senior web developer specializing in React and Next.js with 8 years of experience building scalable applications.",
        joinDate: "March 2022",
        role: "expert",
        avatar: undefined,
        skills: ["React", "Next.js", "TypeScript", "Node.js", "UI/UX"],
        hourlyRate: 150,
        availability: true,
        education: ["B.S. Computer Science, MIT", "Full Stack Web Development Certification"],
        rating: 4.8,
        stats: { sessions: 36, clients: 24, revenue: 5400 },
      })
    } else {
      setUserState({
        name: "Alice Williams",
        email: "alice@example.com",
        phone: "+1 (555) 456-7890",
        location: "Chicago, IL",
        bio: "Product manager looking to improve technical skills and team collaboration.",
        joinDate: "June 2022",
        role: "client",
        avatar: undefined,
        communicationPreference: "Email",
        projectInterests: ["Web Development", "Mobile Apps", "UI/UX Design"],
        budgetRange: [5000, 10000],
        stats: { sessions: 12, experts: 5, workspaces: 2 },
      })
    }
  }, [])

  // Fetch real user profile from Strapi after login
  const { token } = useRole()
  useEffect(() => {
    if (token) {
      authApi.getCurrentUser()
        .then((profile) => {
          // Backend returns user with app_roles array populated
          // Merge the backend profile data with existing user state
          setUserState((prev) => ({ 
            ...prev, 
            ...profile,
            // Ensure app_roles from backend takes precedence
            app_roles: profile.app_roles || prev.app_roles || []
          }))
        })
        .catch((err) => {
          console.error("Failed to fetch user profile from backend:", err)
          // Continue with mock data on error
        })
    }
  }, [token])

  return (
    <UserContext.Provider value={{ user, setUser, setRole }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within a UserProvider")
  return ctx
} 