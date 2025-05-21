"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { workspaces } from "@/lib/mock-data"

// Time slots in 30-minute increments
const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const formattedHour = hour.toString().padStart(2, "0")
  return `${formattedHour}:${minute}`
})

interface BookWorkspaceModalProps {
  buttonVariant?: "default" | "outline" | "secondary" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
  onWorkspaceBooked?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideButton?: boolean
}

export function BookWorkspaceModal({
  buttonVariant = "outline",
  buttonSize = "default",
  className,
  onWorkspaceBooked,
  isOpen,
  onOpenChange,
  hideButton = false,
}: BookWorkspaceModalProps) {
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [purpose, setPurpose] = useState("")
  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [workspace, setWorkspace] = useState("")
  const [attendees, setAttendees] = useState("")
  const [notes, setNotes] = useState("")

  // Determine if we're using controlled or uncontrolled open state
  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const open = isControlled ? isOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setPurpose("")
      setDate(undefined)
      setStartTime("")
      setEndTime("")
      setWorkspace("")
      setAttendees("")
      setNotes("")
    }
  }, [open])

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

    // Prepare form data
    const formData = {
      purpose,
      date: format(date, "yyyy-MM-dd"),
      startTime,
      endTime,
      workspace,
      attendees: attendees ? Number.parseInt(attendees, 10) : 1,
      notes,
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      toast({
        title: "Workspace booked",
        description: `${workspace} has been booked for ${format(date, "MMMM d, yyyy")} from ${startTime} to ${endTime}.`,
      })

      // Close modal and reset form
      setOpen(false)

      // Call callback if provided
      if (onWorkspaceBooked) onWorkspaceBooked()
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideButton && (
        <DialogTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize} className={className}>
            <Briefcase className="mr-2 h-4 w-4" />
            Book a Workspace
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Book a Workspace</DialogTitle>
            <DialogDescription>Fill in the details below to book a workspace.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
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

            <div className="grid gap-2">
              <Label htmlFor="workspace" className="required">
                Workspace
              </Label>
              <Select value={workspace} onValueChange={setWorkspace}>
                <SelectTrigger id="workspace" className={!workspace ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((ws) => (
                    <SelectItem key={ws.id} value={ws.name}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
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
              <div className="grid gap-2">
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

              <div className="grid gap-2">
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

            <div className="grid gap-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <Input
                id="attendees"
                type="number"
                min="1"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Enter number of attendees"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional requirements or notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
