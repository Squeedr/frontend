import { addDays, addMinutes, setHours, startOfDay, subDays } from "date-fns"
import type { CalendarEvent } from "@/components/draggable-event"

// Helper to create ISO string dates
const toISOString = (date: Date) => date.toISOString()

// Get today and set to start of day
const today = startOfDay(new Date())

// Create a set of mock calendar events with various types, durations, and patterns
export const mockCalendarEvents: CalendarEvent[] = [
  // Regular meetings
  {
    id: "event-1",
    title: "Team Standup",
    start: toISOString(setHours(today, 9)),
    end: toISOString(setHours(today, 9.5)),
    status: "upcoming",
    workspace: "Web Development",
    description: "Daily team standup meeting to discuss progress and blockers",
    location: "Meeting Room A",
  },
  {
    id: "event-2",
    title: "Project Planning",
    start: toISOString(setHours(today, 11)),
    end: toISOString(setHours(today, 12)),
    status: "upcoming",
    workspace: "Web Development",
    description: "Quarterly planning session for the new feature roadmap",
    location: "Conference Room",
  },
  {
    id: "event-3",
    title: "Client Meeting",
    start: toISOString(setHours(today, 14)),
    end: toISOString(setHours(today, 15)),
    status: "upcoming",
    workspace: "Client Projects",
    description: "Discussion about project requirements and timeline",
    location: "Virtual - Zoom",
  },

  // Long events
  {
    id: "event-4",
    title: "Design Workshop",
    start: toISOString(setHours(today, 13)),
    end: toISOString(setHours(today, 17)),
    status: "in-progress",
    workspace: "Design",
    description: "Full-day workshop to finalize the design system for the new product",
    location: "Design Lab",
  },

  // Events on different days
  {
    id: "event-5",
    title: "Code Review",
    start: toISOString(setHours(addDays(today, 1), 10)),
    end: toISOString(setHours(addDays(today, 1), 11)),
    status: "upcoming",
    workspace: "Web Development",
    description: "Review pull requests and discuss code quality",
    location: "Virtual",
  },
  {
    id: "event-6",
    title: "Product Demo",
    start: toISOString(setHours(addDays(today, 1), 15)),
    end: toISOString(setHours(addDays(today, 1), 16)),
    status: "upcoming",
    workspace: "Product",
    description: "Demonstrate new features to stakeholders",
    location: "Demo Room",
  },

  // Events in the past
  {
    id: "event-7",
    title: "Sprint Retrospective",
    start: toISOString(setHours(subDays(today, 1), 16)),
    end: toISOString(setHours(subDays(today, 1), 17)),
    status: "completed",
    workspace: "Web Development",
    description: "Review the previous sprint and identify improvements",
    location: "Meeting Room B",
  },

  // Events with odd times
  {
    id: "event-8",
    title: "Quick Sync",
    start: toISOString(addMinutes(setHours(today, 10), 15)),
    end: toISOString(addMinutes(setHours(today, 10), 30)),
    status: "upcoming",
    workspace: "Web Development",
    description: "Quick sync with the frontend team",
    location: "Slack Huddle",
  },

  // Multi-day events
  {
    id: "event-9",
    title: "Conference",
    start: toISOString(setHours(addDays(today, 3), 9)),
    end: toISOString(setHours(addDays(today, 5), 17)),
    status: "upcoming",
    workspace: "Professional Development",
    description: "Annual industry conference with workshops and networking",
    location: "Convention Center",
  },

  // Cancelled events
  {
    id: "event-10",
    title: "Vendor Meeting",
    start: toISOString(setHours(addDays(today, 2), 11)),
    end: toISOString(setHours(addDays(today, 2), 12)),
    status: "cancelled",
    workspace: "Operations",
    description: "Meeting with potential vendors for new office equipment",
    location: "Virtual",
  },

  // Early morning events
  {
    id: "event-11",
    title: "Early Breakfast Meeting",
    start: toISOString(setHours(addDays(today, 2), 7)),
    end: toISOString(setHours(addDays(today, 2), 8)),
    status: "upcoming",
    workspace: "Executive",
    description: "Breakfast meeting with executive team",
    location: "Cafe Downstairs",
  },

  // Late evening events
  {
    id: "event-12",
    title: "Release Deployment",
    start: toISOString(setHours(addDays(today, 4), 20)),
    end: toISOString(setHours(addDays(today, 4), 22)),
    status: "upcoming",
    workspace: "DevOps",
    description: "Deployment of new release to production",
    location: "Remote",
  },

  // Events with different workspaces
  {
    id: "event-13",
    title: "Marketing Strategy",
    start: toISOString(setHours(addDays(today, 3), 13)),
    end: toISOString(setHours(addDays(today, 3), 14)),
    status: "upcoming",
    workspace: "Marketing",
    description: "Planning session for Q3 marketing campaigns",
    location: "Marketing Department",
  },
  {
    id: "event-14",
    title: "Sales Pipeline Review",
    start: toISOString(setHours(addDays(today, 3), 15)),
    end: toISOString(setHours(addDays(today, 3), 16)),
    status: "upcoming",
    workspace: "Sales",
    description: "Review of current sales pipeline and forecasting",
    location: "Sales Floor",
  },

  // Events with different statuses
  {
    id: "event-15",
    title: "Interview: Frontend Developer",
    start: toISOString(setHours(today, 16)),
    end: toISOString(setHours(today, 17)),
    status: "in-progress",
    workspace: "Recruiting",
    description: "Interview with candidate for the Frontend Developer position",
    location: "Interview Room 1",
  },
  {
    id: "event-16",
    title: "Budget Review",
    start: toISOString(setHours(addDays(today, -2), 14)),
    end: toISOString(setHours(addDays(today, -2), 15)),
    status: "completed",
    workspace: "Finance",
    description: "Monthly budget review meeting",
    location: "Finance Department",
  },

  // Overlapping events
  {
    id: "event-17",
    title: "UX Research",
    start: toISOString(setHours(today, 13.5)),
    end: toISOString(setHours(today, 14.5)),
    status: "upcoming",
    workspace: "Design",
    description: "User research session for new product features",
    location: "Research Lab",
  },

  // Events for next week
  {
    id: "event-18",
    title: "Quarterly Review",
    start: toISOString(setHours(addDays(today, 7), 10)),
    end: toISOString(setHours(addDays(today, 7), 12)),
    status: "upcoming",
    workspace: "Executive",
    description: "Quarterly business review with all department heads",
    location: "Main Conference Room",
  },

  // Events for previous week
  {
    id: "event-19",
    title: "Team Building",
    start: toISOString(setHours(addDays(today, -7), 13)),
    end: toISOString(setHours(addDays(today, -7), 17)),
    status: "completed",
    workspace: "HR",
    description: "Team building activities and games",
    location: "City Park",
  },

  // Weekend events
  {
    id: "event-20",
    title: "Hackathon",
    start: toISOString(setHours(addDays(today, 6 - today.getDay()), 9)), // Next Saturday
    end: toISOString(setHours(addDays(today, 6 - today.getDay()), 18)), // Next Saturday
    status: "upcoming",
    workspace: "Innovation",
    description: "Company-wide hackathon to develop new product ideas",
    location: "Innovation Hub",
  },
]

// Add more events to test scrolling and dense views
for (let i = 0; i < 10; i++) {
  const randomDay = Math.floor(Math.random() * 14) - 7 // -7 to +7 days from today
  const randomHour = Math.floor(Math.random() * 10) + 8 // 8 AM to 6 PM
  const randomDuration = Math.floor(Math.random() * 2) + 0.5 // 0.5 to 2.5 hours

  const workspaces = ["Web Development", "Design", "Marketing", "Sales", "HR", "Finance", "Executive"]
  const randomWorkspace = workspaces[Math.floor(Math.random() * workspaces.length)]

  const statuses = ["upcoming", "in-progress", "completed", "cancelled"] as const
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

  mockCalendarEvents.push({
    id: `event-extra-${i + 1}`,
    title: `Random Meeting ${i + 1}`,
    start: toISOString(setHours(addDays(today, randomDay), randomHour)),
    end: toISOString(setHours(addDays(today, randomDay), randomHour + randomDuration)),
    status: randomStatus,
    workspace: randomWorkspace,
    description: `This is a randomly generated event for testing purposes.`,
    location: `Room ${Math.floor(Math.random() * 10) + 1}`,
  })
}
