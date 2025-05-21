"use client"

import { useState } from "react"
import { Bell, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { type ReminderPreference, defaultReminderPreference, formatReminderTime } from "@/lib/reminder-utils"
import { ReminderPreferencesDialog } from "./reminder-preferences-dialog"

export function ReminderSettingsSection() {
  const [reminderPreferences, setReminderPreferences] = useState<ReminderPreference>(defaultReminderPreference)
  const [reminderPreferencesOpen, setReminderPreferencesOpen] = useState(false)

  // Handle saving reminder preferences
  const handleSaveReminderPreferences = (preferences: ReminderPreference) => {
    setReminderPreferences(preferences)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Reminders</CardTitle>
        <CardDescription>Configure when and how you want to be reminded about your upcoming sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders-enabled">Enable session reminders</Label>
              <p className="text-sm text-muted-foreground">Receive notifications before your sessions start</p>
            </div>
            <Switch
              id="reminders-enabled"
              checked={reminderPreferences.enabled}
              onCheckedChange={(checked) => setReminderPreferences((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>

          {reminderPreferences.enabled && (
            <>
              <div className="space-y-2">
                <Label>Current reminder settings</Label>
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-start gap-2">
                    <Bell className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">When:</span>{" "}
                        {reminderPreferences.times.map(formatReminderTime).join(", ")}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">How:</span>{" "}
                        {reminderPreferences.methods.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session-specific settings</Label>
                <p className="text-sm text-muted-foreground">
                  You can customize reminder settings for individual sessions from the upcoming sessions dropdown or
                  calendar view.
                </p>
              </div>
            </>
          )}

          <Button onClick={() => setReminderPreferencesOpen(true)} className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Configure Reminder Settings
          </Button>
        </div>
      </CardContent>

      {/* Global Reminder Preferences Dialog */}
      <ReminderPreferencesDialog
        open={reminderPreferencesOpen}
        onOpenChange={setReminderPreferencesOpen}
        preferences={reminderPreferences}
        onSave={handleSaveReminderPreferences}
      />
    </Card>
  )
}
