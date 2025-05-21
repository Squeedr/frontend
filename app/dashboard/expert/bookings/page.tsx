"use client"

import { ExpertBookingsDashboard } from "@/components/expert/expert-bookings-dashboard"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function ExpertBookingsPage() {
  return (
    <PermissionGuard allowedRoles={["owner", "expert"]}>
      <ExpertBookingsDashboard />
    </PermissionGuard>
  )
}
