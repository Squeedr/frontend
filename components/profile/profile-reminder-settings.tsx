"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useProfileReminders } from "@/hooks/use-profile-reminders"

export function ProfileReminderSettings() {
  const { updateReminderFrequency, getReminderSettings, testReminder } = useProfileReminders()

  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "never">("weekly")

  useEffect(() => {
    const settings = getReminderSettings()
    setFrequency(settings.frequency)
  }, [getReminderSettings])

  const handleFrequencyChange = (value: "daily" | "weekly" | "monthly" | "never") => {
    setFrequency(value)
    updateReminderFrequency(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Profile Completion Reminders
        </CardTitle>
        <CardDescription>Configure how often you want to be reminded to complete your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={frequency} onValueChange={handleFrequencyChange as (value: string) => void}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily</Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="never" />
            <Label htmlFor="never">Never</Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={testReminder}>
          <Clock className="mr-2 h-4 w-4" />
          Test Reminder
        </Button>
        <Button
          variant={frequency === "never" ? "destructive" : "default"}
          size="sm"
          onClick={() => handleFrequencyChange(frequency === "never" ? "weekly" : "never")}
        >
          {frequency === "never" ? (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Enable Reminders
            </>
          ) : (
            <>
              <BellOff className="mr-2 h-4 w-4" />
              Disable Reminders
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
