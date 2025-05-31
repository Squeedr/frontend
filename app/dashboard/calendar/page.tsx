"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Download, Plus, Settings, CalendarIcon } from "lucide-react"
import { format, startOfDay, endOfDay, parseISO, isSameDay } from "date-fns"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { calendarEvents as initialRealEvents } from "@/lib/mock-data"
import { mockCalendarEvents } from "@/lib/mock-calendar-data"
import { workspaces } from "@/lib/mock-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DragAndDropProvider } from "@/components/drag-and-drop-provider"
import { DraggableEvent, type CalendarEvent } from "@/components/draggable-event"
import { DroppableTimeSlot } from "@/components/droppable-time-slot"
import { rescheduleEvent } from "@/lib/calendar-utils"
import { useToast } from "@/hooks/use-toast"
import { CreateEventModal } from "@/components/create-event-modal"
import { AvailabilityManagementDialog } from "@/components/availability-management-dialog"
import CalendarTabs from "@/components/calendar-tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Helper function to get days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get the first day of the month
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

// Helper function to format date range
const formatDateRange = (startDate: Date, endDate: Date) => {
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }
  return `${startDate.toLocaleDateString("en-US", options).replace(",", "")} - ${endDate.toLocaleDateString("en-US", options)}`
}

// Helper function to get week dates
const getWeekDates = (date: Date) => {
  const day = date.getDay() // 0 = Sunday, 6 = Saturday
  const diff = date.getDate() - day

  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(date)
    newDate.setDate(diff + i)
    weekDates.push(newDate)
  }

  return weekDates
}

// Helper function to format time
const formatTime = (hour: number, minute = 0, use24Hour = false) => {
  if (use24Hour) {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  }

  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
}

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default function CalendarPage() {
  const { toast } = useToast()
  const dayViewRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [useMockData, setUseMockData] = useState(true)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<"day" | "week" | "month">("day") // Default to day view
  const [workspace, setWorkspace] = useState("all")
  const [showWeekends, setShowWeekends] = useState(true)
  const [use24HourFormat, setUse24HourFormat] = useState(false)
  const [showDeclinedEvents, setShowDeclinedEvents] = useState(true)
  const [dayViewStartHour, setDayViewStartHour] = useState(6) // Start at 6 AM
  const [dayViewEndHour, setDayViewEndHour] = useState(20) // End at 8 PM
  const [showAllHours, setShowAllHours] = useState(false)

  // State for create/edit event modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null)
  const [createEventDate, setCreateEventDate] = useState<Date>(new Date())
  const [createEventHour, setCreateEventHour] = useState<number | undefined>(undefined)

  // State for availability management dialog
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false)
  const [availabilityInitialTab, setAvailabilityInitialTab] = useState("recurring")

  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)

  // Initialize calendar events based on mock data toggle
  useEffect(() => {
    const events = useMockData ? mockCalendarEvents : initialRealEvents
    setCalendarEvents(events)
    setFilteredEvents(events)
  }, [useMockData])

  // Scroll to current time in day view
  useEffect(() => {
    if (view === "day" && dayViewRef.current) {
      const now = new Date()
      const currentHour = now.getHours()

      // Only scroll if current time is within the visible range
      if (currentHour >= dayViewStartHour && currentHour <= dayViewEndHour) {
        const hourHeight = 64 // Height of each hour cell in pixels
        const scrollPosition = (currentHour - dayViewStartHour) * hourHeight
        dayViewRef.current.scrollTop = scrollPosition
      }
    }
  }, [view, dayViewStartHour, dayViewEndHour])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const weekDates = getWeekDates(currentDate)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const visibleDayNames = showWeekends ? dayNames : dayNames.slice(1, 6)

  // Calculate date range for display
  const dateRangeText =
    view === "month"
      ? `${monthNames[month]} ${year}`
      : view === "week"
        ? formatDateRange(weekDates[0], weekDates[6])
        : format(currentDate, "EEEE, MMMM d, yyyy")

  const handlePrev = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleFilter = (workspaceValue: string) => {
    setWorkspace(workspaceValue)

    if (workspaceValue === "all") {
      setFilteredEvents(calendarEvents)
      return
    }

    const filtered = calendarEvents.filter((event) => {
      return event.workspace === workspaceValue
    })

    setFilteredEvents(filtered)
  }

  const handleExport = (format: "csv" | "ics") => {
    // Dummy export logic
    toast({
      title: "Calendar exported",
      description: `Your calendar has been exported as ${format.toUpperCase()}`,
    })
  }

  // Toggle mock data
  const handleToggleMockData = () => {
    setUseMockData((prev) => !prev)
    toast({
      title: `Mock data ${!useMockData ? "enabled" : "disabled"}`,
      description: `Using ${!useMockData ? "comprehensive mock data" : "basic data"} for calendar events.`,
    })
  }

  // Toggle showing all hours in day view
  const handleToggleAllHours = () => {
    if (showAllHours) {
      setDayViewStartHour(6)
      setDayViewEndHour(20)
    } else {
      setDayViewStartHour(0)
      setDayViewEndHour(23)
    }
    setShowAllHours(!showAllHours)
  }

  // Handle event drop
  const handleEventDrop = (event: CalendarEvent, date: Date, hour?: number) => {
    const updatedEvents = rescheduleEvent(event, date, hour, calendarEvents)
    setCalendarEvents(updatedEvents)

    // Update filtered events as well
    if (workspace === "all") {
      setFilteredEvents(updatedEvents)
    } else {
      setFilteredEvents(updatedEvents.filter((e) => e.workspace === workspace))
    }

    // Show success toast
    toast({
      title: "Event rescheduled",
      description: `"${event.title}" has been moved to ${format(date, "EEEE, MMMM d")} ${hour !== undefined ? `at ${formatTime(hour, 0, use24HourFormat)}` : ""}`,
    })
  }

  // Handle opening the create event modal
  const handleOpenCreateModal = (date?: Date, hour?: number) => {
    setIsEditMode(false)
    setCurrentEvent(null)
    setCreateEventDate(date || currentDate)
    setCreateEventHour(hour)
    setIsCreateModalOpen(true)
  }

  // Handle opening the availability management dialog
  const handleOpenAvailabilityDialog = (tab = "recurring") => {
    setAvailabilityInitialTab(tab)
    setIsAvailabilityDialogOpen(true)
  }

  // Handle editing an event
  const handleEditEvent = (event: CalendarEvent) => {
    setIsEditMode(true)
    setCurrentEvent(event)
    setCreateEventDate(parseISO(event.start))
    setCreateEventHour(parseISO(event.start).getHours())
    setIsCreateModalOpen(true)
  }

  // Handle deleting an event
  const handleDeleteEvent = (event: CalendarEvent) => {
    setEventToDelete(event)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete event
  const confirmDeleteEvent = () => {
    if (!eventToDelete) return

    const updatedEvents = calendarEvents.filter((event) => event.id !== eventToDelete.id)
    setCalendarEvents(updatedEvents)

    // Update filtered events as well
    if (workspace === "all") {
      setFilteredEvents(updatedEvents)
    } else {
      setFilteredEvents(updatedEvents.filter((e) => e.workspace === workspace))
    }

    toast({
      title: "Event deleted",
      description: `"${eventToDelete.title}" has been removed from your calendar.`,
    })

    setIsDeleteDialogOpen(false)
    setEventToDelete(null)
  }

  // Handle creating or updating an event
  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (isEditMode && currentEvent) {
      // Update existing event
      const updatedEvent = {
        ...eventData,
        id: currentEvent.id,
      }

      const updatedEvents = calendarEvents.map((event) => (event.id === currentEvent.id ? updatedEvent : event))

      setCalendarEvents(updatedEvents)

      // Update filtered events as well
      if (workspace === "all") {
        setFilteredEvents(updatedEvents)
      } else {
        setFilteredEvents(updatedEvents.filter((e) => e.workspace === workspace))
      }

      toast({
        title: "Event updated",
        description: `"${updatedEvent.title}" has been updated in your calendar.`,
      })
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: generateId(),
        ...eventData,
      }

      const updatedEvents = [...calendarEvents, newEvent]
      setCalendarEvents(updatedEvents)

      // Update filtered events as well
      if (workspace === "all" || workspace === newEvent.workspace) {
        setFilteredEvents([...filteredEvents, newEvent])
      }

      toast({
        title: "Event created",
        description: `"${newEvent.title}" has been added to your calendar.`,
      })
    }
  }

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const startOfDayDate = startOfDay(date)
    const endOfDayDate = endOfDay(date)

    return filteredEvents.filter((event) => {
      const eventStart = parseISO(event.start)
      const eventEnd = parseISO(event.end)

      // Event starts, ends, or spans this day
      return (
        (eventStart >= startOfDayDate && eventStart <= endOfDayDate) || // Starts on this day
        (eventEnd >= startOfDayDate && eventEnd <= endOfDayDate) || // Ends on this day
        (eventStart <= startOfDayDate && eventEnd >= endOfDayDate) // Spans this day
      )
    })
  }

  // Get events for a specific hour on a specific day
  const getEventsForHour = (date: Date, hour: number) => {
    const events = getEventsForDay(date)
    const hourStart = new Date(date)
    hourStart.setHours(hour, 0, 0, 0)

    const hourEnd = new Date(date)
    hourEnd.setHours(hour, 59, 59, 999)

    return events.filter((event) => {
      const eventStart = parseISO(event.start)
      const eventEnd = parseISO(event.end)

      // Event starts, ends, or spans this hour
      return (
        (eventStart >= hourStart && eventStart <= hourEnd) || // Starts in this hour
        (eventEnd >= hourStart && eventEnd <= hourEnd) || // Ends in this hour
        (eventStart <= hourStart && eventEnd >= hourEnd) // Spans this hour
      )
    })
  }

  // Render month view calendar grid
  const renderMonthView = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 p-1"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const events = getEventsForDay(date)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isToday = isSameDay(date, new Date())

      // Skip weekends if they're hidden
      if (!showWeekends && isWeekend) continue

      days.push(
        <DroppableTimeSlot
          key={day}
          date={date}
          onDrop={handleEventDrop}
          className={cn(
            "h-24 border border-gray-200 p-1 overflow-hidden",
            isWeekend && "bg-gray-50",
            isToday && "bg-blue-50",
          )}
          onDoubleClick={() => handleOpenCreateModal(date)}
        >
          <div className={cn("font-medium text-sm mb-1", isToday && "text-blue-600")}>{day}</div>
          <div className="space-y-1">
            {events.slice(0, 3).map((event, index) => (
              <DraggableEvent
                key={index}
                event={event}
                onDrop={handleEventDrop}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                isCompact={true}
                className="truncate"
              />
            ))}
            {events.length > 3 && (
              <div
                className="text-xs text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => {
                  setCurrentDate(date)
                  setView("day")
                }}
              >
                +{events.length - 3} more
              </div>
            )}
          </div>
        </DroppableTimeSlot>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={cn(
              "h-10 flex items-center justify-center font-medium",
              (index === 0 || index === 6) && "bg-gray-50",
            )}
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  // Render week view calendar grid
  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const visibleWeekDates = showWeekends
      ? weekDates
      : weekDates.filter((date) => date.getDay() !== 0 && date.getDay() !== 6)

    return (
      <div className="flex flex-col">
        {/* Header row with days */}
        <div className={`grid ${showWeekends ? "grid-cols-8" : "grid-cols-6"} border-b`}>
          <div className="border-r p-2"></div> {/* Empty cell for time column */}
          {visibleWeekDates.map((date, index) => {
            const isToday = isSameDay(date, new Date())

            return (
              <div
                key={index}
                className={cn(
                  "border-r p-2 text-center",
                  (date.getDay() === 0 || date.getDay() === 6) && "bg-gray-50",
                  isToday && "bg-blue-50",
                )}
              >
                <div className="text-sm text-gray-500">{dayNames[date.getDay()]}</div>
                <div className={cn("font-medium", isToday && "text-blue-600")}>{date.getDate()}</div>
              </div>
            )
          })}
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-auto">
          <div className={`grid ${showWeekends ? "grid-cols-8" : "grid-cols-6"}`}>
            {/* Time column */}
            <div className="col-span-1">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b border-r p-1 text-xs text-gray-500">
                  {use24HourFormat ? `${hour}:00` : formatTime(hour, 0, use24HourFormat)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {visibleWeekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="col-span-1">
                {hours.map((hour) => {
                  const events = getEventsForHour(date, hour)
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6
                  const isToday = isSameDay(date, new Date())
                  const isCurrentHour = isToday && new Date().getHours() === hour

                  return (
                    <DroppableTimeSlot
                      key={hour}
                      date={date}
                      hour={hour}
                      onDrop={handleEventDrop}
                      className={cn(
                        "h-16 border-b border-r p-1 relative",
                        isWeekend && "bg-gray-50",
                        isToday && "bg-blue-50/30",
                        isCurrentHour && "bg-blue-100/50",
                      )}
                      onDoubleClick={() => handleOpenCreateModal(date, hour)}
                    >
                      {events.map((event, eventIndex) => (
                        <DraggableEvent
                          key={eventIndex}
                          event={event}
                          onDrop={handleEventDrop}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                          className="absolute inset-x-1"
                          style={{
                            top: "2px",
                            height: "calc(100% - 4px)",
                            zIndex: eventIndex + 1,
                          }}
                        />
                      ))}
                    </DroppableTimeSlot>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render enhanced day view calendar grid
  const renderDayView = () => {
    // Generate array of hours to display based on settings
    const visibleHours = showAllHours
      ? Array.from({ length: 24 }, (_, i) => i)
      : Array.from({ length: dayViewEndHour - dayViewStartHour + 1 }, (_, i) => i + dayViewStartHour)

    // Get all events for the current day
    const dayEvents = getEventsForDay(currentDate)
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
    const now = new Date()
    const isToday = isSameDay(currentDate, now)
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    return (
      <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
        {/* Header with current day */}
        <div className="grid grid-cols-[100px_1fr] border-b">
          <div className="border-r p-2 bg-gray-50 flex items-center justify-center">
            <span className="text-sm font-medium">Time</span>
          </div>
          <div
            className={cn(
              "p-3 flex flex-col items-center justify-center",
              isWeekend && "bg-gray-50",
              isToday && "bg-blue-50",
            )}
          >
            <div className="text-sm text-gray-500">{format(currentDate, "EEEE")}</div>
            <div className={cn("text-xl font-bold", isToday && "text-blue-600")}>
              {format(currentDate, "MMMM d, yyyy")}
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-auto" ref={dayViewRef}>
          <div className="grid grid-cols-[100px_1fr] relative">
            {/* Time column */}
            <div className="col-span-1 relative z-10">
              {visibleHours.map((hour) => (
                <div key={hour} className="h-16 border-b border-r p-1 text-xs text-gray-500 bg-gray-50 sticky left-0">
                  {use24HourFormat ? `${hour}:00` : formatTime(hour, 0, use24HourFormat)}
                </div>
              ))}
            </div>

            {/* Day column with time indicators */}
            <div className="col-span-1 relative">
              {/* Current time indicator */}
              {isToday && (
                <div
                  className="absolute left-0 right-0 border-t-2 border-red-500 z-20 flex items-center"
                  style={{
                    top: `${((currentHour - dayViewStartHour) * 60 + currentMinute) * (64 / 60)}px`,
                    display: currentHour >= dayViewStartHour && currentHour <= dayViewEndHour ? "flex" : "none",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                  <span className="text-xs text-red-500 ml-1">
                    {formatTime(currentHour, currentMinute, use24HourFormat)}
                  </span>
                </div>
              )}

              {/* Hour cells */}
              {visibleHours.map((hour) => {
                const isCurrentHour = isToday && currentHour === hour

                return (
                  <DroppableTimeSlot
                    key={hour}
                    date={currentDate}
                    hour={hour}
                    onDrop={handleEventDrop}
                    className={cn(
                      "h-16 border-b border-r p-1 relative",
                      isWeekend && "bg-gray-50/50",
                      isToday && "bg-blue-50/30",
                      isCurrentHour && "bg-blue-100/50",
                    )}
                    onDoubleClick={() => handleOpenCreateModal(currentDate, hour)}
                  >
                    {/* 15-minute grid lines */}
                    <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-gray-100"></div>
                    <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-gray-100"></div>
                    <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-gray-100"></div>
                  </DroppableTimeSlot>
                )
              })}

              {/* Positioned events */}
              {dayEvents.map((event, index) => {
                const eventStart = parseISO(event.start)
                const eventEnd = parseISO(event.end)

                // Skip events outside visible hours
                if (eventEnd.getHours() < dayViewStartHour || eventStart.getHours() > dayViewEndHour) {
                  return null
                }

                // Calculate position
                const startHour = Math.max(eventStart.getHours(), dayViewStartHour)
                const startMinute = eventStart.getHours() < dayViewStartHour ? 0 : eventStart.getMinutes()

                const endHour = Math.min(eventEnd.getHours(), dayViewEndHour)
                const endMinute = eventEnd.getHours() > dayViewEndHour ? 0 : eventEnd.getMinutes()

                const startPosition = (startHour - dayViewStartHour) * 64 + (startMinute / 60) * 64
                const endPosition = (endHour - dayViewStartHour) * 64 + (endMinute / 60) * 64
                const eventHeight = Math.max(endPosition - startPosition, 24) // Minimum height

                return (
                  <DraggableEvent
                    key={event.id}
                    event={event}
                    onDrop={handleEventDrop}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    isDayView={true}
                    startHour={dayViewStartHour}
                    endHour={dayViewEndHour}
                    className="absolute left-1 right-1 z-10"
                    style={{
                      top: `${startPosition}px`,
                      height: `${eventHeight}px`,
                      width: `calc(100% - 8px)`,
                      zIndex: 10 + index,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render integration tab content
  const renderIntegrationTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Calendar Integration</h3>
            <p className="text-gray-500 mb-6">Connect your external calendars to sync your sessions automatically.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V8H20V19ZM9 10H7V12H9V10ZM13 10H11V12H13V10ZM17 10H15V12H17V10ZM9 14H7V16H9V14ZM13 14H11V16H13V14ZM17 14H15V16H17V14Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Google Calendar</h4>
                    <p className="text-sm text-gray-500">Sync with your Google Calendar</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Microsoft Outlook</h4>
                    <p className="text-sm text-gray-500">Sync with your Outlook Calendar</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 2 12ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Apple Calendar</h4>
                    <p className="text-sm text-gray-500">Sync with your Apple Calendar</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DragAndDropProvider>
      <div className="space-y-4">
        {/* Header Area */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2" onClick={() => handleOpenAvailabilityDialog()}>
                    <CalendarIcon className="h-4 w-4" />
                    Manage Availability
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleOpenAvailabilityDialog("recurring")}>
                    Recurring Availability
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenAvailabilityDialog("exceptions")}>
                    Manage Exceptions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Calendar Settings</h4>
                      <p className="text-sm text-muted-foreground">Configure your calendar preferences</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-weekends">Show weekends</Label>
                        <Switch id="show-weekends" checked={showWeekends} onCheckedChange={setShowWeekends} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="24h-format">Use 24-hour format</Label>
                        <Switch id="24h-format" checked={use24HourFormat} onCheckedChange={setUse24HourFormat} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-declined">Show declined events</Label>
                        <Switch
                          id="show-declined"
                          checked={showDeclinedEvents}
                          onCheckedChange={setShowDeclinedEvents}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-all-hours">Show all hours</Label>
                        <Switch id="show-all-hours" checked={showAllHours} onCheckedChange={handleToggleAllHours} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="use-mock-data">Use comprehensive mock data</Label>
                        <Switch id="use-mock-data" checked={useMockData} onCheckedChange={handleToggleMockData} />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <p className="text-gray-500">Manage your schedule and availability</p>
        </div>

        {/* Sub-Tabs */}
        <CalendarTabs defaultValue="calendar" onValueChange={setActiveTab}>
          <TabsContent value="calendar" className="space-y-4 mt-4">
            {/* View Controls & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{dateRangeText}</h2>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("ics")}>Export as ICS</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Select value={workspace} onValueChange={handleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Workspaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workspaces</SelectItem>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.name}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex rounded-md border">
                  <Button
                    variant={view === "day" ? "default" : "ghost"}
                    className="rounded-l-md rounded-r-none border-r"
                    onClick={() => setView("day")}
                  >
                    Day
                  </Button>
                  <Button
                    variant={view === "week" ? "default" : "ghost"}
                    className="rounded-none border-r"
                    onClick={() => setView("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={view === "month" ? "default" : "ghost"}
                    className="rounded-r-md rounded-l-none"
                    onClick={() => setView("month")}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border rounded-md overflow-hidden">
              {view === "month" && renderMonthView()}
              {view === "week" && renderWeekView()}
              {view === "day" && renderDayView()}
            </div>
          </TabsContent>

          <TabsContent value="integration" className="mt-4">
            {renderIntegrationTab()}
          </TabsContent>
        </CalendarTabs>

        {/* Create/Edit Event Modal */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateEvent={handleSaveEvent}
          initialDate={createEventDate}
          initialHour={createEventHour}
          isEditMode={isEditMode}
          eventToEdit={currentEvent}
        />

        {/* Availability Management Dialog */}
        <AvailabilityManagementDialog
          isOpen={isAvailabilityDialogOpen}
          onClose={() => setIsAvailabilityDialogOpen(false)}
          selectedDate={currentDate}
          initialTab={availabilityInitialTab}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteEvent} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DragAndDropProvider>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
