export interface User {
  id: string
  name: string
  email: string
  role: "owner" | "expert" | "client" | string
  status: "active" | "invited" | "suspended"
  workspaces?: string[]
  avatarUrl?: string
}

export interface RolePerm {
  id: string
  name: string
  description?: string
  permissions: Record<string, boolean>
}

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    email: "alex@squeedr.com",
    role: "owner",
    status: "active",
    avatarUrl: "/abstract-letter-aj.png",
  },
  {
    id: "u2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "expert",
    status: "active",
    avatarUrl: "/stylized-sw.png",
  },
  {
    id: "u3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "client",
    status: "invited",
    avatarUrl: "/monogram-mb.png",
  },
  {
    id: "u4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "expert",
    status: "active",
    avatarUrl: "/ed-initials-abstract.png",
  },
  {
    id: "u5",
    name: "David Wilson",
    email: "david@example.com",
    role: "client",
    status: "suspended",
    avatarUrl: "/abstract-dw.png",
  },
  {
    id: "u6",
    name: "Jessica Martinez",
    email: "jessica@squeedr.com",
    role: "owner",
    status: "active",
    avatarUrl: "/abstract-jm.png",
  },
  {
    id: "u7",
    name: "Robert Taylor",
    email: "robert@example.com",
    role: "expert",
    status: "invited",
    avatarUrl: "/road-trip-scenic-route.png",
  },
]

export const mockRoles: RolePerm[] = [
  {
    id: "r1",
    name: "Owner",
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
    name: "Expert",
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
    name: "Client",
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
    name: "Custom",
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

export const workspaces = ["Marketing", "Sales", "Engineering", "Design", "Customer Support"]
