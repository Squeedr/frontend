import { type NextRequest, NextResponse } from "next/server"
import { getCalendarList, type GoogleCalendarCredentials } from "@/lib/google-calendar"

export async function GET(request: NextRequest) {
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

    // Get the list of calendars
    const calendars = await getCalendarList(credentials)

    return NextResponse.json(calendars)
  } catch (error) {
    console.error("Error fetching calendars:", error)
    return NextResponse.json({ error: "Failed to fetch calendars" }, { status: 500 })
  }
}
