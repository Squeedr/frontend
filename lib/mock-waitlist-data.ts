import { v4 as uuidv4 } from "uuid"
import { addDays, addHours, format, subDays } from "date-fns"
import type { WaitlistRequest } from "@/lib/types/waitlist"

// Generate a date string in ISO format
const formatDate = (date: Date): string => format(date, "yyyy-MM-dd")

// Generate a time string in HH:mm format
const formatTime = (date: Date): string => format(date, "HH:mm")

// Current date for reference
const now = new Date()

// Mock waitlist requests
export const mockWaitlistRequests: WaitlistRequest[] = [
  {
    id: uuidv4(),
    userId: "u1",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userRole: "expert",
    workspaceId: "ws1",
    workspaceName: "Conference Room A",
    date: formatDate(addDays(now, 2)),
    startTime: "10:00",
    endTime: "12:00",
    requestedAt: new Date().toISOString(),
    purpose: "Client Meeting",
    attendees: 6,
    status: "pending",
    notes: "Need a space with video conferencing capabilities",
    priority: 2,
  },
  {
    id: uuidv4(),
    userId: "u2",
    userName: "John Doe",
    userEmail: "john@example.com",
    userRole: "expert",
    workspaceId: "ws2",
    workspaceName: "Meeting Room B",
    date: formatDate(addDays(now, 1)),
    startTime: "14:00",
    endTime: "15:30",
    requestedAt: subDays(new Date(), 1).toISOString(),
    purpose: "Team Brainstorming",
    attendees: 4,
    status: "notified",
    notifiedAt: new Date().toISOString(),
    expiresAt: addHours(new Date(), 2).toISOString(),
    priority: 1,
  },
  {
    id: uuidv4(),
    userId: "u3",
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
    userRole: "expert",
    workspaceId: "ws1",
    workspaceName: "Conference Room A",
    date: formatDate(addDays(now, 3)),
    startTime: "09:00",
    endTime: "11:00",
    requestedAt: subDays(new Date(), 2).toISOString(),
    purpose: "Project Kickoff",
    attendees: 8,
    status: "fulfilled",
    notes: "Need a large space for the entire team",
  },
  {
    id: uuidv4(),
    userId: "u4",
    userName: "Michael Wilson",
    userEmail: "michael@example.com",
    userRole: "client",
    workspaceId: "ws3",
    workspaceName: "Quiet Office",
    date: formatDate(addDays(now, 1)),
    startTime: "13:00",
    endTime: "17:00",
    requestedAt: subDays(new Date(), 3).toISOString(),
    purpose: "Focus Work",
    attendees: 1,
    status: "cancelled",
  },
  {
    id: uuidv4(),
    userId: "u1",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userRole: "expert",
    workspaceId: "ws4",
    workspaceName: "Collaboration Space",
    date: formatDate(addDays(now, 4)),
    startTime: "11:00",
    endTime: "13:00",
    requestedAt: subDays(new Date(), 1).toISOString(),
    purpose: "Design Sprint",
    attendees: 5,
    status: "expired",
    notifiedAt: subDays(new Date(), 1).toISOString(),
    expiresAt: subDays(new Date(), 1).toISOString(),
  },
]

// Function to get waitlist requests for a specific user
export function getWaitlistRequestsByUser(userId: string): WaitlistRequest[] {
  return mockWaitlistRequests.filter((request) => request.userId === userId)
}

// Function to get waitlist requests for a specific workspace
export function getWaitlistRequestsByWorkspace(workspaceId: string): WaitlistRequest[] {
  return mockWaitlistRequests.filter((request) => request.workspaceId === workspaceId)
}

// Function to get waitlist requests by status
export function getWaitlistRequestsByStatus(status: string): WaitlistRequest[] {
  return mockWaitlistRequests.filter((request) => request.status === status)
}

// Function to get waitlist requests for a specific date
export function getWaitlistRequestsByDate(date: string): WaitlistRequest[] {
  return mockWaitlistRequests.filter((request) => request.date === date)
}
