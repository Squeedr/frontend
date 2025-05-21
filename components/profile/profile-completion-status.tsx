"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ProfileCompletionCircle } from "./profile-completion-circle"
import { calculateProfileCompletion, type UserProfileData } from "@/lib/profile-completion"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileCompletionStatusProps {
  profile: UserProfileData
}

export function ProfileCompletionStatus({ profile }: ProfileCompletionStatusProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { percentage, incompleteFields } = calculateProfileCompletion(profile)

  // If profile is complete, don't show the status
  if (percentage === 100) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 border-dashed">
          <ProfileCompletionCircle profile={profile} size="sm" showLabel={false} />
          <span>Profile {percentage}% Complete</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex items-center gap-4 mb-3">
          <ProfileCompletionCircle profile={profile} />
          <div>
            <h4 className="font-medium">Profile Completion</h4>
            <p className="text-sm text-muted-foreground">Complete your profile to get the most out of Squeedr</p>
          </div>
        </div>

        {incompleteFields.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Missing information:</h5>
            <ul className="space-y-1">
              {incompleteFields.slice(0, 3).map(({ field, label }) => (
                <li key={field} className="text-sm text-muted-foreground">
                  • {label}
                </li>
              ))}
              {incompleteFields.length > 3 && (
                <li className="text-sm text-muted-foreground">• And {incompleteFields.length - 3} more...</li>
              )}
            </ul>
          </div>
        )}

        <Button
          className="w-full mt-4"
          onClick={() => {
            router.push("/dashboard/profile")
            setOpen(false)
          }}
        >
          Complete Profile
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </PopoverContent>
    </Popover>
  )
}
