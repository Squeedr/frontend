"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar, User, Edit } from "lucide-react"
import { ProfileCompletionCircle } from "./profile/profile-completion-circle"
import type { UserProfileData } from "@/lib/profile-completion"
import { getAvatarImage } from "@/lib/image-utils"
import { UserAvatar } from "@/components/ui/user-avatar"

interface ProfileCardProps {
  user: UserProfileData
  onEdit?: () => void
}

export default function ProfileCard({ user, onEdit }: ProfileCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Profile Information</CardTitle>
          <div className="flex items-center gap-3">
            <ProfileCompletionCircle profile={user} size="sm" />
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              {user.avatar ? (
                <UserAvatar
                  user={{
                    name: user.name,
                    email: user.email,
                    image: user.avatar
                  }}
                  size="xl"
                />
              ) : (
                <User className="h-16 w-16 text-gray-500" />
              )}
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              Change Photo
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500 capitalize">{user.role}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
