"use client"

import { v4 as uuidv4 } from "uuid"

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
  description?: string
  experts: number
  sessions: number
  revenue: number
  utilization: number
  createdAt?: string
  members?: string[]
  owner?: string
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

export interface Rating {
  id: string
  expertName: string
  clientName: string
  sessionTitle: string
  rating: number
  comment: string
  date: string
}

// Mock Ratings
export const ratings: Rating[] = [
  {
    id: uuidv4(),
    expertName: "John Doe",
    clientName: "Alice Johnson",
    sessionTitle: "JavaScript Fundamentals",
    rating: 5,
    comment: "Excellent session! John explained everything clearly and was very helpful.",
    date: "2023-06-15",
  },
  {
    id: uuidv4(),
    expertName: "Bob Williams",
    clientName: "Carol Brown",
    sessionTitle: "UX Research Methods",
    rating: 4,
    comment: "Good session, but I wish there were more practical examples.",
    date: "2023-06-14",
  },
  {
    id: uuidv4(),
    expertName: "John Doe",
    clientName: "Alice Johnson",
    sessionTitle: "Advanced React Patterns",
    rating: 5,
    comment: "Another great session with John! He's a fantastic teacher.",
    date: "2023-06-16",
  },
]

// Mock Experts data
export const experts: Expert[] = [
  {
    id: "e1",
    name: "Jane Smith",
    email: "jane@example.com",
    specialty: "React Development",
    bio: "Senior React developer with 8 years of experience building scalable web applications.",
    rating: 4.8,
    sessions: 24,
    revenue: 2400,
    status: "active",
    workspaces: ["Web Development", "Frontend"],
    hourlyRate: 100,
    skills: ["React", "TypeScript", "Redux", "Next.js"],
    languages: ["English", "Spanish"],
  },
  {
    id: "e2",
    name: "John Doe",
    email: "john@example.com",
    specialty: "JavaScript",
    bio: "Full-stack JavaScript developer specializing in Node.js and React.",
    rating: 4.9,
    sessions: 36,
    revenue: 5400,
    status: "active",
    workspaces: ["Web Development", "Backend"],
    hourlyRate: 120,
    skills: ["JavaScript", "Node.js", "Express", "MongoDB"],
    languages: ["English", "French"],
  },
  {
    id: "e3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    specialty: "UX Design",
    bio: "UX designer with a focus on user research and creating intuitive interfaces.",
    rating: 4.7,
    sessions: 18,
    revenue: 2160,
    status: "active",
    workspaces: ["Design", "Frontend"],
    hourlyRate: 90,
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    languages: ["English", "German"],
  },
  {
    id: "e4",
    name: "David Lee",
    email: "david@example.com",
    specialty: "Mobile Development",
    bio: "iOS and Android developer with expertise in React Native and Swift.",
    rating: 4.6,
    sessions: 15,
    revenue: 1950,
    status: "inactive",
    workspaces: ["Mobile Development"],
    hourlyRate: 110,
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    languages: ["English", "Korean"],
  },
  {
    id: "e5",
    name: "Michael Wilson",
    email: "michael@example.com",
    specialty: "Data Science",
    bio: "Data scientist with a background in machine learning and statistical analysis.",
    rating: 4.9,
    sessions: 12,
    revenue: 2160,
    status: "active",
    workspaces: ["Data Science", "Machine Learning"],
    hourlyRate: 150,
    skills: ["Python", "R", "TensorFlow", "SQL"],
    languages: ["English"],
  },
]

// Mock Sessions data
export const sessions: Session[] = [
  {
    id: "s1",
    title: "Introduction to React",
    expertId: "e1",
    expertName: "Jane Smith",
    clientId: "c1",
    clientName: "Bob Johnson",
    workspace: "Web Development",
    date: "2024-05-10",
    startTime: "10:00",
    endTime: "11:00",
    status: "upcoming",
    price: 100,
  },
  {
    id: "s2",
    title: "Advanced JavaScript Patterns",
    expertId: "e2",
    expertName: "John Doe",
    clientId: "c2",
    clientName: "Alice Williams",
    workspace: "Web Development",
    date: "2024-05-07",
    startTime: "14:00",
    endTime: "15:30",
    status: "in-progress",
    price: 150,
  },
  {
    id: "s3",
    title: "UX Design Principles",
    expertId: "e3",
    expertName: "Sarah Johnson",
    clientId: "c3",
    clientName: "Mike Brown",
    workspace: "Design",
    date: "2024-05-05",
    startTime: "09:00",
    endTime: "10:00",
    status: "completed",
    price: 120,
    recordingUrl: "/recordings/session-s3-1620201600000.mp4",
  },
  {
    id: "s4",
    title: "Mobile App Development",
    expertId: "e4",
    expertName: "David Lee",
    clientId: "c4",
    clientName: "Emma Davis",
    workspace: "Mobile Development",
    date: "2024-05-03",
    startTime: "13:00",
    endTime: "14:00",
    status: "cancelled",
    price: 130,
  },
  {
    id: "s5",
    title: "Data Science Fundamentals",
    expertId: "e5",
    expertName: "Michael Wilson",
    clientId: "c5",
    clientName: "Olivia Martin",
    workspace: "Data Science",
    date: "2024-05-12",
    startTime: "11:00",
    endTime: "12:30",
    status: "upcoming",
    price: 180,
  },
]

// Mock Workspaces data
export const workspaces = [
  {
    id: "1",
    name: "Conference Room A",
    description: "Large conference room with video conferencing equipment and whiteboard.",
    location: "Floor 1, East Wing",
    capacity: 12,
    type: "Conference Room",
    availability: "Available",
    image: "/modern-conference-room.png",
    amenities: ["Projector", "Video Conferencing", "Whiteboard", "WiFi"],
  },
  {
    id: "2",
    name: "Meeting Room B",
    description: "Medium-sized meeting room ideal for team discussions.",
    location: "Floor 2, West Wing",
    capacity: 6,
    type: "Meeting Room",
    availability: "Available",
    image: "/modern-meeting-room.png",
    amenities: ["TV Screen", "Whiteboard", "WiFi"],
  },
  {
    id: "3",
    name: "Quiet Office",
    description: "Private office space for focused work or private meetings.",
    location: "Floor 3, North Wing",
    capacity: 2,
    type: "Office",
    availability: "Available",
    image: "/quiet-office.png",
    amenities: ["Desk", "Phone", "WiFi"],
  },
  {
    id: "4",
    name: "Collaboration Space",
    description: "Open area designed for team collaboration and creative sessions.",
    location: "Floor 1, Central Area",
    capacity: 8,
    type: "Collaboration Space",
    availability: "Available",
    image: "/modern-collaboration-space.png",
    amenities: ["Whiteboards", "Flexible Furniture", "WiFi", "Coffee Station"],
  },
  {
    id: "5",
    name: "Open Workspace",
    description: "Shared workspace with multiple desks and amenities.",
    location: "Floor 2, South Wing",
    capacity: 15,
    type: "Desk",
    availability: "Available",
    image: "/modern-open-office.png",
    amenities: ["Desks", "Ergonomic Chairs", "WiFi", "Printer"],
  },
  {
    id: "6",
    name: "Executive Boardroom",
    description: "Premium meeting space for important client meetings and executive discussions.",
    location: "Floor 4, East Wing",
    capacity: 10,
    type: "Conference Room",
    availability: "Booked",
    image: "/modern-conference-room.png",
    amenities: ["Video Conferencing", "Premium Audio", "Digital Whiteboard", "Catering Available"],
  },
]

// Mock Invoices data
export const invoices: Invoice[] = [
  {
    id: "i1",
    number: "INV-001",
    clientId: "c1",
    clientName: "Bob Johnson",
    expertId: "e1",
    expertName: "Jane Smith",
    amount: 150,
    date: "2024-04-15",
    dueDate: "2024-04-29",
    status: "paid",
    items: [
      {
        id: "item1",
        description: "React Consultation Session",
        quantity: 1,
        unitPrice: 150,
        total: 150,
      },
    ],
    signed: true,
  },
  {
    id: "i2",
    number: "INV-002",
    clientId: "c2",
    clientName: "Alice Williams",
    expertId: "e2",
    expertName: "John Doe",
    amount: 200,
    date: "2024-04-20",
    dueDate: "2024-05-04",
    status: "pending",
    items: [
      {
        id: "item2",
        description: "JavaScript Advanced Training",
        quantity: 2,
        unitPrice: 100,
        total: 200,
      },
    ],
    signed: false,
  },
  {
    id: "i3",
    number: "INV-003",
    clientId: "c3",
    clientName: "Mike Brown",
    expertId: "e3",
    expertName: "Sarah Johnson",
    amount: 175,
    date: "2024-04-25",
    dueDate: "2024-05-09",
    status: "draft",
    items: [
      {
        id: "item3",
        description: "UX Design Review",
        quantity: 1,
        unitPrice: 175,
        total: 175,
      },
    ],
    signed: false,
  },
]

// Mock Messages data
export const messages: Message[] = [
  {
    id: "m1",
    sender: "Bob Johnson",
    recipient: "Jane Smith",
    content: "Looking forward to our session tomorrow!",
    timestamp: "2024-05-09T15:30:00",
    read: true,
    type: "text",
  },
  {
    id: "m2",
    sender: "Jane Smith",
    recipient: "Bob Johnson",
    content: "Me too! I've prepared some great material for you.",
    timestamp: "2024-05-09T15:45:00",
    read: true,
    type: "text",
  },
  {
    id: "m3",
    sender: "Alice Williams",
    recipient: "John Doe",
    content: "Do you have any pre-reading for our session?",
    timestamp: "2024-05-06T10:20:00",
    read: true,
    type: "text",
  },
  {
    id: "m4",
    sender: "John Doe",
    recipient: "Alice Williams",
    content: "Yes, I'll send you some resources shortly.",
    timestamp: "2024-05-06T11:05:00",
    read: false,
    type: "text",
  },
  {
    id: "m5",
    sender: "Mike Brown",
    recipient: "Sarah Johnson",
    content: "Thanks for the great session yesterday!",
    timestamp: "2024-05-06T09:15:00",
    read: false,
    type: "text",
  },
]

// Mock Notifications data
export const notifications: Notification[] = [
  {
    id: "n1",
    title: "New Session Booked",
    message: "You have a new session booked with Bob Johnson.",
    time: "2024-05-10T10:30:00Z", // Added 'Z' to ensure valid ISO format
    read: false,
    type: "info",
  },
  {
    id: "n2",
    title: "Session Starting Soon",
    message: "Your session with Alice Williams starts in 15 minutes.",
    time: "2024-05-07T13:45:00Z", // Added 'Z' to ensure valid ISO format
    read: true,
    type: "warning",
  },
  {
    id: "n3",
    title: "Payment Received",
    message: "You received a payment of $120 from Mike Brown.",
    time: "2024-05-05T16:20:00Z", // Added 'Z' to ensure valid ISO format
    read: false,
    type: "success",
  },
  {
    id: "n4",
    title: "Session Cancelled",
    message: "Emma Davis has cancelled the upcoming session.",
    time: "2024-05-03T09:15:00Z", // Added 'Z' to ensure valid ISO format
    read: true,
    type: "error",
  },
  {
    id: "n5",
    title: "New Rating",
    message: "Olivia Martin has left a 5-star rating for your session.",
    time: "2024-05-12T14:10:00Z", // Added 'Z' to ensure valid ISO format
    read: false,
    type: "success",
  },
]

// Calendar events (sessions formatted for calendar)
export const calendarEvents = sessions.map((session) => ({
  id: session.id,
  title: session.title,
  expert: session.expertName,
  client: session.clientName,
  start: `${session.date}T${session.startTime}:00`,
  end: `${session.date}T${session.endTime}:00`,
  status: session.status,
  workspace: session.workspace,
}))

export const rolePermissions = [
  {
    id: "r1",
    name: "owner",
    description: "Full access to all features and settings",
    permissions: {
      dashboard: true,
      sessions: true,
      calendar: true,
      experts: true,
      workspaces: true,
      ratings: true,
      messages: true,
      invoices: true,
      notifications: true,
      availability: true,
      settings: true,
      profile: true,
      users: true,
      roles: true,
    },
  },
  {
    id: "r2",
    name: "expert",
    description: "Access to sessions, calendar, and client management",
    permissions: {
      dashboard: true,
      sessions: true,
      calendar: true,
      experts: false,
      workspaces: true,
      ratings: true,
      messages: true,
      invoices: true,
      notifications: true,
      availability: true,
      settings: false,
      profile: true,
      users: false,
      roles: false,
    },
  },
  {
    id: "r3",
    name: "client",
    description: "Limited access to book sessions and view their own data",
    permissions: {
      dashboard: true,
      sessions: true,
      calendar: true,
      experts: false,
      workspaces: false,
      ratings: false,
      messages: true,
      invoices: true,
      notifications: true,
      availability: false,
      settings: false,
      profile: true,
      users: false,
      roles: false,
    },
  },
  {
    id: "r4",
    name: "custom",
    description: "Custom role with specific permissions",
    permissions: {
      dashboard: true,
      sessions: true,
      calendar: true,
      experts: true,
      workspaces: true,
      ratings: false,
      messages: true,
      invoices: false,
      notifications: true,
      availability: true,
      settings: false,
      profile: true,
      users: false,
      roles: false,
    },
  },
]

export const filterOptions = {
  workspaces: ["Web Development", "Design", "Marketing", "Sales", "HR", "Finance", "Executive"],
  statuses: ["upcoming", "in-progress", "completed", "cancelled"],
  dateRanges: ["Today", "This Week", "This Month", "Last Month", "This Year"],
}
