"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useRole } from "@/hooks/use-role"

type ReminderFrequency = "daily" | "weekly" | "monthly" | "never"
type SnoozeOption = "1day" | "1week" | "1month"

export function useProfileReminders() {
  const [shouldShowReminder, setShouldShowReminder] = useState(false)
  const pathname = usePathname()
  const { role } = useRole()

  // Load reminder settings from localStorage
  useEffect(() => {
    // Don't show reminders on the profile page itself
    if (pathname === "/dashboard/profile") {
      return
    }

    // Delay the reminder check to avoid immediate popups
    const timer = setTimeout(() => {
      const reminderSettings = localStorage.getItem("profile-reminder-settings")
      const settings = reminderSettings ? JSON.parse(reminderSettings) : { frequency: "weekly" }

      // Check if reminders are disabled
      if (settings.frequency === "never") {
        return
      }

      // Check if reminder is snoozed
      const snoozedUntil = localStorage.getItem("profile-reminder-snoozed-until")
      if (snoozedUntil && new Date(snoozedUntil) > new Date()) {
        return
      }

      // Check last reminder time
      const lastReminder = localStorage.getItem("profile-reminder-last-shown")
      if (lastReminder) {
        const lastReminderDate = new Date(lastReminder)
        const now = new Date()

        // Check based on frequency
        if (settings.frequency === "daily") {
          if (now.getTime() - lastReminderDate.getTime() < 24 * 60 * 60 * 1000) {
            return
          }
        } else if (settings.frequency === "weekly") {
          if (now.getTime() - lastReminderDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
            return
          }
        } else if (settings.frequency === "monthly") {
          if (now.getTime() - lastReminderDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
            return
          }
        }
      }

      // Check profile completion
      const profileData = localStorage.getItem(`profile-data-${role}`)
      if (!profileData) {
        // If no profile data, definitely show a reminder
        setShouldShowReminder(true)
        localStorage.setItem("profile-reminder-last-shown", new Date().toISOString())
        return
      }

      // Calculate completion percentage
      const profile = JSON.parse(profileData)
      const completionPercentage = calculateCompletionPercentage(profile, role)

      // Show reminder if profile is less than 80% complete
      if (completionPercentage < 80) {
        setShouldShowReminder(true)
        localStorage.setItem("profile-reminder-last-shown", new Date().toISOString())
      }
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [pathname, role])

  // Calculate profile completion percentage
  const calculateCompletionPercentage = (profile: any, role: string) => {
    // This is a simplified version - in a real app, you'd have more complex logic
    const fields = getRequiredFieldsForRole(role)
    let completed = 0

    fields.forEach((field) => {
      if (profile[field] && profile[field] !== "") {
        completed++
      }
    })

    return Math.round((completed / fields.length) * 100)
  }

  // Get required fields based on role
  const getRequiredFieldsForRole = (role: string) => {
    const baseFields = ["name", "email", "phone", "location", "bio", "avatar"]

    if (role === "owner") {
      return [...baseFields, "company", "businessCategory", "paymentInfo"]
    } else if (role === "expert") {
      return [...baseFields, "skills", "hourlyRate", "availability", "education"]
    } else {
      return [...baseFields, "communicationPreference", "interests", "budget"]
    }
  }

  // Dismiss the reminder
  const dismissReminder = () => {
    setShouldShowReminder(false)
  }

  // Snooze the reminder
  const snoozeReminder = (option: SnoozeOption) => {
    const now = new Date()
    const snoozeUntil = new Date()

    if (option === "1day") {
      snoozeUntil.setDate(now.getDate() + 1)
    } else if (option === "1week") {
      snoozeUntil.setDate(now.getDate() + 7)
    } else if (option === "1month") {
      snoozeUntil.setDate(now.getDate() + 30)
    }

    localStorage.setItem("profile-reminder-snoozed-until", snoozeUntil.toISOString())
    setShouldShowReminder(false)
  }

  // Update reminder frequency
  const updateReminderFrequency = (frequency: ReminderFrequency) => {
    localStorage.setItem("profile-reminder-settings", JSON.stringify({ frequency }))
  }

  // Get current reminder settings
  const getReminderSettings = () => {
    const settings = localStorage.getItem("profile-reminder-settings")
    return settings ? JSON.parse(settings) : { frequency: "weekly" }
  }

  // Test showing a reminder
  const testReminder = () => {
    setShouldShowReminder(true)
  }

  return {
    shouldShowReminder,
    dismissReminder,
    snoozeReminder,
    updateReminderFrequency,
    getReminderSettings,
    testReminder,
  }
}
