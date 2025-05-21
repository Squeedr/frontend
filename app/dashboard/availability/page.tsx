"use client"

import { useState } from "react"
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Clock,
  CalendarIcon,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Calendar,
  CalendarDays,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, isSameDay, addMonths, isAfter, isBefore, getDay, addDays, isWithinInterval } from "date-fns"
import React from "react"

// Types for exceptions
type ExceptionType = "single" | "range" | "recurring"
type RecurrencePattern = "weekly" | "biweekly" | "monthly" | "custom"
type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

interface RecurringOptions {
  pattern: RecurrencePattern
  days: WeekDay[]
  endDate?: string // Optional end date for the recurrence
  interval?: number // For custom patterns (every X weeks/months)
  monthlyType?: "dayOfMonth" | "dayOfWeek" // For monthly recurrence
}

interface Exception {
  id: string
  type: ExceptionType
  startDate: string
  endDate: string
  reason: string
  status: "unavailable"
  isRecurring?: boolean
  recurringOptions?: RecurringOptions
}

// Mock data for availability slots
const mockAvailabilitySlots = [
  {
    id: "1",
    day: "Monday",
    startTime: "09:00",
    endTime: "12:00",
    isRecurring: true,
    notes: "Available for morning sessions only",
  },
  {
    id: "2",
    day: "Wednesday",
    startTime: "13:00",
    endTime: "17:00",
    isRecurring: true,
    notes: "",
  },
  {
    id: "3",
    day: "Friday",
    startTime: "10:00",
    endTime: "15:00",
    isRecurring: true,
    notes: "Prefer technical discussions",
  },
]

// Mock data for conflicts
const mockConflicts = [
  {
    id: "1",
    date: "2025-05-22",
    time: "10:00 - 11:00",
    type: "Double booking",
    sessions: [
      { id: "s1", title: "JavaScript Basics with John", client: "John Doe" },
      { id: "s2", title: "React Hooks Deep Dive", client: "Jane Smith" },
    ],
  },
  {
    id: "2",
    date: "2025-05-25",
    time: "14:00 - 15:00",
    type: "Overlapping sessions",
    sessions: [
      { id: "s3", title: "TypeScript Workshop", client: "Bob Johnson", time: "13:30 - 15:00" },
      { id: "s4", title: "Next.js Introduction", client: "Alice Brown", time: "14:00 - 16:00" },
    ],
  },
]

// Initial exceptions with recurring examples
const initialExceptions: Exception[] = [
  {
    id: "1",
    type: "single",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    reason: "Personal appointment",
    status: "unavailable",
  },
  {
    id: "2",
    type: "range",
    startDate: "2025-05-20",
    endDate: "2025-05-22",
    reason: "Conference attendance",
    status: "unavailable",
  },
  {
    id: "3",
    type: "recurring",
    startDate: "2025-05-01",
    endDate: "2025-08-31",
    reason: "Teaching commitment",
    status: "unavailable",
    isRecurring: true,
    recurringOptions: {
      pattern: "weekly",
      days: ["Monday"],
      endDate: "2025-08-31",
    },
  },
  {
    id: "4",
    type: "recurring",
    startDate: "2025-05-01",
    endDate: "2025-07-31",
    reason: "Biweekly team meeting",
    status: "unavailable",
    isRecurring: true,
    recurringOptions: {
      pattern: "biweekly",
      days: ["Friday"],
      endDate: "2025-07-31",
    },
  },
]

// Helper function to get day name from date
const getDayName = (date: Date): WeekDay => {
  const days: WeekDay[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as WeekDay[]
  return days[getDay(date)]
}

// Helper function to check if a date falls within a recurring pattern
const isDateInRecurringPattern = (date: Date, exception: Exception): boolean => {
  if (!exception.isRecurring || !exception.recurringOptions) return false

  const dayName = getDayName(date)
  const startDate = new Date(exception.startDate)
  const endDate = exception.recurringOptions.endDate
    ? new Date(exception.recurringOptions.endDate)
    : addMonths(new Date(), 12) // Default to 1 year if no end date

  // Check if date is within the recurrence period
  if (isBefore(date, startDate) || isAfter(date, endDate)) return false

  // Check if the day of the week matches
  if (!exception.recurringOptions.days.includes(dayName)) return false

  const { pattern, interval = 1 } = exception.recurringOptions

  switch (pattern) {
    case "weekly":
      return true // Already checked day of week
    case "biweekly": {
      // Calculate weeks since start date
      const diffTime = Math.abs(date.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const diffWeeks = Math.floor(diffDays / 7)
      return diffWeeks % 2 === 0
    }
    case "monthly": {
      // Check if it's the same day of the month
      return date.getDate() === startDate.getDate()
    }
    case "custom": {
      // For custom intervals (every X weeks)
      const diffTime = Math.abs(date.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const diffWeeks = Math.floor(diffDays / 7)
      return diffWeeks % interval === 0
    }
    default:
      return false
  }
}

export default function AvailabilityPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [availabilitySlots, setAvailabilitySlots] = useState(mockAvailabilitySlots)
  const [isAddingSlot, setIsAddingSlot] = useState(false)
  const [isAddingException, setIsAddingException] = useState(false)
  const [isEditingException, setIsEditingException] = useState(false)
  const [editingExceptionId, setEditingExceptionId] = useState<string | null>(null)
  const [newSlot, setNewSlot] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    isRecurring: true,
    notes: "",
  })

  // State for new exception with recurring options
  const [newException, setNewException] = useState<Omit<Exception, "id">>({
    type: "single",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    reason: "",
    status: "unavailable",
    isRecurring: false,
    recurringOptions: {
      pattern: "weekly",
      days: ["Monday"],
      endDate: format(addMonths(new Date(), 3), "yyyy-MM-dd"),
    },
  })

  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [exceptions, setExceptions] = useState<Exception[]>(initialExceptions)
  const [dateRange, setDateRange] = useState<Date[] | undefined>([new Date()])
  const [conflicts, setConflicts] = useState(mockConflicts)
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  // Calculate all exception dates for the calendar
  const exceptionDates = React.useMemo(() => {
    const dates: { date: Date; color?: string; className?: string }[] = []
    const currentMonth = new Date(calendarMonth)
    const startOfMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Add 6 days before and after to cover the full calendar view
    const calendarStartDate = addDays(startOfMonthDate, -6)
    const calendarEndDate = addDays(endOfMonthDate, 6)

    exceptions.forEach((exception) => {
      if (exception.type === "single") {
        // Single day exception
        const exceptionDate = new Date(exception.startDate)
        if (isWithinInterval(exceptionDate, { start: calendarStartDate, end: calendarEndDate })) {
          dates.push({
            date: exceptionDate,
            color: "ring-red-500",
            className: "text-red-500",
          })
        }
      } else if (exception.type === "range") {
        // Date range exception
        const start = new Date(exception.startDate)
        const end = new Date(exception.endDate)

        // Add all dates in the range that fall within the calendar view
        const current = new Date(start)
        while (current <= end) {
          if (isWithinInterval(current, { start: calendarStartDate, end: calendarEndDate })) {
            dates.push({
              date: new Date(current),
              color: "ring-red-500",
              className: "text-red-500",
            })
          }
          current.setDate(current.getDate() + 1)
        }
      } else if (exception.type === "recurring" && exception.isRecurring) {
        // Recurring exception
        // Check each day in the calendar view
        const current = new Date(calendarStartDate)
        while (current <= calendarEndDate) {
          if (isDateInRecurringPattern(current, exception)) {
            dates.push({
              date: new Date(current),
              color: "ring-purple-500",
              className: "text-purple-500",
            })
          }
          current.setDate(current.getDate() + 1)
        }
      }
    })

    return dates
  }, [exceptions, calendarMonth])

  // Create marked days for the calendar
  const markedDays = [
    ...exceptionDates,
    ...conflicts.map((conflict) => ({
      date: new Date(conflict.date),
      color: "ring-orange-500",
      className: "text-orange-500",
    })),
  ]

  const handleAddSlot = () => {
    const id = Math.random().toString(36).substring(7)
    setAvailabilitySlots([...availabilitySlots, { id, ...newSlot }])
    setIsAddingSlot(false)
    setNewSlot({
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
      isRecurring: true,
      notes: "",
    })
    toast({
      title: "Availability slot added",
      description: `Added ${newSlot.day} ${newSlot.startTime} - ${newSlot.endTime}`,
    })
  }

  const handleEditSlot = (id: string) => {
    const slot = availabilitySlots.find((slot) => slot.id === id)
    if (slot) {
      setNewSlot({
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring,
        notes: slot.notes,
      })
      setEditingSlot(id)
      setIsAddingSlot(true)
    }
  }

  const handleUpdateSlot = () => {
    if (editingSlot) {
      setAvailabilitySlots(
        availabilitySlots.map((slot) =>
          slot.id === editingSlot
            ? {
                ...slot,
                day: newSlot.day,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                isRecurring: newSlot.isRecurring,
                notes: newSlot.notes,
              }
            : slot,
        ),
      )
      setIsAddingSlot(false)
      setEditingSlot(null)
      setNewSlot({
        day: "Monday",
        startTime: "09:00",
        endTime: "10:00",
        isRecurring: true,
        notes: "",
      })
      toast({
        title: "Availability slot updated",
        description: `Updated ${newSlot.day} ${newSlot.startTime} - ${newSlot.endTime}`,
      })
    }
  }

  const handleDeleteSlot = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== id))
    toast({
      title: "Availability slot removed",
      description: "The availability slot has been removed from your schedule.",
    })
  }

  // Handle adding a new exception
  const handleAddException = () => {
    const id = Math.random().toString(36).substring(7)

    // Ensure startDate is before or equal to endDate for range exceptions
    let startDate = newException.startDate
    let endDate = newException.endDate

    if (newException.type === "range" && startDate > endDate) {
      ;[startDate, endDate] = [endDate, startDate]
    }

    const newExceptionWithId: Exception = {
      id,
      ...newException,
      startDate,
      endDate,
    }

    setExceptions([...exceptions, newExceptionWithId])
    setIsAddingException(false)

    // Reset the form
    setNewException({
      type: "single",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      reason: "",
      status: "unavailable",
      isRecurring: false,
      recurringOptions: {
        pattern: "weekly",
        days: ["Monday"],
        endDate: format(addMonths(new Date(), 3), "yyyy-MM-dd"),
      },
    })

    // Show appropriate toast message based on exception type
    let description = ""
    if (newExceptionWithId.type === "single") {
      description = `Added exception for ${format(new Date(startDate), "MMMM d, yyyy")}`
    } else if (newExceptionWithId.type === "range") {
      description = `Added exception from ${format(new Date(startDate), "MMMM d")} to ${format(new Date(endDate), "MMMM d, yyyy")}`
    } else if (newExceptionWithId.type === "recurring") {
      const pattern = newExceptionWithId.recurringOptions?.pattern || "weekly"
      const days = newExceptionWithId.recurringOptions?.days.join(", ") || ""
      description = `Added recurring exception (${pattern}) for ${days}`
    }

    toast({
      title: "Exception added",
      description,
    })
  }

  // Handle editing an exception
  const handleEditException = (id: string) => {
    const exception = exceptions.find((ex) => ex.id === id)
    if (exception) {
      setNewException({
        type: exception.type,
        startDate: exception.startDate,
        endDate: exception.endDate,
        reason: exception.reason,
        status: exception.status,
        isRecurring: exception.isRecurring || false,
        recurringOptions: exception.recurringOptions || {
          pattern: "weekly",
          days: ["Monday"],
          endDate: format(addMonths(new Date(), 3), "yyyy-MM-dd"),
        },
      })
      setEditingExceptionId(id)
      setIsEditingException(true)
      setIsAddingException(true)
    }
  }

  // Handle updating an exception
  const handleUpdateException = () => {
    if (editingExceptionId) {
      // Ensure startDate is before or equal to endDate for range exceptions
      let startDate = newException.startDate
      let endDate = newException.endDate

      if (newException.type === "range" && startDate > endDate) {
        ;[startDate, endDate] = [endDate, startDate]
      }

      setExceptions(
        exceptions.map((ex) =>
          ex.id === editingExceptionId
            ? {
                ...ex,
                ...newException,
                startDate,
                endDate,
              }
            : ex,
        ),
      )

      setIsAddingException(false)
      setIsEditingException(false)
      setEditingExceptionId(null)

      // Reset the form
      setNewException({
        type: "single",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
        reason: "",
        status: "unavailable",
        isRecurring: false,
        recurringOptions: {
          pattern: "weekly",
          days: ["Monday"],
          endDate: format(addMonths(new Date(), 3), "yyyy-MM-dd"),
        },
      })

      toast({
        title: "Exception updated",
        description: "The exception has been updated successfully.",
      })
    }
  }

  const handleDeleteException = (id: string) => {
    setExceptions(exceptions.filter((exception) => exception.id !== id))
    toast({
      title: "Exception removed",
      description: "The exception has been removed from your schedule.",
    })
  }

  const handleResolveConflict = (id: string, sessionId: string) => {
    // In a real app, this would handle the conflict resolution
    // For now, we'll just remove the conflict from the list
    setConflicts(conflicts.filter((conflict) => conflict.id !== id))
    toast({
      title: "Conflict resolved",
      description: "The scheduling conflict has been resolved.",
    })
  }

  // Handle date selection in the calendar
  const handleDateSelect = (selectedDate: Date | Date[] | null) => {
    if (selectedDate) {
      if (Array.isArray(selectedDate)) {
        setDateRange(selectedDate)

        if (selectedDate.length === 2) {
          // Auto-fill the exception form with the selected date range
          setNewException({
            ...newException,
            type: "range",
            startDate: format(selectedDate[0], "yyyy-MM-dd"),
            endDate: format(selectedDate[1], "yyyy-MM-dd"),
          })

          // Check if the selected date range overlaps with existing exceptions
          const hasOverlap = exceptions.some((ex) => {
            if (ex.type === "recurring") return false // Skip recurring exceptions for now

            const exStart = new Date(ex.startDate)
            const exEnd = new Date(ex.endDate)
            return (
              (selectedDate[0] <= exEnd && selectedDate[0] >= exStart) ||
              (selectedDate[1] <= exEnd && selectedDate[1] >= exStart) ||
              (selectedDate[0] <= exStart && selectedDate[1] >= exEnd)
            )
          })

          if (hasOverlap) {
            toast({
              title: "Date range overlaps",
              description: "The selected date range overlaps with existing exceptions.",
              variant: "destructive",
            })
          }
        }
      } else {
        setDate(selectedDate)

        // Auto-fill the exception form with the selected date
        setNewException({
          ...newException,
          type: "single",
          startDate: format(selectedDate, "yyyy-MM-dd"),
          endDate: format(selectedDate, "yyyy-MM-dd"),
        })

        // Check if the selected date has an exception
        const matchingExceptions = exceptions.filter((ex) => {
          if (ex.type === "single" || ex.type === "range") {
            const start = new Date(ex.startDate)
            const end = new Date(ex.endDate)
            const selected = new Date(selectedDate)
            return selected >= start && selected <= end
          } else if (ex.type === "recurring" && ex.isRecurring) {
            return isDateInRecurringPattern(selectedDate, ex)
          }
          return false
        })

        // Check if the selected date has a conflict
        const conflict = conflicts.find((conf) => isSameDay(new Date(conf.date), selectedDate))

        if (matchingExceptions.length > 0) {
          const exception = matchingExceptions[0]
          let dateDisplay = ""

          if (exception.type === "single" || exception.type === "range") {
            dateDisplay =
              exception.startDate === exception.endDate
                ? format(new Date(exception.startDate), "MMMM d, yyyy")
                : `${format(new Date(exception.startDate), "MMMM d")} - ${format(new Date(exception.endDate), "MMMM d, yyyy")}`
          } else if (exception.type === "recurring") {
            const pattern = exception.recurringOptions?.pattern || "weekly"
            const days = exception.recurringOptions?.days.join(", ") || ""
            dateDisplay = `${pattern} (${days})`
          }

          toast({
            title: "Exception day selected",
            description: `${exception.reason} (${dateDisplay})`,
          })
        } else if (conflict) {
          toast({
            title: "Conflict day selected",
            description: `${conflict.type} on ${format(new Date(conflict.date), "MMMM d, yyyy")}`,
          })
        }
      }
    }
  }

  // Handle month change in the calendar
  const handleMonthChange = (newMonth: Date) => {
    setCalendarMonth(newMonth)
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Availability</h1>
        <p className="text-muted-foreground mt-1">Manage your availability for sessions</p>
      </div>

      <Tabs defaultValue="recurring">
        <TabsList>
          <TabsTrigger value="recurring">Recurring Availability</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Weekly Schedule</h2>
            <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Availability
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSlot ? "Edit Availability" : "Add Availability"}</DialogTitle>
                  <DialogDescription>
                    Set your recurring availability for sessions. This will repeat weekly.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Day
                    </Label>
                    <select
                      id="day"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newSlot.day}
                      onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recurring" className="text-right">
                      Recurring
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="recurring"
                        checked={newSlot.isRecurring}
                        onCheckedChange={(checked) => setNewSlot({ ...newSlot, isRecurring: checked })}
                      />
                      <Label htmlFor="recurring">Repeat weekly</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information"
                      value={newSlot.notes}
                      onChange={(e) => setNewSlot({ ...newSlot, notes: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingSlot ? handleUpdateSlot : handleAddSlot}>
                    {editingSlot ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availabilitySlots.map((slot) => (
              <Card key={slot.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{slot.day}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditSlot(slot.id)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSlot(slot.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {slot.startTime} - {slot.endTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {slot.isRecurring && (
                    <Badge variant="outline" className="mb-2">
                      Recurring
                    </Badge>
                  )}
                  {slot.notes && <p className="text-sm text-muted-foreground">{slot.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add Exception</CardTitle>
                  <CardDescription>Mark dates when you're unavailable</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Exception form with type selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Exception Type</Label>
                      <div className="flex flex-col space-y-2">
                        <RadioGroup
                          value={newException.type}
                          onValueChange={(value) =>
                            setNewException({
                              ...newException,
                              type: value as ExceptionType,
                              isRecurring: value === "recurring",
                            })
                          }
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="single" />
                            <Label htmlFor="single" className="cursor-pointer">
                              Single Day
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="range" id="range" />
                            <Label htmlFor="range" className="cursor-pointer">
                              Date Range
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="recurring" id="recurring" />
                            <Label htmlFor="recurring" className="cursor-pointer">
                              Recurring Pattern
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Date selection based on exception type */}
                    {newException.type === "single" && (
                      <div className="space-y-2">
                        <Label htmlFor="exception-date">Date</Label>
                        <Input
                          id="exception-date"
                          type="date"
                          value={newException.startDate}
                          onChange={(e) =>
                            setNewException({
                              ...newException,
                              startDate: e.target.value,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {newException.type === "range" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="exception-start-date">Start Date</Label>
                          <Input
                            id="exception-start-date"
                            type="date"
                            value={newException.startDate}
                            onChange={(e) => setNewException({ ...newException, startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="exception-end-date">End Date</Label>
                          <Input
                            id="exception-end-date"
                            type="date"
                            value={newException.endDate}
                            onChange={(e) => setNewException({ ...newException, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {newException.type === "recurring" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="recurrence-pattern">Recurrence Pattern</Label>
                          <Select
                            value={newException.recurringOptions?.pattern}
                            onValueChange={(value) =>
                              setNewException({
                                ...newException,
                                recurringOptions: {
                                  ...newException.recurringOptions!,
                                  pattern: value as RecurrencePattern,
                                },
                              })
                            }
                          >
                            <SelectTrigger id="recurrence-pattern">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Biweekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Days of Week</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {days.map((day) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`day-${day}`}
                                  checked={newException.recurringOptions?.days.includes(day as WeekDay)}
                                  onCheckedChange={(checked) => {
                                    const currentDays = newException.recurringOptions?.days || []
                                    const newDays = checked
                                      ? [...currentDays, day as WeekDay]
                                      : currentDays.filter((d) => d !== day)

                                    setNewException({
                                      ...newException,
                                      recurringOptions: {
                                        ...newException.recurringOptions!,
                                        days: newDays,
                                      },
                                    })
                                  }}
                                />
                                <Label htmlFor={`day-${day}`} className="cursor-pointer">
                                  {day}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {newException.recurringOptions?.pattern === "custom" && (
                          <div className="space-y-2">
                            <Label htmlFor="interval">Repeat every</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                id="interval"
                                type="number"
                                min="1"
                                max="12"
                                value={newException.recurringOptions?.interval || 1}
                                onChange={(e) =>
                                  setNewException({
                                    ...newException,
                                    recurringOptions: {
                                      ...newException.recurringOptions!,
                                      interval: Number.parseInt(e.target.value) || 1,
                                    },
                                  })
                                }
                                className="w-20"
                              />
                              <span>weeks</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="recurrence-end-date">End Date</Label>
                          <Input
                            id="recurrence-end-date"
                            type="date"
                            value={newException.recurringOptions?.endDate || ""}
                            onChange={(e) =>
                              setNewException({
                                ...newException,
                                recurringOptions: {
                                  ...newException.recurringOptions!,
                                  endDate: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="exception-reason">Reason</Label>
                      <Textarea
                        id="exception-reason"
                        placeholder="Why you're unavailable"
                        value={newException.reason}
                        onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={isEditingException ? handleUpdateException : handleAddException}
                      disabled={
                        !newException.startDate ||
                        !newException.reason ||
                        (newException.type === "recurring" &&
                          (!newException.recurringOptions?.days.length || !newException.recurringOptions?.endDate))
                      }
                      className="w-full"
                    >
                      {isEditingException ? "Update Exception" : "Add Exception"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                  <CardDescription>View your exceptions on the calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Calendar with support for range selection */}
                  <EnhancedCalendar
                    mode={newException.type === "range" ? "range" : "single"}
                    selected={newException.type === "range" ? dateRange : date}
                    onSelect={handleDateSelect}
                    onMonthChange={handleMonthChange}
                    month={calendarMonth}
                    className="rounded-md border"
                    highlightToday={true}
                    markedDays={markedDays}
                    showMonthDropdown={true}
                    showYearDropdown={true}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                      <span className="text-xs">Single/Range Exception</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-purple-500 mr-1"></div>
                      <span className="text-xs">Recurring Exception</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-orange-500 mr-1"></div>
                      <span className="text-xs">Conflict</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6">Current Exceptions</h3>
          {exceptions.length === 0 ? (
            <p className="text-muted-foreground">No exceptions added yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Display exceptions with appropriate formatting based on type */}
              {exceptions.map((exception) => (
                <Card
                  key={exception.id}
                  className={exception.type === "recurring" ? "border-purple-200" : "border-red-200"}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        {exception.type === "single" ? (
                          new Date(exception.startDate).toLocaleDateString()
                        ) : exception.type === "range" ? (
                          <>
                            {format(new Date(exception.startDate), "MMM d")} -{" "}
                            {format(new Date(exception.endDate), "MMM d, yyyy")}
                          </>
                        ) : (
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            <span>
                              {exception.recurringOptions?.pattern === "weekly" && "Weekly"}
                              {exception.recurringOptions?.pattern === "biweekly" && "Biweekly"}
                              {exception.recurringOptions?.pattern === "monthly" && "Monthly"}
                              {exception.recurringOptions?.pattern === "custom" &&
                                `Every ${exception.recurringOptions?.interval} weeks`}
                            </span>
                          </div>
                        )}
                      </CardTitle>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditException(exception.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteException(exception.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      <Badge variant={exception.type === "recurring" ? "secondary" : "destructive"}>
                        {exception.type === "recurring" ? "Recurring" : "Unavailable"}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{exception.reason}</p>
                    {exception.type === "recurring" && (
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{exception.recurringOptions?.days.join(", ")}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            Until {format(new Date(exception.recurringOptions?.endDate || ""), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Scheduling Conflicts</h2>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>

          {conflicts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <Check className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold">No Conflicts</h3>
                  <p className="text-muted-foreground mt-2">
                    Your schedule is clear! There are no booking conflicts at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <Card key={conflict.id} className="border-red-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <CardTitle>{conflict.type}</CardTitle>
                        </div>
                        <CardDescription>
                          {new Date(conflict.date).toLocaleDateString()} • {conflict.time}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conflict.sessions.map((session) => (
                        <div key={session.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{session.title}</h4>
                              <p className="text-sm text-muted-foreground">Client: {session.client}</p>
                              {session.time && <p className="text-sm text-muted-foreground">Time: {session.time}</p>}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                                onClick={() => handleResolveConflict(conflict.id, session.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Keep
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                                onClick={() => handleResolveConflict(conflict.id, session.id)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="default" size="sm">
                        Auto-Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
