"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Clock, Mail, MessageSquare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  type ReminderPreference,
  type ReminderTime,
  type ReminderMethod,
  defaultReminderPreference,
  formatReminderTime,
} from "@/lib/reminder-utils"

interface ReminderPreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences: ReminderPreference
  onSave: (preferences: ReminderPreference) => void
}

export function ReminderPreferencesDialog({
  open,
  onOpenChange,
  preferences = defaultReminderPreference,
  onSave,
}: ReminderPreferencesDialogProps) {
  const { toast } = useToast()
  const [localPreferences, setLocalPreferences] = useState<ReminderPreference>({ ...preferences })

  // Available reminder times
  const reminderTimes: ReminderTime[] = [5, 10, 15, 30, 60, 1440]

  // Available reminder methods
  const reminderMethods: { value: ReminderMethod; label: string; icon: React.ReactNode }[] = [
    { value: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
    { value: "browser", label: "Browser", icon: <Bell className="h-4 w-4" /> },
    { value: "sms", label: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  ]

  // Toggle a reminder time
  const toggleReminderTime = (time: ReminderTime) => {
    setLocalPreferences((prev) => {
      if (prev.times.includes(time)) {
        return { ...prev, times: prev.times.filter((t) => t !== time) }
      } else {
        return { ...prev, times: [...prev.times, time].sort((a, b) => b - a) }
      }
    })
  }

  // Toggle a reminder method
  const toggleReminderMethod = (method: ReminderMethod) => {
    setLocalPreferences((prev) => {
      if (prev.methods.includes(method)) {
        return { ...prev, methods: prev.methods.filter((m) => m !== method) }
      } else {
        return { ...prev, methods: [...prev.methods, method] }
      }
    })
  }

  // Toggle reminders enabled/disabled
  const toggleRemindersEnabled = () => {
    setLocalPreferences((prev) => ({ ...prev, enabled: !prev.enabled }))
  }

  // Handle save
  const handleSave = () => {
    // Ensure at least one time and method is selected if enabled
    if (localPreferences.enabled && (localPreferences.times.length === 0 || localPreferences.methods.length === 0)) {
      toast({
        title: "Invalid preferences",
        description: "Please select at least one reminder time and method.",
        variant: "destructive",
      })
      return
    }

    onSave(localPreferences)
    onOpenChange(false)

    toast({
      title: "Reminder preferences saved",
      description: localPreferences.enabled
        ? "You'll be reminded before your upcoming sessions."
        : "Reminders have been disabled.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reminder Preferences</DialogTitle>
          <DialogDescription>
            Configure when and how you want to be reminded about your upcoming sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Enable/disable reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders-enabled">Enable session reminders</Label>
              <p className="text-sm text-muted-foreground">Receive notifications before your sessions start</p>
            </div>
            <Switch
              id="reminders-enabled"
              checked={localPreferences.enabled}
              onCheckedChange={toggleRemindersEnabled}
            />
          </div>

          {localPreferences.enabled && (
            <>
              {/* Reminder times */}
              <div className="space-y-3">
                <Label>When to send reminders</Label>
                <div className="flex flex-wrap gap-2">
                  {reminderTimes.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={localPreferences.times.includes(time) ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => toggleReminderTime(time)}
                    >
                      <Clock className="h-3 w-3" />
                      {formatReminderTime(time)}
                      {localPreferences.times.includes(time) && (
                        <X
                          className="h-3 w-3 ml-1 opacity-70"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleReminderTime(time)
                          }}
                        />
                      )}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Select multiple times to receive multiple reminders</p>
              </div>

              {/* Reminder methods */}
              <div className="space-y-3">
                <Label>How to send reminders</Label>
                <div className="space-y-2">
                  {reminderMethods.map((method) => (
                    <div key={method.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`method-${method.value}`}
                        checked={localPreferences.methods.includes(method.value)}
                        onCheckedChange={() => toggleReminderMethod(method.value)}
                      />
                      <Label htmlFor={`method-${method.value}`} className="flex items-center gap-2 text-sm font-normal">
                        {method.icon}
                        {method.label}
                        {method.value === "sms" && (
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                            Requires phone number
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
