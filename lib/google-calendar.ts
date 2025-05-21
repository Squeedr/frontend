import { v4 as uuidv4 } from "uuid"

// Types for Google Calendar API
interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  recurrence?: string[]
  status: string
}

interface GoogleCalendarList {
  items: {
    id: string
    summary: string
    primary?: boolean
  }[]
}

// Types for our application
export interface GoogleCalendarCredentials {
  access_token: string
  refresh_token: string
  expires_at: number
  token_type: string
  scope: string
}

export interface AvailabilitySlot {
  id: string
  date: string
  start: string
  end: string
  status: "available" | "booked" | "unavailable"
  expert?: string
  workspace?: string
  recurring?: boolean
  recurrencePattern?: "weekly" | "biweekly" | "monthly"
  recurrenceEndDate?: string
  recurrenceExceptions?: string[]
  googleCalendarEventId?: string
}

// Google Calendar API endpoints
const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"

// Helper function to check if token is expired
const isTokenExpired = (expiresAt: number): boolean => {
  // Add a 5-minute buffer to ensure we refresh before expiration
  return Date.now() >= expiresAt - 5 * 60 * 1000
}

// Helper function to refresh the access token
export const refreshAccessToken = async (refreshToken: string): Promise<GoogleCalendarCredentials> => {
  try {
    const response = await fetch("/api/google/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error refreshing token:", error)
    throw error
  }
}

// Helper function to ensure we have a valid token
const getValidToken = async (credentials: GoogleCalendarCredentials): Promise<string> => {
  if (isTokenExpired(credentials.expires_at)) {
    const newCredentials = await refreshAccessToken(credentials.refresh_token)
    // In a real app, you would store the updated credentials
    return newCredentials.access_token
  }
  return credentials.access_token
}

// Get list of user's calendars
export const getCalendarList = async (credentials: GoogleCalendarCredentials): Promise<GoogleCalendarList> => {
  try {
    const accessToken = await getValidToken(credentials)
    const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/users/me/calendarList`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch calendar list")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching calendar list:", error)
    throw error
  }
}

// Get events from a specific calendar
export const getCalendarEvents = async (
  credentials: GoogleCalendarCredentials,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<GoogleCalendarEvent[]> => {
  try {
    const accessToken = await getValidToken(credentials)
    const response = await fetch(
      `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(
        calendarId,
      )}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch calendar events")
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw error
  }
}

// Create a new event in Google Calendar
export const createCalendarEvent = async (
  credentials: GoogleCalendarCredentials,
  calendarId: string,
  slot: AvailabilitySlot,
): Promise<GoogleCalendarEvent> => {
  try {
    const accessToken = await getValidToken(credentials)

    // Format the date and time for Google Calendar
    const startDateTime = new Date(`${slot.date}T${slot.start}:00`)
    const endDateTime = new Date(`${slot.date}T${slot.end}:00`)

    const event: any = {
      summary: `${slot.status.charAt(0).toUpperCase() + slot.status.slice(1)} - Squeedr`,
      description: `Squeedr ${slot.status} slot${slot.expert ? ` with ${slot.expert}` : ""}${
        slot.workspace ? ` at ${slot.workspace}` : ""
      }`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }

    // Add recurrence rule if applicable
    if (slot.recurring && slot.recurrencePattern) {
      let recurrenceRule = "RRULE:FREQ="

      switch (slot.recurrencePattern) {
        case "weekly":
          recurrenceRule += "WEEKLY"
          break
        case "biweekly":
          recurrenceRule += "WEEKLY;INTERVAL=2"
          break
        case "monthly":
          recurrenceRule += "MONTHLY"
          break
      }

      // Add end date if specified
      if (slot.recurrenceEndDate) {
        const endDate = new Date(slot.recurrenceEndDate)
        recurrenceRule += `;UNTIL=${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`
      }

      event.recurrence = [recurrenceRule]
    }

    const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      throw new Error("Failed to create calendar event")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating calendar event:", error)
    throw error
  }
}

// Update an existing event in Google Calendar
export const updateCalendarEvent = async (
  credentials: GoogleCalendarCredentials,
  calendarId: string,
  eventId: string,
  slot: AvailabilitySlot,
): Promise<GoogleCalendarEvent> => {
  try {
    const accessToken = await getValidToken(credentials)

    // Format the date and time for Google Calendar
    const startDateTime = new Date(`${slot.date}T${slot.start}:00`)
    const endDateTime = new Date(`${slot.date}T${slot.end}:00`)

    const event: any = {
      summary: `${slot.status.charAt(0).toUpperCase() + slot.status.slice(1)} - Squeedr`,
      description: `Squeedr ${slot.status} slot${slot.expert ? ` with ${slot.expert}` : ""}${
        slot.workspace ? ` at ${slot.workspace}` : ""
      }`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }

    // Add recurrence rule if applicable
    if (slot.recurring && slot.recurrencePattern) {
      let recurrenceRule = "RRULE:FREQ="

      switch (slot.recurrencePattern) {
        case "weekly":
          recurrenceRule += "WEEKLY"
          break
        case "biweekly":
          recurrenceRule += "WEEKLY;INTERVAL=2"
          break
        case "monthly":
          recurrenceRule += "MONTHLY"
          break
      }

      // Add end date if specified
      if (slot.recurrenceEndDate) {
        const endDate = new Date(slot.recurrenceEndDate)
        recurrenceRule += `;UNTIL=${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`
      }

      event.recurrence = [recurrenceRule]
    }

    const response = await fetch(
      `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to update calendar event")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating calendar event:", error)
    throw error
  }
}

// Delete an event from Google Calendar
export const deleteCalendarEvent = async (
  credentials: GoogleCalendarCredentials,
  calendarId: string,
  eventId: string,
): Promise<void> => {
  try {
    const accessToken = await getValidToken(credentials)
    const response = await fetch(
      `${GOOGLE_CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to delete calendar event")
    }
  } catch (error) {
    console.error("Error deleting calendar event:", error)
    throw error
  }
}

// Sync availability slots with Google Calendar
export const syncAvailabilityWithGoogleCalendar = async (
  credentials: GoogleCalendarCredentials,
  calendarId: string,
  slots: AvailabilitySlot[],
): Promise<AvailabilitySlot[]> => {
  try {
    // Get existing events from Google Calendar
    const now = new Date()
    const sixMonthsLater = new Date(now)
    sixMonthsLater.setMonth(now.getMonth() + 6)

    const existingEvents = await getCalendarEvents(
      credentials,
      calendarId,
      now.toISOString(),
      sixMonthsLater.toISOString(),
    )

    // Map to track which events correspond to which slots
    const eventMap = new Map<string, GoogleCalendarEvent>()
    existingEvents.forEach((event) => {
      if (event.description?.includes("Squeedr")) {
        eventMap.set(event.id, event)
      }
    })

    // Process each slot
    const updatedSlots = await Promise.all(
      slots.map(async (slot) => {
        try {
          // If the slot already has a Google Calendar event ID
          if (slot.googleCalendarEventId && eventMap.has(slot.googleCalendarEventId)) {
            // Update the existing event
            await updateCalendarEvent(credentials, calendarId, slot.googleCalendarEventId, slot)
            return slot
          } else {
            // Create a new event
            const newEvent = await createCalendarEvent(credentials, calendarId, slot)
            return {
              ...slot,
              googleCalendarEventId: newEvent.id,
            }
          }
        } catch (error) {
          console.error(`Error syncing slot ${slot.id}:`, error)
          return slot
        }
      }),
    )

    return updatedSlots
  } catch (error) {
    console.error("Error syncing with Google Calendar:", error)
    throw error
  }
}

// Import events from Google Calendar as availability slots
export const importEventsAsAvailability = async (
  credentials: GoogleCalendarCredentials,
  calendarId: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilitySlot[]> => {
  try {
    const events = await getCalendarEvents(credentials, calendarId, startDate, endDate)

    // Convert Google Calendar events to availability slots
    const slots: AvailabilitySlot[] = events.map((event) => {
      const startDateTime = new Date(event.start.dateTime)
      const endDateTime = new Date(event.end.dateTime)

      const slot: AvailabilitySlot = {
        id: uuidv4(),
        date: startDateTime.toISOString().split("T")[0],
        start: startDateTime.toTimeString().substring(0, 5),
        end: endDateTime.toTimeString().substring(0, 5),
        status: "available", // Default to available
        googleCalendarEventId: event.id,
      }

      // Check if event has recurrence
      if (event.recurrence && event.recurrence.length > 0) {
        const rrule = event.recurrence[0]
        slot.recurring = true

        // Parse recurrence rule
        if (rrule.includes("FREQ=WEEKLY;INTERVAL=2")) {
          slot.recurrencePattern = "biweekly"
        } else if (rrule.includes("FREQ=WEEKLY")) {
          slot.recurrencePattern = "weekly"
        } else if (rrule.includes("FREQ=MONTHLY")) {
          slot.recurrencePattern = "monthly"
        }

        // Parse end date if present
        const untilMatch = rrule.match(/UNTIL=(\d{8}T\d{6}Z)/)
        if (untilMatch && untilMatch[1]) {
          const untilDate = untilMatch[1]
          // Convert YYYYMMDDTHHMMSSZ to YYYY-MM-DD
          const year = untilDate.substring(0, 4)
          const month = untilDate.substring(4, 6)
          const day = untilDate.substring(6, 8)
          slot.recurrenceEndDate = `${year}-${month}-${day}`
        }
      }

      return slot
    })

    return slots
  } catch (error) {
    console.error("Error importing events from Google Calendar:", error)
    throw error
  }
}
