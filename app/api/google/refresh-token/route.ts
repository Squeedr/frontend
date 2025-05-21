import { type NextRequest, NextResponse } from "next/server"

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""

// Google OAuth endpoints
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    // Exchange the refresh token for a new access token
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Token refresh error:", errorData)
      return NextResponse.json({ error: "Failed to refresh token" }, { status: tokenResponse.status })
    }

    const tokenData = await tokenResponse.json()

    // Calculate the expiration time
    const expiresAt = Date.now() + tokenData.expires_in * 1000

    // Return the new credentials
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: refreshToken, // Use the same refresh token
      expires_at: expiresAt,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
    })
  } catch (error) {
    console.error("Error refreshing token:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
