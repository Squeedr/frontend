import { type NextRequest, NextResponse } from "next/server"

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/google/callback"

// Google OAuth endpoints
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

export async function GET(request: NextRequest) {
  // Get the authorization code and state from the query parameters
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  // Get the state from the cookie for verification
  const storedState = request.cookies.get("google_auth_state")?.value

  // Verify the state to prevent CSRF attacks
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/dashboard/availability?error=invalid_state", request.url))
  }

  // If no code was received, redirect to an error page
  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/availability?error=no_code", request.url))
  }

  try {
    // Exchange the authorization code for access and refresh tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Token exchange error:", errorData)
      return NextResponse.redirect(new URL("/dashboard/availability?error=token_exchange", request.url))
    }

    const tokenData = await tokenResponse.json()

    // Calculate the expiration time
    const expiresAt = Date.now() + tokenData.expires_in * 1000

    // Store the tokens in cookies or session (in a real app, you'd store these securely)
    const response = NextResponse.redirect(new URL("/dashboard/availability?success=true", request.url))

    // In a real app, you would store these tokens securely in a database
    // For this demo, we'll store them in cookies (not recommended for production)
    response.cookies.set("google_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    response.cookies.set("google_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    response.cookies.set("google_token_expires_at", expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    return NextResponse.redirect(new URL("/dashboard/availability?error=server_error", request.url))
  }
}
