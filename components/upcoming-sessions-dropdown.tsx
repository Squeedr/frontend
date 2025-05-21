"use client"

import * as React from "react"
import { Calendar, Clock, Video, Edit3, X, ChevronRight, CalendarDays, MapPin, Users, Check } from "lucide-react"
import { format, addDays, isBefore, isToday, isTomorrow, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRole } from "@/hooks/use-role"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

// Session type definition
interface Session {
  id: string
  title: string
  date: Date
  endDate: Date
  duration: number // in minutes
  status: "scheduled" | "confirmed" | "pending" | "cancelled"
  workspace?: {
    id: string
    name: string
    location?: string
  }
  with: {
    name: string
    role: "expert" | "client"
    avatar?: string
  }
}

// Workspace reservation type definition
interface WorkspaceReservation {
  id: string
  workspaceName: string
  location: string
  startDate: Date
  endDate: Date
  status: "confirmed" | "pending" | "cancelled"
  capacity: number
  currentAttendees: number
  isHost: boolean
  attendees: {
    name: string
    avatar?: string
  }[]
}

// Generate mock sessions for the next 7 days
const generateMockSessions = (role: string): Session[] => {
  const now = new Date()
  const sessions: Session[] = []

  // Different sessions based on role
  if (role === "owner") {
    for (let i = 0; i < 5; i++) {
      const date = addDays(now, Math.floor(Math.random() * 7))
      date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0)
      const duration = [30, 45, 60, 90][Math.floor(Math.random() * 4)]
      const endDate = new Date(date)
      endDate.setMinutes(date.getMinutes() + duration)

      sessions.push({
        id: `session-${i}`,
        title: ["Strategy Meeting", "Team Review", "Platform Overview", "Quarterly Planning", "Onboarding"][i % 5],
        date,
        endDate,
        duration,
        status: ["scheduled", "confirmed", "pending", "cancelled"][Math.floor(Math.random() * 3)] as "scheduled" | "confirmed" | "pending" | "cancelled",
        workspace:
          Math.random() > 0.3
            ? {
                id: `ws-${i}`,
                name: [
                  "Main Conference Room",
                  "Innovation Lab",
                  "Meeting Room A",
                  "Collaboration Space",
                  "Virtual Room",
                ][i % 5],
                location: ["Floor 1", "Floor 2", "Building B", "Remote", "East Wing"][i % 5],
              }
            : undefined,
        with: {
          name: ["Sarah Johnson", "Michael Chen", "Emma Wilson", "David Rodriguez", "Olivia Kim"][i % 5],
          role: Math.random() > 0.5 ? "expert" : "client",
          avatar: `/placeholder.svg?height=40&width=40&query=avatar${i}`,
        },
      })
    }
  } else if (role === "expert") {
    for (let i = 0; i < 4; i++) {
      const date = addDays(now, Math.floor(Math.random() * 5))
      date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0)
      const duration = [45, 60, 90][Math.floor(Math.random() * 3)]
      const endDate = new Date(date)
      endDate.setMinutes(date.getMinutes() + duration)

      sessions.push({
        id: `session-${i}`,
        title: ["Coaching Session", "Consultation", "Follow-up Meeting", "Initial Assessment"][i % 4],
        date,
        endDate,
        duration,
        status: ["scheduled", "confirmed", "pending"][Math.floor(Math.random() * 3)] as "scheduled" | "confirmed" | "pending" | "cancelled",
        workspace:
          Math.random() > 0.4
            ? {
                id: `ws-${i}`,
                name: ["Coaching Room", "Virtual Meeting", "Client Space", "Consultation Room"][i % 4],
                location: ["Floor 1", "Remote", "Client Site", "Main Building"][i % 4],
              }
            : undefined,
        with: {
          name: ["Alex Morgan", "Jamie Lee", "Taylor Swift", "Chris Evans"][i % 4],
          role: "client",
          avatar: `/placeholder.svg?height=40&width=40&query=client${i}`,
        },
      })
    }
  } else {
    // client
    for (let i = 0; i < 3; i++) {
      const date = addDays(now, Math.floor(Math.random() * 4))
      date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0)
      const duration = [45, 60][Math.floor(Math.random() * 2)]
      const endDate = new Date(date)
      endDate.setMinutes(date.getMinutes() + duration)

      sessions.push({
        id: `session-${i}`,
        title: ["Career Coaching", "Financial Planning", "Wellness Consultation"][i % 3],
        date,
        endDate,
        duration,
        status: ["scheduled", "confirmed"][Math.floor(Math.random() * 2)] as "scheduled" | "confirmed" | "pending" | "cancelled",
        workspace:
          Math.random() > 0.3
            ? {
                id: `ws-${i}`,
                name: ["Expert Office", "Virtual Room", "Wellness Center"][i % 3],
                location: ["Downtown", "Remote", "North Branch"][i % 3],
              }
            : undefined,
        with: {
          name: ["Dr. Emily Chen", "Prof. James Wilson", "Coach Sarah Smith"][i % 3],
          role: "expert",
          avatar: `/placeholder.svg?height=40&width=40&query=expert${i}`,
        },
      })
    }
  }

  // Sort by date (closest first)
  return sessions.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Generate mock workspace reservations
const generateMockWorkspaceReservations = (role: string): WorkspaceReservation[] => {
  const now = new Date()
  const reservations: WorkspaceReservation[] = []

  // Number of reservations based on role
  const count = role === "owner" ? 4 : role === "expert" ? 3 : 2

  for (let i = 0; i < count; i++) {
    const startDate = addDays(now, Math.floor(Math.random() * 7))
    startDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 4) * 15, 0)

    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 1 + Math.floor(Math.random() * 3))

    const capacity = [4, 6, 8, 12, 20][Math.floor(Math.random() * 5)]
    const currentAttendees = Math.floor(Math.random() * (capacity - 1)) + 1

    const attendees = []
    for (let j = 0; j < currentAttendees; j++) {
      attendees.push({
        name: ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", "James Wilson", "Olivia Martinez"][
          Math.floor(Math.random() * 6)
        ],
        avatar: Math.random() > 0.3 ? `/placeholder.svg?height=40&width=40&query=person${j}` : undefined,
      })
    }

    reservations.push({
      id: `res-${i}`,
      workspaceName: [
        "Conference Room A",
        "Innovation Lab",
        "Collaboration Space",
        "Meeting Room B",
        "Quiet Zone",
        "Virtual Workspace",
      ][i % 6],
      location: ["Floor 1", "Floor 2", "Building B", "East Wing", "West Wing", "Remote"][i % 6],
      startDate,
      endDate,
      status: ["confirmed", "pending", "cancelled"][Math.floor(Math.random() * 2)] as "confirmed" | "pending" | "cancelled",
      capacity,
      currentAttendees,
      isHost: Math.random() > 0.5,
      attendees,
    })
  }

  // Sort by date (closest first)
  return reservations.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

// Optimize the component with React.memo and useCallback
export const UpcomingSessionsDropdown = React.memo(function UpcomingSessionsDropdown() {
  const { role } = useRole()
  const { toast } = useToast()
  const [sessions, setSessions] = React.useState<Session[]>([])
  const [workspaceReservations, setWorkspaceReservations] = React.useState<WorkspaceReservation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState("sessions")

  // Memoize the fetchData function
  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Generate mock data based on role
      const mockSessions = generateMockSessions(role)
      const mockReservations = generateMockWorkspaceReservations(role)
      
      setSessions(mockSessions)
      setWorkspaceReservations(mockReservations)
    } catch (error) {
      console.error("Error fetching sessions:", error)
      toast({
        title: "Error",
        description: "Failed to load sessions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [role, toast])

  // Fetch data on component mount
  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Memoize helper functions
  const formatSessionDate = React.useCallback((date: Date) => {
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "EEE, MMM d")
  }, [])

  const formatTimeRange = React.useCallback((start: Date, end: Date) => {
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
  }, [])

  const getStatusColor = React.useCallback((status: "scheduled" | "confirmed" | "pending" | "cancelled") => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }, [])

  // Memoize event handlers
  const handleJoinSession = React.useCallback((sessionId: string) => {
    toast({
      title: "Joining session",
      description: `Joining session ${sessionId}...`,
    })
    // Implement actual join logic here
  }, [toast])

  const handleEditSession = React.useCallback((sessionId: string) => {
    toast({
      title: "Editing session",
      description: `Editing session ${sessionId}...`,
    })
    // Implement actual edit logic here
  }, [toast])

  const handleCancelSession = React.useCallback((sessionId: string) => {
    toast({
      title: "Cancelling session",
      description: `Cancelling session ${sessionId}...`,
    })
    // Implement actual cancel logic here
  }, [toast])

  const handleConfirmSession = React.useCallback((sessionId: string) => {
    toast({
      title: "Confirming session",
      description: `Confirming session ${sessionId}...`,
    })
    // Implement actual confirm logic here
  }, [toast])

  const handleCheckIn = React.useCallback((reservationId: string) => {
    toast({
      title: "Checking in",
      description: `Checking in for reservation ${reservationId}...`,
    })
    // Implement actual check-in logic here
  }, [toast])

  const handleCancelReservation = React.useCallback((reservationId: string) => {
    toast({
      title: "Cancelling reservation",
      description: `Cancelling reservation ${reservationId}...`,
    })
    // Implement actual cancel logic here
  }, [toast])

  // Filter sessions for tabs
  const upcomingSessions = sessions.filter(
    (s) => isBefore(new Date(), s.date) && s.status !== "cancelled" && ["scheduled", "confirmed"].includes(s.status),
  )

  const pendingSessions = sessions.filter((s) => s.status === "pending")

  // Filter workspace reservations
  const confirmedReservations = workspaceReservations.filter(
    (r) => r.status === "confirmed" && isAfter(r.endDate, new Date()),
  )

  // Get the next session (closest upcoming)
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null
  const nextReservation = confirmedReservations.length > 0 ? confirmedReservations[0] : null

  // Calculate total upcoming items for badge
  const totalUpcoming = upcomingSessions.length + confirmedReservations.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Calendar className="h-5 w-5" />
          {totalUpcoming > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
              {totalUpcoming}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Your Schedule</p>
            <p className="text-xs text-muted-foreground">
              {nextSession
                ? `Next session: ${formatSessionDate(nextSession.date)}`
                : nextReservation
                  ? `Next workspace: ${formatSessionDate(nextReservation.startDate)}`
                  : "No upcoming bookings"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Tabs defaultValue="sessions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-2">
            <TabsList className="w-full">
              <TabsTrigger value="sessions" className="flex-1">
                Sessions
                {upcomingSessions.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {upcomingSessions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Pending
                {pendingSessions.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {pendingSessions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="workspaces" className="flex-1">
                Workspaces
                {confirmedReservations.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {confirmedReservations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Upcoming Sessions Tab */}
          <TabsContent value="sessions" className="max-h-[300px] overflow-y-auto focus:outline-none">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4">
                <CalendarDays className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">No upcoming sessions</p>
                <Button variant="outline" size="sm" className="mt-4">
                  {role === "client" ? "Book a Session" : "Create a Session"}
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingSessions.map((session) => (
                  <DropdownMenuItem key={session.id} asChild>
                    <div className="cursor-pointer p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.with.avatar || "/placeholder.svg"} alt={session.with.name} />
                            <AvatarFallback>{session.with.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{session.title}</h4>
                              <Badge
                                variant="outline"
                                className={cn("text-xs px-1.5 py-0", getStatusColor(session.status))}
                              >
                                {session.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <p className="text-xs text-gray-500">
                                {formatSessionDate(session.date)} ({session.duration} min)
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-gray-500">With {session.with.name}</span>
                            </div>
                            {session.workspace && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {session.workspace.name} ({session.workspace.location})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {isToday(session.date) && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleJoinSession(session.id)
                              }}
                            >
                              <Video className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditSession(session.id)
                            }}
                          >
                            <Edit3 className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelSession(session.id)
                            }}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Sessions Tab */}
          <TabsContent value="pending" className="max-h-[300px] overflow-y-auto focus:outline-none">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4">
                <Clock className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">No pending sessions</p>
              </div>
            ) : (
              <div className="space-y-1">
                {pendingSessions.map((session) => (
                  <DropdownMenuItem key={session.id} asChild>
                    <div className="cursor-pointer p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.with.avatar || "/placeholder.svg"} alt={session.with.name} />
                            <AvatarFallback>{session.with.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{session.title}</h4>
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-1.5 py-0"
                              >
                                pending
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <p className="text-xs text-gray-500">{formatSessionDate(session.date)}</p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-gray-500">
                                With {session.with.name} ({session.with.role})
                              </span>
                            </div>
                            {session.workspace && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {session.workspace.name} ({session.workspace.location})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleConfirmSession(session.id)
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelSession(session.id)
                            }}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Workspaces Tab */}
          <TabsContent value="workspaces" className="max-h-[300px] overflow-y-auto focus:outline-none">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : confirmedReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4">
                <MapPin className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">No workspace reservations</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Book a Workspace
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {confirmedReservations.map((reservation) => (
                  <DropdownMenuItem key={reservation.id} asChild>
                    <div className="cursor-pointer p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">{reservation.workspaceName}</h4>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200 text-xs px-1.5 py-0"
                            >
                              {reservation.isHost ? "hosting" : "attending"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-500">{reservation.location}</p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-500">
                              {formatSessionDate(reservation.startDate)} (
                              {formatTimeRange(reservation.startDate, reservation.endDate)})
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {reservation.currentAttendees} of {reservation.capacity} attendees
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {isToday(reservation.startDate) && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCheckIn(reservation.id)
                              }}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelReservation(reservation.id)
                            }}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant="ghost" className="w-full justify-between" asChild>
            <a href="/dashboard/calendar">
              View full calendar
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
