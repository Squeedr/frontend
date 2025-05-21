"use client"

import { useState } from "react"
import { format, isAfter, isBefore, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Users, Edit, X, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { ModifyBookingDialog } from "@/components/expert/modify-booking-dialog"
import { BookingConfirmationDialog } from "@/components/expert/booking-confirmation-dialog"

// Mock data for expert bookings
const mockExpertBookings = [
  {
    id: "b1",
    workspaceName: "Conference Room A",
    workspaceLocation: "Floor 1, East Wing",
    workspaceType: "Conference Room",
    date: "2025-05-15",
    startTime: "10:00",
    endTime: "11:30",
    purpose: "Client Meeting",
    attendees: 6,
    status: "confirmed",
    image: "/modern-conference-room.png",
  },
  {
    id: "b2",
    workspaceName: "Collaboration Space",
    workspaceLocation: "Floor 1, Central Area",
    workspaceType: "Collaboration Space",
    date: "2025-05-16",
    startTime: "14:00",
    endTime: "16:00",
    purpose: "Team Brainstorming",
    attendees: 5,
    status: "confirmed",
    image: "/modern-collaboration-space.png",
  },
  {
    id: "b3",
    workspaceName: "Meeting Room B",
    workspaceLocation: "Floor 2, West Wing",
    workspaceType: "Meeting Room",
    date: "2025-05-18",
    startTime: "09:30",
    endTime: "10:30",
    purpose: "Weekly Standup",
    attendees: 4,
    status: "confirmed",
    image: "/modern-meeting-room.png",
  },
  {
    id: "b4",
    workspaceName: "Quiet Office",
    workspaceLocation: "Floor 3, North Wing",
    workspaceType: "Office",
    date: "2025-04-20",
    startTime: "13:00",
    endTime: "17:00",
    purpose: "Focus Work",
    attendees: 1,
    status: "completed",
    image: "/quiet-office.png",
  },
  {
    id: "b5",
    workspaceName: "Conference Room A",
    workspaceLocation: "Floor 1, East Wing",
    workspaceType: "Conference Room",
    date: "2025-04-10",
    startTime: "11:00",
    endTime: "12:30",
    purpose: "Client Presentation",
    attendees: 8,
    status: "completed",
    image: "/modern-conference-room.png",
  },
  {
    id: "b6",
    workspaceName: "Meeting Room B",
    workspaceLocation: "Floor 2, West Wing",
    workspaceType: "Meeting Room",
    date: "2025-04-05",
    startTime: "15:00",
    endTime: "16:00",
    purpose: "Interview",
    attendees: 3,
    status: "cancelled",
    image: "/modern-meeting-room.png",
  },
]

export function ExpertBookingsDashboard() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState(mockExpertBookings)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState<"cancel" | "modify" | null>(null)

  // Filter bookings based on search query and filters
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.workspaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.workspaceLocation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesType = typeFilter === "all" || booking.workspaceType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Separate bookings into upcoming and past
  const today = new Date()
  const upcomingBookings = filteredBookings.filter(
    (booking) => isAfter(parseISO(booking.date), today) && booking.status !== "cancelled",
  )
  const pastBookings = filteredBookings.filter(
    (booking) => isBefore(parseISO(booking.date), today) || booking.status === "cancelled",
  )

  const handleModifyBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsModifyDialogOpen(true)
  }

  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking)
    setConfirmationAction("cancel")
    setIsConfirmationDialogOpen(true)
  }

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      // In a real app, this would be an API call
      setBookings(
        bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, status: "cancelled" } : booking)),
      )

      toast({
        title: "Booking cancelled",
        description: `Your booking for ${selectedBooking.workspaceName} has been cancelled.`,
      })

      setIsConfirmationDialogOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleSaveModifiedBooking = (modifiedBooking: any) => {
    // In a real app, this would be an API call
    setBookings(bookings.map((booking) => (booking.id === modifiedBooking.id ? { ...modifiedBooking } : booking)))

    toast({
      title: "Booking updated",
      description: `Your booking for ${modifiedBooking.workspaceName} has been updated.`,
    })

    setIsModifyDialogOpen(false)
    setSelectedBooking(null)
  }

  return (
    <PermissionGuard allowedRoles={["owner", "expert"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Workspace Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage your workspace reservations</p>
          </div>
          <Button asChild>
            <a href="/dashboard/workspace/book-space">Book New Workspace</a>
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Conference Room">Conference Room</SelectItem>
                <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Collaboration Space">Collaboration Space</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.workspaceName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{booking.workspaceName}</CardTitle>
                        <Badge variant="outline">{booking.workspaceType}</Badge>
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <MapPin className="mr-1 h-3 w-3" />
                        {booking.workspaceLocation}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(parseISO(booking.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{booking.attendees} attendees</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Purpose:</span> {booking.purpose}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleModifyBooking(booking)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modify
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">You don't have any upcoming bookings.</p>
                  <Button variant="link" asChild className="mt-2">
                    <a href="/dashboard/workspace/book-space">Book a workspace</a>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className={`overflow-hidden ${booking.status === "cancelled" ? "opacity-75" : ""}`}
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.workspaceName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{booking.workspaceName}</CardTitle>
                        <Badge variant={booking.status === "cancelled" ? "destructive" : "outline"}>
                          {booking.status === "cancelled" ? "Cancelled" : booking.workspaceType}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <MapPin className="mr-1 h-3 w-3" />
                        {booking.workspaceLocation}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(parseISO(booking.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{booking.attendees} attendees</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Purpose:</span> {booking.purpose}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/dashboard/workspace/book-space">Book Again</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">You don't have any past bookings.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modify Booking Dialog */}
      {selectedBooking && (
        <ModifyBookingDialog
          isOpen={isModifyDialogOpen}
          onClose={() => setIsModifyDialogOpen(false)}
          booking={selectedBooking}
          onSave={handleSaveModifiedBooking}
        />
      )}

      {/* Confirmation Dialog */}
      {selectedBooking && (
        <BookingConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          onClose={() => setIsConfirmationDialogOpen(false)}
          booking={selectedBooking}
          action={confirmationAction}
          onConfirm={confirmCancelBooking}
        />
      )}
    </PermissionGuard>
  )
}
