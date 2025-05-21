import { type NextRequest, NextResponse } from "next/server"
import { type GoogleCalendarCredentials, importEventsAsAvailability } from "@/lib/google-calendar"

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
    const { calendarId, startDate, endDate } = await request.json()

    if (!calendarId || !startDate || !endDate) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Import events from Google Calendar as availability slots
    const slots = await importEventsAsAvailability(credentials, calendarId, startDate, endDate)

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Error importing from Google Calendar:", error)
    return NextResponse.json({ error: "Failed to import from Google Calendar" }, { status: 500 })
  }
}
