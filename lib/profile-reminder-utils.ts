import { type UserProfileData, calculateProfileCompletion } from "./profile-completion"
import type { Notification } from "@/hooks/use-notifications"

// Reminder frequency options
export type ReminderFrequency = "never" | "daily" | "weekly" | "monthly"

// User reminder preferences
export interface ProfileReminderPreferences {
  enabled: boolean
  frequency: ReminderFrequency
  lastReminded: string | null // ISO date string
  snoozeUntil: string | null // ISO date string
  dismissedFields: string[] // Fields user has dismissed reminders for
}

// Default reminder preferences
export const defaultReminderPreferences: ProfileReminderPreferences = {
  enabled: true,
  frequency: "weekly",
  lastReminded: null,
  snoozeUntil: null,
  dismissedFields: [],
}

// Check if a reminder should be sent based on preferences and last reminder time
export function shouldSendReminder(preferences: ProfileReminderPreferences, profile: UserProfileData): boolean {
  // If reminders are disabled, don't send
  if (!preferences.enabled) {
    return false
  }

  // If profile is complete, don't send
  const { percentage } = calculateProfileCompletion(profile)
  if (percentage === 100) {
    return false
  }

  // If snoozed, check if snooze period is over
  if (preferences.snoozeUntil) {
    const snoozeUntil = new Date(preferences.snoozeUntil)
    if (snoozeUntil > new Date()) {
      return false
    }
  }

  // If never reminded before, send reminder
  if (!preferences.lastReminded) {
    return true
  }

  // Check based on frequency
  const lastReminded = new Date(preferences.lastReminded)
  const now = new Date()
  const daysSinceLastReminder = Math.floor((now.getTime() - lastReminded.getTime()) / (1000 * 60 * 60 * 24))

  switch (preferences.frequency) {
    case "daily":
      return daysSinceLastReminder >= 1
    case "weekly":
      return daysSinceLastReminder >= 7
    case "monthly":
      return daysSinceLastReminder >= 30
    case "never":
      return false
    default:
      return false
  }
}

// Generate a reminder notification
export function generateProfileReminder(
  profile: UserProfileData,
  preferences: ProfileReminderPreferences,
): Omit<Notification, "id" | "read" | "time"> {
  const { percentage, incompleteFields } = calculateProfileCompletion(profile)

  // Filter out dismissed fields
  const activeIncompleteFields = incompleteFields.filter((field) => !preferences.dismissedFields.includes(field.field))

  // Create appropriate message based on completion percentage
  let message = ""

  if (percentage < 30) {
    message = `Your profile is only ${percentage}% complete. Complete your profile to get the most out of Squeedr.`
  } else if (percentage < 70) {
    message = `Your profile is ${percentage}% complete. Add ${activeIncompleteFields[0]?.label || "missing information"} to improve it.`
  } else {
    message = `Your profile is almost complete at ${percentage}%. Just a few more details to reach 100%!`
  }

  return {
    title: "Complete Your Profile",
    message,
    type: "info",
  }
}

// Update reminder preferences after sending a reminder
export function updateAfterReminder(preferences: ProfileReminderPreferences): ProfileReminderPreferences {
  return {
    ...preferences,
    lastReminded: new Date().toISOString(),
  }
}

// Snooze reminders for a period
export function snoozeReminders(preferences: ProfileReminderPreferences, days: number): ProfileReminderPreferences {
  const snoozeUntil = new Date()
  snoozeUntil.setDate(snoozeUntil.getDate() + days)

  return {
    ...preferences,
    snoozeUntil: snoozeUntil.toISOString(),
  }
}

// Dismiss reminders for specific fields
export function dismissFieldReminders(
  preferences: ProfileReminderPreferences,
  fields: string[],
): ProfileReminderPreferences {
  return {
    ...preferences,
    dismissedFields: [...new Set([...preferences.dismissedFields, ...fields])],
  }
}

// Reset dismissed fields
export function resetDismissedFields(preferences: ProfileReminderPreferences): ProfileReminderPreferences {
  return {
    ...preferences,
    dismissedFields: [],
  }
}
