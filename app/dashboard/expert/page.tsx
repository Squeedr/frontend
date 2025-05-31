"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ExpertDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main dashboard which handles role-specific content
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Redirecting to dashboard...</h2>
        <p className="text-muted-foreground">Please wait while we load your expert dashboard.</p>
      </div>
    </div>
  )
} 