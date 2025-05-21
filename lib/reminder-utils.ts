// Types for reminder configuration
export type ReminderTime = 5 | 10 | 15 | 30 | 60 | 1440 // minutes before session (1440 = 1 day)
export type ReminderMethod = "email" | "browser" | "sms"

export interface ReminderPreference {
  enabled: boolean
  times: ReminderTime[] // Multiple times can be selected
  methods: ReminderMethod[] // Multiple methods can be selected
}

export interface SessionReminder {
  sessionId: string
  time: ReminderTime
  method: ReminderMethod
  sent: boolean
  scheduledFor: Date
}

// Default reminder preferences
export const defaultReminderPreference: ReminderPreference = {
  enabled: true,
  times: [15, 1440], // 15 minutes and 1 day before
  methods: ["email", "browser"],
}

// Format reminder time for display
export function formatReminderTime(minutes: ReminderTime): string {
  if (minutes === 1440) {
    return "1 day before"
  } else if (minutes >= 60) {
    return `${minutes / 60} hour${minutes > 60 ? "s" : ""} before`
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""} before`
  }
}

// Calculate when a reminder should be sent
export function calculateReminderTime(sessionDate: string, sessionTime: string, minutesBefore: number): Date {
  const sessionDateTime = new Date(`${sessionDate}T${sessionTime}`)
  return new Date(sessionDateTime.getTime() - minutesBefore * 60 * 1000)
}

// Mock function to check if a reminder is due
export function isReminderDue(reminder: SessionReminder): boolean {
  const now = new Date()
  return !reminder.sent && reminder.scheduledFor <= now
}
