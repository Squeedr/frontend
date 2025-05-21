"use client"

import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ResourceSummary } from "@/components/workspace/resource-summary"
import type { ResourceReservation } from "@/lib/types/resources"

interface BookingDetails {
  workspaceName: string
  workspaceLocation: string
  workspaceType: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendees: number
  notes?: string
  resources?: ResourceReservation[]
}

interface BookingConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingDetails
  action: "cancel" | "modify"
  onConfirm: () => void
}

export function BookingConfirmationDialog({
  isOpen,
  onClose,
  booking,
  action,
  onConfirm,
}: BookingConfirmationDialogProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "MMMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  const isCancel = action === "cancel"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isCancel ? "Cancel Booking" : "Confirm Booking"}</DialogTitle>
          <DialogDescription>
            {isCancel
              ? "Are you sure you want to cancel this booking? This action cannot be undone."
              : "Please review your booking details before confirming."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-medium">{booking.workspaceName}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="mr-1 h-3 w-3" />
              {booking.workspaceLocation}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <div>
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

          {booking.resources && booking.resources.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Additional Resources:</h4>
                <ResourceSummary resources={booking.resources} />
              </div>
            </>
          )}

          {isCancel && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-destructive">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium">Warning</h4>
                <p className="text-sm">
                  Cancelling this booking will remove it from your schedule and make the workspace available for others.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button variant={isCancel ? "destructive" : "default"} onClick={onConfirm}>
            {isCancel ? "Cancel Booking" : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
