import { v4 as uuidv4 } from "uuid"

export interface Session {
  id: string
  title: string
  expertName: string
  clientName: string
  date: string
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  workspace: string
}

export const mockSessions: Session[] = [
  {
    id: uuidv4(),
    title: "React Performance Optimization",
    expertName: "Jane Smith",
    clientName: "Alice Williams",
    date: "2023-11-15",
    startTime: "10:00",
    endTime: "11:00",
    status: "scheduled",
    notes: "Focus on memo, useMemo, and useCallback hooks",
    workspace: "Tech Mentoring",
  },
  {
    id: uuidv4(),
    title: "Next.js App Router Migration",
    expertName: "Jane Smith",
    clientName: "Bob Johnson",
    date: "2023-11-16",
    startTime: "14:00",
    endTime: "15:30",
    status: "scheduled",
    notes: "Discuss migration strategy from pages to app router",
    workspace: "Tech Mentoring",
  },
  {
    id: uuidv4(),
    title: "TypeScript Advanced Types",
    expertName: "David Lee",
    clientName: "Alice Williams",
    date: "2023-11-14",
    startTime: "11:00",
    endTime: "12:00",
    status: "completed",
    notes: "Covered utility types, conditional types, and type inference",
    workspace: "Tech Mentoring",
  },
  {
    id: uuidv4(),
    title: "State Management Strategies",
    expertName: "Jane Smith",
    clientName: "Charlie Brown",
    date: "2023-11-13",
    startTime: "15:00",
    endTime: "16:00",
    status: "completed",
    notes: "Compared Redux, Zustand, Jotai, and React Context",
    workspace: "Tech Mentoring",
  },
  {
    id: uuidv4(),
    title: "API Design Best Practices",
    expertName: "David Lee",
    clientName: "Bob Johnson",
    date: "2023-11-17",
    startTime: "13:00",
    endTime: "14:00",
    status: "scheduled",
    workspace: "Tech Mentoring",
  },
  {
    id: uuidv4(),
    title: "Microservices Architecture",
    expertName: "Michael Chen",
    clientName: "Charlie Brown",
    date: "2023-11-18",
    startTime: "09:00",
    endTime: "10:30",
    status: "scheduled",
    notes: "Focus on service boundaries and communication patterns",
    workspace: "System Design",
  },
  {
    id: uuidv4(),
    title: "Database Optimization",
    expertName: "Michael Chen",
    clientName: "Alice Williams",
    date: "2023-11-12",
    startTime: "14:00",
    endTime: "15:00",
    status: "cancelled",
    notes: "Rescheduling needed due to expert availability",
    workspace: "System Design",
  },
  {
    id: uuidv4(),
    title: "CI/CD Pipeline Setup",
    expertName: "David Lee",
    clientName: "Bob Johnson",
    date: "2023-11-19",
    startTime: "16:00",
    endTime: "17:00",
    status: "scheduled",
    workspace: "DevOps",
  },
  {
    id: uuidv4(),
    title: "Kubernetes Fundamentals",
    expertName: "Michael Chen",
    clientName: "Charlie Brown",
    date: "2023-11-20",
    startTime: "10:00",
    endTime: "11:30",
    status: "scheduled",
    notes: "Introduction to pods, services, and deployments",
    workspace: "DevOps",
  },
  {
    id: uuidv4(),
    title: "Frontend Testing Strategies",
    expertName: "Jane Smith",
    clientName: "Alice Williams",
    date: "2023-11-21",
    startTime: "13:00",
    endTime: "14:00",
    status: "scheduled",
    notes: "Cover Jest, React Testing Library, and Cypress",
    workspace: "Tech Mentoring",
  },
]
