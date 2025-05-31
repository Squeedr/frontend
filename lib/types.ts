// User Types
export type UserRole = "owner" | "expert" | "client"

export type UserStatus = "active" | "invited" | "suspended" | "inactive"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  workspaces?: string[]
  bio?: string
  createdAt?: string
  lastActive?: string
}

// Session Types
export type SessionStatus = "upcoming" | "in-progress" | "completed" | "cancelled" | "recording"

export interface Session {
  id: string
  title: string
  expertId: string
  expertName: string
  clientId: string
  clientName: string
  date: string
  startTime: string
  endTime: string
  status: SessionStatus
  price: number
  workspace: string
  recordingUrl?: string
  notes?: string
  tags?: string[]
}

// Expert Types
export interface Expert {
  id: string
  name: string
  email: string
  specialty: string
  bio?: string
  rating: number
  sessions: number
  revenue: number
  status: "active" | "inactive"
  workspaces: string[]
  hourlyRate?: number
  skills?: string[]
  availability?: Availability[]
  languages?: string[]
}

export interface Availability {
  day: string
  startTime: string
  endTime: string
}

// Workspace Types
export interface Workspace {
  id: string
  name: string
  description: string
  experts: number
  sessions: number
  revenue: number
  utilization: number
  createdAt?: string
  members?: string[]
  owner?: string
  location: string
  capacity: number
  amenities: string[]
  availability: string
  image: string
  type: string
  hourlyRate?: number
}

// Invoice Types
export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft"

export interface Invoice {
  id: string
  number: string
  clientId: string
  clientName: string
  expertId?: string
  expertName?: string
  amount: number
  date: string
  dueDate: string
  status: InvoiceStatus
  items: InvoiceItem[]
  signed: boolean
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Message Types
export type MessageType = "text" | "image" | "file" | "system"

export interface Message {
  id: string
  sender: string
  recipient: string
  content: string
  timestamp: string
  read: boolean
  type: MessageType
  attachmentUrl?: string
}

// Notification Types
export type NotificationType = "info" | "warning" | "success" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: NotificationType
  userId?: string
  link?: string
}

// Permission Types
export interface RolePerm {
  id: string
  name: string
  description?: string
  permissions: Record<string, boolean>
}

export interface PermissionRequest {
  id: string
  userId: string
  userName: string
  resource: string
  action: string
  reason: string
  status: "pending" | "approved" | "rejected"
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// Theme Types
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}

// Error Types
export interface AppError {
  id: string
  code: string
  message: string
  stack?: string
  timestamp: string
  userId?: string
  path?: string
  resolved: boolean
}
