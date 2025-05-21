"use client"

import { MyWaitlistRequests } from "@/components/waitlist/my-waitlist-requests"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function WaitlistPage() {
  return (
    <PermissionGuard allowedRoles={["owner", "expert", "client"]}>
      <MyWaitlistRequests />
    </PermissionGuard>
  )
}
