"use client"

import type React from "react"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ResourceSelection } from "@/components/workspace/resource-selection"
import type { ResourceReservation } from "@/lib/types/resources"

// Time slots in 30-minute increments
const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const formattedHour = hour.toString().padStart(2, "0")
  return `${formattedHour}:${minute}`
})

interface ModifyBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  booking: any
  onSave: (modifiedBooking: any) => void
}

export function ModifyBookingDialog({ isOpen, onClose, booking, onSave }: ModifyBookingDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [modifiedBooking, setModifiedBooking] = useState({ ...booking })
  const [date, setDate] = useState<Date>(parseISO(booking.date))
  const [selectedResources, setSelectedResources] = useState<ResourceReservation[]>(booking.resources || [])

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setModifiedBooking({
        ...modifiedBooking,
        date: format(newDate, "yyyy-MM-dd"),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!modifiedBooking.purpose || !modifiedBooking.startTime || !modifiedBooking.endTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Validate that end time is after start time
    const [startHour, startMinute] = modifiedBooking.startTime.split(":").map(Number)
    const [endHour, endMinute] = modifiedBooking.endTime.split(":").map(Number)

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the onSave callback with the modified booking
      onSave({
        ...modifiedBooking,
        resources: selectedResources,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modify Booking</DialogTitle>
            <DialogDescription>Update the details of your workspace booking.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace" className="required">
                Workspace
              </Label>
              <Input id="workspace" value={modifiedBooking.workspaceName} disabled className="bg-muted" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purpose" className="required">
                Purpose
              </Label>
              <Input
                id="purpose"
                value={modifiedBooking.purpose}
                onChange={(e) => setModifiedBooking({ ...modifiedBooking, purpose: e.target.value })}
                placeholder="Enter the purpose of booking"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date" className="required">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime" className="required">
                  Start Time
                </Label>
                <Select
                  value={modifiedBooking.startTime}
                  onValueChange={(value) => setModifiedBooking({ ...modifiedBooking, startTime: value })}
                >
                  <SelectTrigger id="startTime">
                    <SelectValue>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {modifiedBooking.startTime}
                      </div>
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

              <div className="grid gap-2">
                <Label htmlFor="endTime" className="required">
                  End Time
                </Label>
                <Select
                  value={modifiedBooking.endTime}
                  onValueChange={(value) => setModifiedBooking({ ...modifiedBooking, endTime: value })}
                >
                  <SelectTrigger id="endTime">
                    <SelectValue>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {modifiedBooking.endTime}
                      </div>
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

            <div className="grid gap-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <Input
                id="attendees"
                type="number"
                min="1"
                value={modifiedBooking.attendees}
                onChange={(e) => setModifiedBooking({ ...modifiedBooking, attendees: Number.parseInt(e.target.value) })}
                placeholder="Enter number of attendees"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={modifiedBooking.notes || ""}
                onChange={(e) => setModifiedBooking({ ...modifiedBooking, notes: e.target.value })}
                placeholder="Add any additional requirements or notes"
                rows={3}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4 py-4">
            <ResourceSelection selectedResources={selectedResources} onChange={setSelectedResources} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
