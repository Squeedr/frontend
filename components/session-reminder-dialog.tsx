"use client"

import { useState } from "react"
import { Bell, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  type ReminderPreference,
  defaultReminderPreference,
  formatReminderTime,
  calculateReminderTime,
} from "@/lib/reminder-utils"
import type { Session } from "@/lib/mock-data"

interface SessionReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session | null
  globalPreferences: ReminderPreference
  sessionPreferences: Record<string, ReminderPreference>
  onSave: (sessionId: string, preferences: ReminderPreference | null) => void
}

export function SessionReminderDialog({
  open,
  onOpenChange,
  session,
  globalPreferences = defaultReminderPreference,
  sessionPreferences,
  onSave,
}: SessionReminderDialogProps) {
  const { toast } = useToast()

  // Get current preferences for this session, or use global if none exist
  const currentPreferences = session
    ? sessionPreferences[session.id] || { ...globalPreferences }
    : defaultReminderPreference

  const [useCustomSettings, setUseCustomSettings] = useState(session ? !!sessionPreferences[session.id] : false)
  const [localPreferences, setLocalPreferences] = useState<ReminderPreference>({ ...currentPreferences })

  // Handle save
  const handleSave = () => {
    if (!session) return

    // If using global settings, remove any custom settings for this session
    if (!useCustomSettings) {
      onSave(session.id, null)
    } else {
      onSave(session.id, localPreferences)
    }

    onOpenChange(false)

    toast({
      title: "Reminder settings saved",
      description: useCustomSettings
        ? "Custom reminder settings have been saved for this session."
        : "This session will use your global reminder settings.",
    })
  }

  // If no session is selected, don't render
  if (!session) return null

  // Calculate actual reminder times for this session
  const reminderTimes = useCustomSettings ? localPreferences.times : globalPreferences.times

  const actualReminderTimes = reminderTimes.map((minutes) => {
    return {
      minutes,
      time: calculateReminderTime(session.date, session.startTime, minutes),
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Reminders</DialogTitle>
          <DialogDescription>Configure reminders for this specific session.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Session details */}
          <div className="rounded-md bg-muted p-3">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{session.title}</p>
                <p className="text-sm text-muted-foreground">
                  {session.date} • {session.startTime} - {session.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Use custom settings toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="custom-settings">Use custom reminder settings</Label>
              <p className="text-sm text-muted-foreground">
                Override your global reminder preferences for this session
              </p>
            </div>
            <Switch id="custom-settings" checked={useCustomSettings} onCheckedChange={setUseCustomSettings} />
          </div>

          {useCustomSettings && (
            <>
              {/* Enable/disable reminders */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-reminders-enabled">Enable reminders for this session</Label>
                </div>
                <Switch
                  id="session-reminders-enabled"
                  checked={localPreferences.enabled}
                  onCheckedChange={(checked) => setLocalPreferences((prev) => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* Show current reminder settings */}
              <div className="space-y-2">
                <Label>Reminder settings</Label>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-medium">
                    {localPreferences.enabled ? "Reminders are enabled" : "Reminders are disabled"}
                  </p>
                  {localPreferences.enabled && (
                    <>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium">When:</span>{" "}
                        {localPreferences.times.map(formatReminderTime).join(", ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">How:</span>{" "}
                        {localPreferences.methods.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                      </p>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    // Reset to global preferences
                    setLocalPreferences({ ...globalPreferences })
                    toast({
                      title: "Settings reset",
                      description: "Custom settings have been reset to match your global preferences.",
                    })
                  }}
                >
                  Reset to Global Settings
                </Button>
              </div>
            </>
          )}

          {/* Show when reminders will be sent */}
          <div className="space-y-2">
            <Label>Scheduled reminders</Label>
            {(useCustomSettings ? localPreferences.enabled : globalPreferences.enabled) ? (
              <div className="space-y-2">
                {actualReminderTimes.map(({ minutes, time }) => (
                  <div key={minutes} className="flex items-center gap-2 rounded-md border p-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{formatReminderTime(minutes)}</p>
                      <p className="text-xs text-muted-foreground">
                        {time.toLocaleDateString()} at{" "}
                        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm text-muted-foreground">No reminders will be sent for this session.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
