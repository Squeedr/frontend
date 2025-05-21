import { type NextRequest, NextResponse } from "next/server"
import { type GoogleCalendarCredentials, syncAvailabilityWithGoogleCalendar } from "@/lib/google-calendar"

export async function POST(request: NextRequest) {
  try {
    // Get the tokens from cookies (in a real app, you'd get these from a secure storage)
    const accessToken = request.cookies.get("google_access_token")?.value
    const refreshToken = request.cookies.get("google_refresh_token")?.value
    const expiresAt = request.cookies.get("google_token_expires_at")?.value

    if (!accessToken || !refreshToken || !expiresAt) {
      return NextResponse.json({ error: "Not authenticated with Google" }, { status: 401 })
    }

    const credentials: GoogleCalendarCredentials = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: Number.parseInt(expiresAt),
      token_type: "Bearer",
      scope: "https://www.googleapis.com/auth/calendar",
    }

    // Get the request body
    const { calendarId, slots } = await request.json()

    if (!calendarId || !slots || !Array.isArray(slots)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Sync the availability slots with Google Calendar
    const updatedSlots = await syncAvailabilityWithGoogleCalendar(credentials, calendarId, slots)

    return NextResponse.json({ slots: updatedSlots })
  } catch (error) {
    console.error("Error syncing with Google Calendar:", error)
    return NextResponse.json({ error: "Failed to sync with Google Calendar" }, { status: 500 })
  }
}
