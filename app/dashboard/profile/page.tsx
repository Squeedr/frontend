"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRole } from "@/hooks/use-role"
import ProfileCard from "@/components/profile-card"
import { ProfileCompletionIndicator } from "@/components/profile/profile-completion-indicator"
import { useToast } from "@/hooks/use-toast"
import type { UserProfileData } from "@/lib/profile-completion"

export default function ProfilePage() {
  const { role } = useRole()
  const { toast } = useToast()
  const [editingField, setEditingField] = useState<string | null>(null)

  // Mock user data based on role
  const userData = {
    owner: {
      name: "John Doe",
      email: "john@squeedr.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Platform owner and administrator with over 10 years of experience in managing expert networks.",
      joinDate: "January 2022",
      role: "owner",
      company: "Squeedr Inc.",
      businessCategory: "Technology",
      paymentInfo: true,
      stats: {
        experts: 25,
        sessions: 150,
        workspaces: 8,
      },
    },
    expert: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      bio: "Senior web developer specializing in React and Next.js with 8 years of experience building scalable applications.",
      joinDate: "March 2022",
      role: "expert",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "UI/UX"],
      hourlyRate: 150,
      availability: true,
      education: ["B.S. Computer Science, MIT", "Full Stack Web Development Certification"],
      rating: 4.8,
      stats: {
        sessions: 36,
        clients: 24,
        revenue: 5400,
      },
    },
    client: {
      name: "Alice Williams",
      email: "alice@example.com",
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
      bio: "Product manager looking to improve technical skills and team collaboration.",
      joinDate: "June 2022",
      role: "client",
      communicationPreference: "Email",
      projectInterests: ["Web Development", "Mobile Apps", "UI/UX Design"],
      budgetRange: [5000, 10000],
      stats: {
        sessions: 12,
        experts: 5,
        workspaces: 2,
      },
    },
  }

  // Get user data based on current role
  const user = userData[role]

  // Create profile data for completion calculation
  const profileData: UserProfileData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio,
    avatar: user.avatar,
    role: role,
    ...(role === "owner" && {
      company: user.company,
      businessCategory: user.businessCategory,
      paymentInfo: user.paymentInfo,
    }),
    ...(role === "expert" && {
      skills: user.skills,
      hourlyRate: user.hourlyRate,
      availability: user.availability,
      education: user.education,
    }),
    ...(role === "client" && {
      communicationPreference: user.communicationPreference,
      projectInterests: user.projectInterests,
      budgetRange: user.budgetRange,
    }),
  }

  // Handle completing a profile field
  const handleCompleteField = (field: string) => {
    setEditingField(field)
  }

  // Handle saving a profile field
  const handleSaveField = (field: string, value: any) => {
    // In a real app, this would update the user profile in the database
    toast({
      title: "Profile Updated",
      description: `Your ${field} has been updated successfully.`,
      duration: 3000,
    })
  }

  return (
    <div className="space-y-6">
      <ProfileCompletionIndicator profile={profileData} onCompleteField={handleCompleteField} />

      <ProfileCard user={profileData} />

      <div className="grid gap-4 md:grid-cols-3">
        {role === "owner" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.experts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.sessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.workspaces}</div>
              </CardContent>
            </Card>
          </>
        )}

        {role === "expert" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.sessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.clients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${user.stats.revenue}</div>
              </CardContent>
            </Card>
          </>
        )}

        {role === "client" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.sessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Experts Worked With</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.experts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.stats.workspaces}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
