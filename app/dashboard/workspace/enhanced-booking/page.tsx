"use client"

import { EnhancedBookingForm } from "@/components/expert/enhanced-booking-form"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function EnhancedBookingPage() {
  return (
    <PermissionGuard allowedRoles={["owner", "expert", "client"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Book a Workspace</h1>
          <p className="text-muted-foreground mt-1">Find and reserve available workspaces</p>
        </div>

        <EnhancedBookingForm />
      </div>
    </PermissionGuard>
  )
}
