"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRole } from "@/hooks/use-role"
import ProfileCard from "@/components/profile-card"
import { ProfileCompletionIndicator } from "@/components/profile/profile-completion-indicator"
import { useToast } from "@/hooks/use-toast"
import type { UserProfileData } from "@/lib/profile-completion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useUser } from "@/lib/user-context"
import { updateUserProfile } from "@/lib/api/auth"

export default function ProfilePage() {
  const { role, token } = useRole()
  const { toast } = useToast()
  const { user: profile, setUser } = useUser()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(profile.avatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Open modal from ProfileCard
  const handleEditProfile = () => setEditOpen(true)

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Save profile changes
  const handleSave = () => {
    const updatedProfile = { ...profile, avatar: avatarPreview }
    setUser(updatedProfile)
    if (token) {
      updateUserProfile(token, updatedProfile)
        .then(() => {
          toast({ title: "Profile Updated", description: "Your profile has been updated." })
        })
        .catch((err) => {
          toast({ title: "Error", description: "Failed to update profile. Please try again." })
        })
    } else {
      toast({ title: "Profile Updated", description: "Your profile has been updated locally." })
    }
    setEditOpen(false)
  }

  return (
    <div className="space-y-6">
      <ProfileCompletionIndicator profile={profile} onCompleteField={setEditingField} />
      <ProfileCard user={profile} onEdit={handleEditProfile} />

      {/* Profile Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center">
              <UserAvatar user={{ name: profile.name, email: profile.email, image: avatarPreview }} size="xl" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
              <button
                className="mt-2 text-blue-600 hover:underline text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </button>
            </div>
            <Input
              value={profile.name}
              onChange={e => setUser({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={profile.email}
              onChange={e => setUser({ ...profile, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              value={profile.phone}
              onChange={e => setUser({ ...profile, phone: e.target.value })}
              placeholder="Phone"
            />
            <Input
              value={profile.location}
              onChange={e => setUser({ ...profile, location: e.target.value })}
              placeholder="Location"
            />
            <Textarea
              value={profile.bio}
              onChange={e => setUser({ ...profile, bio: e.target.value })}
              placeholder="Bio"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSave}>Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-3">
        {role === "owner" && profile.stats && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.experts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.sessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.workspaces}</div>
              </CardContent>
            </Card>
          </>
        )}

        {role === "expert" && profile.stats && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.sessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.clients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${profile.stats.revenue}</div>
              </CardContent>
            </Card>
          </>
        )}

        {role === "client" && profile.stats && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.sessions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Experts Worked With</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.experts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.stats.workspaces}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
