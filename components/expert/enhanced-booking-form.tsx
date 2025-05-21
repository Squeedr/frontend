"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, Check, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingConfirmationDialog } from "@/components/expert/booking-confirmation-dialog"
import { WorkspaceAvailabilityCalendar } from "@/components/expert/workspace-availability-calendar"
import { WaitlistStatusIndicator } from "@/components/waitlist/waitlist-status-indicator"
import { ResourceSelection } from "@/components/workspace/resource-selection"
import { VisualSpaceSelector } from "@/components/workspace/visual-space-selector"
import { WorkspaceDetails } from "@/components/workspace/workspace-details"
import type { ResourceReservation } from "@/lib/types/resources"
import { calculateResourcesCost } from "@/lib/mock-resources-data"

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
  {
    id: "ws4",
    name: "Collaboration Space",
    location: "Floor 1, Central Area",
    type: "Collaboration Space",
    capacity: 8,
    amenities: ["Whiteboards", "Flexible Furniture", "TV Screen"],
  },
  {
    id: "ws5",
    name: "Meeting Room C",
    location: "Floor 2, East Wing",
    type: "Meeting Room",
    capacity: 4,
    amenities: ["TV Screen", "Whiteboard"],
  },
]

// Time slots in 30-minute increments
const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const formattedHour = hour.toString().padStart(2, "0")
  return `${formattedHour}:${minute}`
})

// Mock current user
const currentUser = {
  id: "u1",
  name: "Jane Smith",
  email: "jane@example.com",
  role: "expert",
}

// Mock function to check if a workspace is available
const isWorkspaceAvailable = (workspaceId: string, date: string, startTime: string, endTime: string): boolean => {
  // For demo purposes, let's say Conference Room A is unavailable on specific dates/times
  if (workspaceId === "ws1" && date === format(new Date(), "yyyy-MM-dd") && startTime === "10:00") {
    return false
  }
  return true
}

// Mock function to get waitlist count
const getWaitlistCount = (workspaceId: string, date: string): number => {
  // For demo purposes, return a random number between 0 and 5
  return Math.floor(Math.random() * 6)
}

// Mock function to check if user is already in waitlist
const isUserInWaitlist = (userId: string, workspaceId: string, date: string): boolean => {
  // For demo purposes, return false
  return false
}

export function EnhancedBookingForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingStep, setBookingStep] = useState<"space" | "details" | "resources">("space")

  // Form state
  const [purpose, setPurpose] = useState("")
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [workspace, setWorkspace] = useState("")
  const [attendees, setAttendees] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedResources, setSelectedResources] = useState<ResourceReservation[]>([])
  const [spaceSelectionTab, setSpaceSelectionTab] = useState<"visual" | "calendar">("visual")

  // Get selected workspace details
  const selectedWorkspace = mockWorkspaces.find((ws) => ws.id === workspace)

  // Check if the selected workspace is available
  const isAvailable =
    date && startTime && endTime && workspace
      ? isWorkspaceAvailable(workspace, format(date, "yyyy-MM-dd"), startTime, endTime)
      : true

  // Get waitlist count for the selected workspace and date
  const waitlistCount = date && workspace ? getWaitlistCount(workspace, format(date, "yyyy-MM-dd")) : 0

  // Check if the user is already in the waitlist
  const userWaitlisted =
    date && workspace ? isUserInWaitlist(currentUser.id, workspace, format(date, "yyyy-MM-dd")) : false

  // Calculate total cost of resources
  const resourcesCost = calculateResourcesCost(selectedResources)

  // Handle workspace selection
  const handleWorkspaceSelect = (workspaceId: string) => {
    setWorkspace(workspaceId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!purpose || !date || !startTime || !endTime || !workspace) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate that end time is after start time
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      })
      return
    }

    // Check availability
    if (!isAvailable) {
      toast({
        title: "Workspace unavailable",
        description:
          "This workspace is not available for the selected time. Please join the waitlist or choose another time.",
        variant: "destructive",
      })
      return
    }

    // Open confirmation dialog
    setIsConfirmationOpen(true)
  }

  const confirmBooking = async () => {
    setLoading(true)
    setIsConfirmationOpen(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      setBookingSuccess(true)
      toast({
        title: "Booking confirmed",
        description: `${selectedWorkspace?.name} has been booked for ${format(date!, "MMMM d, yyyy")} from ${startTime} to ${endTime}.`,
      })

      // Reset form after a delay
      setTimeout(() => {
        setPurpose("")
        setDate(undefined)
        setStartTime("")
        setEndTime("")
        setWorkspace("")
        setAttendees("")
        setNotes("")
        setSelectedResources([])
        setBookingSuccess(false)
        setBookingStep("space")
      }, 5000)
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error booking the workspace. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTimeSlotClick = (workspaceId: string, dateStr: string, time: string) => {
    setWorkspace(workspaceId)
    setDate(new Date(dateStr))
    setStartTime(time)

    // Calculate end time (1 hour after start time)
    const [hour, minute] = time.split(":").map(Number)
    const endHour = (hour + 1) % 24
    const formattedEndHour = endHour.toString().padStart(2, "0")
    setEndTime(`${formattedEndHour}:${minute.toString().padStart(2, "0")}`)
  }

  // Navigation between steps
  const goToNextStep = () => {
    if (bookingStep === "space") {
      if (!workspace || !date || !startTime || !endTime) {
        toast({
          title: "Missing information",
          description: "Please select a space, date, and time before proceeding.",
          variant: "destructive",
        })
        return
      }
      setBookingStep("details")
    } else if (bookingStep === "details") {
      if (!purpose) {
        toast({
          title: "Missing information",
          description: "Please enter a purpose for your booking.",
          variant: "destructive",
        })
        return
      }
      setBookingStep("resources")
    }
  }

  const goToPreviousStep = () => {
    if (bookingStep === "details") {
      setBookingStep("space")
    } else if (bookingStep === "resources") {
      setBookingStep("details")
    }
  }

  return (
    <div className="space-y-6">
      {bookingSuccess ? (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Booking Confirmed!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your booking for {selectedWorkspace?.name} on {format(date!, "MMMM d, yyyy")} from {startTime} to {endTime}{" "}
            has been confirmed. A confirmation email has been sent to your inbox.
            {selectedResources.length > 0 && resourcesCost > 0 && (
              <span className="block mt-1">Additional resources cost: ${resourcesCost.toFixed(2)}</span>
            )}
          </AlertDescription>
        </Alert>
      ) : null}

      {date && workspace && selectedWorkspace && !isAvailable ? (
        <WaitlistStatusIndicator
          workspace={selectedWorkspace}
          date={format(date, "yyyy-MM-dd")}
          startTime={startTime}
          endTime={endTime}
          waitlistCount={waitlistCount}
          isUserInWaitlist={userWaitlisted}
          currentUser={currentUser}
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Book a Workspace</CardTitle>
          <CardDescription>Select a space, provide details, and add resources for your booking.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          {/* Step indicator */}
          <div className="px-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    bookingStep === "space" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}
                >
                  1
                </div>
                <div className={`h-1 w-8 ${bookingStep !== "space" ? "bg-primary" : "bg-gray-200"}`}></div>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    bookingStep === "details"
                      ? "bg-primary text-primary-foreground"
                      : bookingStep === "resources"
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div className={`h-1 w-8 ${bookingStep === "resources" ? "bg-primary" : "bg-gray-200"}`}></div>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    bookingStep === "resources" ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {bookingStep === "space" && "Select Space"}
                {bookingStep === "details" && "Booking Details"}
                {bookingStep === "resources" && "Additional Resources"}
              </div>
            </div>
          </div>

          {/* Step 1: Space Selection */}
          {bookingStep === "space" && (
            <CardContent>
              <div className="space-y-6">
                <Tabs
                  defaultValue="visual"
                  value={spaceSelectionTab}
                  onValueChange={(v) => setSpaceSelectionTab(v as "visual" | "calendar")}
                >
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="visual">Visual Selection</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visual" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="required">
                            Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="date"
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startTime" className="required">
                              Start Time
                            </Label>
                            <Select value={startTime} onValueChange={setStartTime}>
                              <SelectTrigger id="startTime" className={!startTime ? "text-muted-foreground" : ""}>
                                <SelectValue placeholder="Select time">
                                  {startTime ? (
                                    <div className="flex items-center">
                                      <Clock className="mr-2 h-4 w-4" />
                                      {startTime}
                                    </div>
                                  ) : (
                                    "Select time"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endTime" className="required">
                              End Time
                            </Label>
                            <Select value={endTime} onValueChange={setEndTime}>
                              <SelectTrigger id="endTime" className={!endTime ? "text-muted-foreground" : ""}>
                                <SelectValue placeholder="Select time">
                                  {endTime ? (
                                    <div className="flex items-center">
                                      <Clock className="mr-2 h-4 w-4" />
                                      {endTime}
                                    </div>
                                  ) : (
                                    "Select time"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <VisualSpaceSelector
                          selectedDate={date}
                          startTime={startTime}
                          endTime={endTime}
                          selectedSpace={workspace}
                          onSpaceSelect={handleWorkspaceSelect}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="text-sm font-medium">Space Details</div>
                        <WorkspaceDetails workspaceId={workspace} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar">
                    <WorkspaceAvailabilityCalendar
                      initialWorkspaceId={workspace}
                      onTimeSlotClick={handleTimeSlotClick}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          )}

          {/* Step 2: Booking Details */}
          {bookingStep === "details" && (
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="required">
                    Purpose
                  </Label>
                  <Input
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Enter the purpose of booking"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendees">Number of Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    min="1"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="Enter number of attendees"
                  />
                  {selectedWorkspace && attendees && Number.parseInt(attendees) > selectedWorkspace.capacity && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Capacity Exceeded</AlertTitle>
                      <AlertDescription>
                        This workspace has a maximum capacity of {selectedWorkspace.capacity} people.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional requirements or notes"
                    rows={3}
                  />
                </div>

                <div className="bg-muted/50 rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Booking Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Space:</span>
                      <span className="font-medium">{selectedWorkspace?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{date ? format(date, "MMMM d, yyyy") : "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{startTime && endTime ? `${startTime} - ${endTime}` : "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {/* Step 3: Resource Selection */}
          {bookingStep === "resources" && (
            <CardContent>
              <ResourceSelection selectedResources={selectedResources} onChange={setSelectedResources} />
            </CardContent>
          )}

          <Separator className="my-4" />

          <CardFooter className="flex justify-between">
            {bookingStep !== "space" ? (
              <Button type="button" variant="outline" onClick={goToPreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout with justify-between
            )}

            {bookingStep !== "resources" ? (
              <Button type="button" onClick={goToNextStep}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book Workspace"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Booking Confirmation Dialog */}
      {date && selectedWorkspace && (
        <BookingConfirmationDialog
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          booking={{
            workspaceName: selectedWorkspace.name,
            workspaceLocation: selectedWorkspace.location,
            workspaceType: selectedWorkspace.type,
            date: format(date, "yyyy-MM-dd"),
            startTime,
            endTime,
            purpose,
            attendees: attendees ? Number.parseInt(attendees) : 1,
            resources: selectedResources,
          }}
          action="modify"
          onConfirm={confirmBooking}
        />
      )}
    </div>
  )
}
