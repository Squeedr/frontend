import { v4 as uuidv4 } from "uuid"

export type PermissionRequestStatus = "pending" | "approved" | "denied"

export interface PermissionRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestedPermissions: string[]
  reason: string
  status: PermissionRequestStatus
  requestDate: string
  responseDate?: string
  responseBy?: string
  responseReason?: string
}

// Initial mock data for permission requests
export const mockPermissionRequests: PermissionRequest[] = [
  {
    id: uuidv4(),
    userId: "u3",
    userName: "Michael Brown",
    userEmail: "michael@example.com",
    requestedPermissions: ["calendar.edit", "sessions.create"],
    reason: "Need to create and manage sessions for my clients",
    status: "pending",
    requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: uuidv4(),
    userId: "u5",
    userName: "David Wilson",
    userEmail: "david@example.com",
    requestedPermissions: ["workspaces.view"],
    reason: "Need to view workspaces to coordinate with team members",
    status: "approved",
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    responseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    responseBy: "Alex Johnson",
    responseReason: "Approved as requested for team coordination",
  },
  {
    id: uuidv4(),
    userId: "u7",
    userName: "Robert Taylor",
    userEmail: "robert@example.com",
    requestedPermissions: ["invoices.create", "invoices.edit"],
    reason: "Need to manage invoices for my clients",
    status: "denied",
    requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    responseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    responseBy: "Alex Johnson",
    responseReason: "Invoice management is restricted to accounting team",
  },
]

// Available permissions that can be requested
export const availablePermissions = [
  { id: "dashboard.view", name: "View Dashboard", description: "Access to view the main dashboard" },
  { id: "sessions.view", name: "View Sessions", description: "View all sessions" },
  { id: "sessions.create", name: "Create Sessions", description: "Create new sessions" },
  { id: "sessions.edit", name: "Edit Sessions", description: "Edit existing sessions" },
  { id: "calendar.view", name: "View Calendar", description: "View the calendar" },
  { id: "calendar.edit", name: "Edit Calendar", description: "Add and edit calendar events" },
  { id: "experts.view", name: "View Experts", description: "View expert profiles" },
  { id: "workspaces.view", name: "View Workspaces", description: "View workspaces" },
  { id: "workspaces.edit", name: "Edit Workspaces", description: "Create and edit workspaces" },
  { id: "ratings.view", name: "View Ratings", description: "View ratings and feedback" },
  { id: "messages.send", name: "Send Messages", description: "Send messages to other users" },
  { id: "invoices.view", name: "View Invoices", description: "View invoices" },
  { id: "invoices.create", name: "Create Invoices", description: "Create new invoices" },
  { id: "invoices.edit", name: "Edit Invoices", description: "Edit existing invoices" },
  { id: "settings.edit", name: "Edit Settings", description: "Change application settings" },
]

// Group permissions by category
export const permissionCategories = [
  {
    name: "Dashboard",
    permissions: availablePermissions.filter((p) => p.id.startsWith("dashboard.")),
  },
  {
    name: "Sessions",
    permissions: availablePermissions.filter((p) => p.id.startsWith("sessions.")),
  },
  {
    name: "Calendar",
    permissions: availablePermissions.filter((p) => p.id.startsWith("calendar.")),
  },
  {
    name: "Experts",
    permissions: availablePermissions.filter((p) => p.id.startsWith("experts.")),
  },
  {
    name: "Workspaces",
    permissions: availablePermissions.filter((p) => p.id.startsWith("workspaces.")),
  },
  {
    name: "Ratings",
    permissions: availablePermissions.filter((p) => p.id.startsWith("ratings.")),
  },
  {
    name: "Messages",
    permissions: availablePermissions.filter((p) => p.id.startsWith("messages.")),
  },
  {
    name: "Invoices",
    permissions: availablePermissions.filter((p) => p.id.startsWith("invoices.")),
  },
  {
    name: "Settings",
    permissions: availablePermissions.filter((p) => p.id.startsWith("settings.")),
  },
]
