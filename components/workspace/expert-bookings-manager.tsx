"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ModifyBookingDialog } from "@/components/expert/modify-booking-dialog"
import { BookingConfirmationDialog } from "@/components/expert/booking-confirmation-dialog"
import { ResourceSummary } from "@/components/workspace/resource-summary"
import type { ResourceReservation } from "@/lib/types/resources"
import { calculateResourcesCost } from "@/lib/mock-resources-data"
import { OptimizedImage } from "@/components/ui/optimized-image"

// Mock data for expert's upcoming bookings
const initialBookings = [
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
    notes: "Need projector and video conferencing setup",
    resources: [
      { resourceId: "res-001", quantity: 1 },
      { resourceId: "res-002", quantity: 1 },
      { resourceId: "res-008", quantity: 6 },
    ] as ResourceReservation[],
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
    notes: "Bring whiteboard markers",
    resources: [
      { resourceId: "res-005", quantity: 2 },
      { resourceId: "res-011", quantity: 5 },
      { resourceId: "res-012", quantity: 2 },
    ] as ResourceReservation[],
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
    notes: "",
    resources: [] as ResourceReservation[],
  },
]

export function ExpertBookingsManager() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState(initialBookings)
  const [loading, setLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState<"cancel" | "modify" | null>(null)

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsModifyDialogOpen(true)
  }

  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking)
    setConfirmationAction("cancel")
    setIsConfirmationDialogOpen(true)
  }

  const confirmCancelBooking = async () => {
    if (!selectedBooking) return

    setLoading(true)
    setIsConfirmationDialogOpen(false)

    try {
      // Simulate API call to cancel booking
      // In a real app, this would be:
      // await api.delete(`/api/workspace-bookings/${selectedBooking.id}`)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id))

      toast({
        title: "Booking cancelled",
        description: `Your booking for ${selectedBooking.workspaceName} on ${format(parseISO(selectedBooking.date), "MMMM d, yyyy")} has been cancelled.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSelectedBooking(null)
    }
  }

  const handleSaveModifiedBooking = async (modifiedBooking: any) => {
    setLoading(true)
    setIsModifyDialogOpen(false)

    try {
      // Simulate API call to update booking
      // In a real app, this would be:
      // await api.put(`/api/workspace-bookings/${modifiedBooking.id}`, modifiedBooking)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setBookings(bookings.map((booking) => (booking.id === modifiedBooking.id ? modifiedBooking : booking)))

      toast({
        title: "Booking updated",
        description: `Your booking for ${modifiedBooking.workspaceName} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSelectedBooking(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, "MMMM d, yyyy")
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No Upcoming Bookings</h3>
        <p className="text-muted-foreground mb-4">You don't have any upcoming workspace bookings.</p>
        <Button>Book a Workspace</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const hasResources = booking.resources && booking.resources.length > 0
        const resourcesCost = hasResources ? calculateResourcesCost(booking.resources) : 0

        return (
          <Card key={booking.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="h-32 w-full sm:h-auto sm:w-40 bg-muted">
                <OptimizedImage
                  src={booking.image || "/abstract-geometric-shapes.png"}
                  alt={booking.workspaceName}
                  width={160}
                  height={128}
                  objectFit="cover"
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{booking.workspaceName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {booking.workspaceLocation}
                    </p>
                  </div>
                  <Badge variant="outline">{booking.workspaceType}</Badge>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center text-sm mb-1">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{booking.attendees} attendees</span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Purpose:</span> {booking.purpose}
                  </p>
                  {booking.notes && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
                  )}
                </div>

                {hasResources && (
                  <>
                    <Separator className="my-2" />
                    <div className="mb-2">
                      <div className="flex items-center text-sm mb-1">
                        <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Resources:</span>
                        {resourcesCost > 0 && (
                          <Badge variant="outline" className="ml-2">
                            ${resourcesCost.toFixed(2)}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm">
                        <ResourceSummary resources={booking.resources} showCost={false} />
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-auto flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleEditBooking(booking)}
                    disabled={loading}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleCancelBooking(booking)}
                    disabled={loading}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}

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
          action={confirmationAction || "cancel"}
          onConfirm={confirmCancelBooking}
        />
      )}
    </div>
  )
}
