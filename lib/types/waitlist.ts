import type { UserRole } from "@/lib/mock-data"

export type WaitlistStatus = "pending" | "notified" | "expired" | "fulfilled" | "cancelled"

export interface WaitlistRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: UserRole
  workspaceId: string
  workspaceName: string
  date: string
  startTime: string
  endTime: string
  requestedAt: string
  purpose: string
  attendees: number
  status: WaitlistStatus
  notes?: string
  notifiedAt?: string
  expiresAt?: string
  priority?: number
}
