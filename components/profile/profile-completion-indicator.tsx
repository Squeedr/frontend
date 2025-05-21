"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react"
import {
  calculateProfileCompletion,
  getCompletionColor,
  getCompletionMessage,
  type UserProfileData,
} from "@/lib/profile-completion"
import { ProfileCompletionCircle } from "./profile-completion-circle"

interface ProfileCompletionIndicatorProps {
  profile: UserProfileData
  onCompleteField?: (field: string) => void
}

export function ProfileCompletionIndicator({ profile, onCompleteField }: ProfileCompletionIndicatorProps) {
  const [expanded, setExpanded] = useState(true)
  const { percentage, incompleteFields } = calculateProfileCompletion(profile)
  const completionColor = getCompletionColor(percentage)
  const completionMessage = getCompletionMessage(percentage)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Profile Completion</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse profile completion details" : "Expand profile completion details"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>{completionMessage}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <ProfileCompletionCircle profile={profile} size="lg" showLabel={false} />
          <div className="flex-1">
            <Progress value={percentage} className="h-2 mb-2" />
            <p className="text-sm text-gray-500">
              {incompleteFields.length === 0
                ? "Your profile is complete!"
                : `${incompleteFields.length} item${incompleteFields.length !== 1 ? "s" : ""} left to complete`}
            </p>
          </div>
        </div>

        {expanded && incompleteFields.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium">Complete these items to improve your profile:</h4>
            <ul className="space-y-2">
              {incompleteFields.map(({ field, label }) => (
                <li key={field} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-gray-400" />
                    <span>{label}</span>
                  </div>
                  {onCompleteField && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCompleteField(field)}
                      className="h-7 px-2 text-xs"
                    >
                      Complete
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {expanded && percentage === 100 && (
          <div className="flex items-center gap-2 mt-4 text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Your profile is complete!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
