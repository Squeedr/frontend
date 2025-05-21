export type MaintenanceStatus = "scheduled" | "in-progress" | "completed" | "cancelled" | "overdue"

export type MaintenancePriority = "low" | "medium" | "high" | "urgent"

export type MaintenanceType =
  | "cleaning"
  | "repair"
  | "inspection"
  | "upgrade"
  | "furniture"
  | "technology"
  | "plumbing"
  | "electrical"
  | "hvac"
  | "other"

export interface MaintenanceTask {
  id: string
  workspaceId: string
  workspaceName: string
  title: string
  description: string
  type: MaintenanceType
  priority: MaintenancePriority
  status: MaintenanceStatus
  scheduledDate: string
  estimatedDuration: number // in hours
  assignedTo?: string
  assigneeName?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  notes?: string
  attachments?: string[]
  cost?: number
  recurrence?: "none" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  affectsAvailability: boolean
}

export interface MaintenanceLog {
  id: string
  taskId: string
  timestamp: string
  userId: string
  userName: string
  action: string
  notes?: string
  statusChange?: {
    from: MaintenanceStatus
    to: MaintenanceStatus
  }
  attachments?: string[]
}
