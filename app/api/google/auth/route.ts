import { type NextRequest, NextResponse } from "next/server"

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/google/callback"

// Google OAuth endpoints
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

export async function GET(request: NextRequest) {
  // Generate a random state value for security
  const state = Math.random().toString(36).substring(2, 15)

  // Store the state in a cookie for verification later
  const response = NextResponse.redirect(
    `${GOOGLE_AUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}&response_type=code&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/calendar",
    )}&access_type=offline&prompt=consent&state=${state}`,
  )

  // Set a cookie with the state value
  response.cookies.set("google_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  return response
}
