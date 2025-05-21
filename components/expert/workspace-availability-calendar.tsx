"use client"

import React, { useState, useEffect } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, Clock, Users, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Generate dates relative to today to ensure they're valid
const today = new Date()
const tomorrow = addDays(today, 1)
const dayAfterTomorrow = addDays(today, 2)
const threeDaysFromNow = addDays(today, 3)
const fourDaysFromNow = addDays(today, 4)

// Mock data for workspace bookings with properly formatted dates
const mockWorkspaceBookings = [
  {
    id: "b1",
    workspaceId: "ws1",
    date: format(tomorrow, "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:30",
    bookedBy: "Jane Smith",
    purpose: "Client Meeting",
  },
  {
    id: "b2",
    workspaceId: "ws1",
    date: format(tomorrow, "yyyy-MM-dd"),
    startTime: "14:00",
    endTime: "16:00",
    bookedBy: "John Doe",
    purpose: "Team Brainstorming",
  },
  {
    id: "b3",
    workspaceId: "ws2",
    date: format(dayAfterTomorrow, "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:30",
    bookedBy: "Sarah Johnson",
    purpose: "Project Kickoff",
  },
  {
    id: "b4",
    workspaceId: "ws3",
    date: format(threeDaysFromNow, "yyyy-MM-dd"),
    startTime: "13:00",
    endTime: "15:00",
    bookedBy: "Michael Wilson",
    purpose: "Client Presentation",
  },
  {
    id: "b5",
    workspaceId: "ws1",
    date: format(fourDaysFromNow, "yyyy-MM-dd"),
    startTime: "11:00",
    endTime: "12:30",
    bookedBy: "David Lee",
    purpose: "Interview",
  },
]

// Mock data for workspaces
const mockWorkspaces = [
  {
    id: "ws1",
    name: "Conference Room A",
    location: "Floor 1, East Wing",
    type: "Conference Room",
    capacity: 12,
    amenities: ["Projector", "Video Conferencing", "Whiteboard"],
  },
  {
    id: "ws2",
    name: "Meeting Room B",
    location: "Floor 2, West Wing",
    type: "Meeting Room",
    capacity: 6,
    amenities: ["TV Screen", "Whiteboard"],
  },
  {
    id: "ws3",
    name: "Quiet Office",
    location: "Floor 3, North Wing",
    type: "Office",
    capacity: 2,
    amenities: ["Desk", "Phone"],
  },
]

// Time slots for the calendar
const timeSlots = Array.from({ length: 24 }).map((_, i) => {
  const hour = i.toString().padStart(2, "0")
  return `${hour}:00`
})

interface WorkspaceAvailabilityCalendarProps {
  initialWorkspaceId?: string
  onTimeSlotClick?: (workspaceId: string, date: string, startTime: string) => void
}

export function WorkspaceAvailabilityCalendar({
  initialWorkspaceId,
  onTimeSlotClick,
}: WorkspaceAvailabilityCalendarProps) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(initialWorkspaceId || "ws1")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekDays, setWeekDays] = useState<Date[]>([])

  // Get the selected workspace
  const selectedWorkspace = mockWorkspaces.find((ws) => ws.id === selectedWorkspaceId) || mockWorkspaces[0]

  // Get bookings for the selected workspace
  const workspaceBookings = mockWorkspaceBookings.filter((booking) => booking.workspaceId === selectedWorkspaceId)

  // Update week days when current date changes
  useEffect(() => {
    try {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start on Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 }) // End on Sunday
      const days = eachDayOfInterval({ start, end })
      setWeekDays(days)
    } catch (error) {
      console.error("Error calculating week days:", error)
      // Fallback to a safe default if there's an error
      const fallbackDays = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i))
      setWeekDays(fallbackDays)
    }
  }, [currentDate])

  // Navigate to previous week
  const goToPreviousWeek = () => {
    try {
      setCurrentDate((prev) => addDays(prev, -7))
    } catch (error) {
      console.error("Error navigating to previous week:", error)
    }
  }

  // Navigate to next week
  const goToNextWeek = () => {
    try {
      setCurrentDate((prev) => addDays(prev, 7))
    } catch (error) {
      console.error("Error navigating to next week:", error)
    }
  }

  // Check if a time slot is booked
  const isTimeSlotBooked = (date: Date, time: string) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      return workspaceBookings.some((booking) => {
        if (booking.date !== dateStr) return false

        const bookingStart = booking.startTime
        const bookingEnd = booking.endTime

        // Check if the time slot falls within a booking
        return time >= bookingStart && time < bookingEnd
      })
    } catch (error) {
      console.error("Error checking if time slot is booked:", error)
      return false
    }
  }

  // Get booking details for a time slot
  const getBookingDetails = (date: Date, time: string) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      return workspaceBookings.find((booking) => {
        if (booking.date !== dateStr) return false

        const bookingStart = booking.startTime
        const bookingEnd = booking.endTime

        // Check if the time slot falls within a booking
        return time >= bookingStart && time < bookingEnd
      })
    } catch (error) {
      console.error("Error getting booking details:", error)
      return null
    }
  }

  // Handle time slot click
  const handleTimeSlotClick = (date: Date, time: string) => {
    try {
      if (onTimeSlotClick && !isTimeSlotBooked(date, time)) {
        onTimeSlotClick(selectedWorkspaceId, format(date, "yyyy-MM-dd"), time)
      }
    } catch (error) {
      console.error("Error handling time slot click:", error)
    }
  }

  // Safe format function that won't throw errors
  const safeFormat = (date: Date, formatStr: string) => {
    try {
      return format(date, formatStr)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Workspace Availability</CardTitle>
            <CardDescription>Check availability and book time slots</CardDescription>
          </div>
          <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              {mockWorkspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {selectedWorkspace && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium">{selectedWorkspace.name}</h3>
              <Badge variant="outline">{selectedWorkspace.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{selectedWorkspace.location}</p>
            <div className="flex items-center text-sm">
              <Users className="mr-1 h-4 w-4" />
              <span>Capacity: {selectedWorkspace.capacity}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">More info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">Amenities:</p>
                      <ul className="text-xs">
                        {selectedWorkspace.amenities.map((amenity, index) => (
                          <li key={index}>• {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Week
          </Button>
          <h3 className="text-sm font-medium">
            {weekDays.length > 0 ? (
              <>
                {safeFormat(weekDays[0], "MMM d")} - {safeFormat(weekDays[weekDays.length - 1], "MMM d, yyyy")}
              </>
            ) : (
              "Loading..."
            )}
          </h3>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Next Week
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {weekDays.length > 0 ? (
          <div className="grid grid-cols-8 border rounded-lg overflow-hidden">
            {/* Time column */}
            <div className="col-span-1 bg-muted">
              <div className="h-10 border-b flex items-center justify-center font-medium text-xs">Time</div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-12 border-b flex items-center justify-center text-xs text-muted-foreground"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {time}
                </div>
              ))}
            </div>

            {/* Days columns */}
            <ScrollArea className="col-span-7">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-7">
                  {weekDays.map((day) => (
                    <div
                      key={day.toString()}
                      className={`h-10 border-b border-l flex items-center justify-center font-medium text-xs ${
                        isSameDay(day, new Date()) ? "bg-primary/10" : ""
                      }`}
                    >
                      {safeFormat(day, "EEE")}, {safeFormat(day, "MMM d")}
                    </div>
                  ))}

                  {timeSlots.map((time) => (
                    <React.Fragment key={time}>
                      {weekDays.map((day) => {
                        const isBooked = isTimeSlotBooked(day, time)
                        const bookingDetails = isBooked ? getBookingDetails(day, time) : null
                        const isFirstSlotOfBooking = bookingDetails && bookingDetails.startTime === time

                        return (
                          <div
                            key={`${day.toString()}-${time}`}
                            className={`h-12 border-b border-l relative ${
                              isSameDay(day, new Date()) ? "bg-primary/5" : ""
                            }`}
                            onClick={() => handleTimeSlotClick(day, time)}
                          >
                            {isBooked ? (
                              isFirstSlotOfBooking ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="absolute inset-0 m-1 rounded bg-primary/20 flex items-center justify-center text-xs cursor-default">
                                        <span className="truncate px-1">{bookingDetails?.purpose}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1">
                                        <p className="font-medium">{bookingDetails?.purpose}</p>
                                        <p className="text-xs">Booked by: {bookingDetails?.bookedBy}</p>
                                        <p className="text-xs">
                                          Time: {bookingDetails?.startTime} - {bookingDetails?.endTime}
                                        </p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : null
                            ) : (
                              <div className="absolute inset-0 m-1 rounded border border-dashed border-primary/20 flex items-center justify-center text-xs text-primary/40 cursor-pointer hover:bg-primary/5 hover:border-primary/40">
                                Available
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] border rounded-lg">
            <p>Loading calendar...</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-primary/20 mr-1"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded border border-dashed border-primary/20 mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-primary/5 mr-1"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
