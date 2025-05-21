"use client"

import { useState, useEffect } from "react"
import { X, Clock, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProfileReminderNotificationProps {
  onDismiss: () => void
  onSnooze: (option: "1day" | "1week" | "1month") => void
}

export function ProfileReminderNotification({ onDismiss, onSnooze }: ProfileReminderNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300) // Wait for animation to complete
  }

  const handleSnooze = (option: "1day" | "1week" | "1month") => {
    setIsVisible(false)
    setTimeout(() => {
      onSnooze(option)
    }, 300) // Wait for animation to complete
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
      )}
    >
      <Card className="w-80 p-4 shadow-lg border-l-4 border-l-amber-500">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-medium">Complete Your Profile</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          Your profile is incomplete. Complete it to get the most out of Squeedr.
        </p>

        <div className="mt-3 flex flex-col gap-2">
          <Link href="/dashboard/profile">
            <Button className="w-full" size="sm">
              <User className="mr-2 h-4 w-4" />
              Complete Profile
            </Button>
          </Link>

          <div className="relative">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setIsSnoozeOpen(!isSnoozeOpen)}>
              <Clock className="mr-2 h-4 w-4" />
              Remind Me Later
            </Button>

            {isSnoozeOpen && (
              <Card className="absolute top-full left-0 right-0 mt-1 p-2 z-10">
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleSnooze("1day")}>
                    Tomorrow
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleSnooze("1week")}>
                    Next week
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleSnooze("1month")}>
                    Next month
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
