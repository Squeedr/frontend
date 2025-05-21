"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users, MoreHorizontal, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

interface Booking {
  id: string
  workspaceName: string
  workspaceLocation: string
  workspaceType: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendees: number
  image?: string
}

// Mock data for upcoming bookings
const mockUpcomingBookings: Booking[] = [
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
    image: "/modern-meeting-room.png",
  },
]

interface UpcomingBookingsProps {
  limit?: number
  showTitle?: boolean
  className?: string
}

export function UpcomingBookings({ limit = 3, showTitle = true, className = "" }: UpcomingBookingsProps) {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>(mockUpcomingBookings)
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const displayedBookings = bookings.slice(0, limit)

  const handleCancelBooking = () => {
    if (cancelBookingId) {
      // In a real app, this would be an API call
      setBookings(bookings.filter((booking) => booking.id !== cancelBookingId))

      toast({
        title: "Booking cancelled",
        description: "Your workspace booking has been cancelled successfully.",
      })

      setCancelBookingId(null)
      setIsDialogOpen(false)
    }
  }

  const openCancelDialog = (id: string) => {
    setCancelBookingId(id)
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy")
  }

  return (
    <div className={className}>
      {showTitle && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Upcoming Bookings</h3>
          {bookings.length > limit && (
            <Button variant="link" size="sm" className="px-0">
              View all
            </Button>
          )}
        </div>
      )}

      {displayedBookings.length > 0 ? (
        <div className="space-y-3">
          {displayedBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="h-24 w-full sm:h-auto sm:w-32 bg-muted">
                  <img
                    src={booking.image || "/abstract-geometric-shapes.png"}
                    alt={booking.workspaceName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-medium">{booking.workspaceName}</CardTitle>
                        <CardDescription className="flex items-center text-xs">
                          <MapPin className="mr-1 h-3 w-3" />
                          {booking.workspaceLocation}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{booking.workspaceType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(booking.date)}</span>
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
                  <div className="mt-auto flex justify-end p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit booking</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => openCancelDialog(booking.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">You don't have any upcoming bookings.</p>
            <Button variant="link" className="mt-2">
              Book a workspace
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this workspace booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
