"use client"

import { AdminWaitlistManagement } from "@/components/waitlist/admin-waitlist-management"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function WaitlistManagementPage() {
  return (
    <PermissionGuard allowedRoles={["owner"]}>
      <AdminWaitlistManagement />
    </PermissionGuard>
  )
}
