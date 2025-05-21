"use client"

import type React from "react"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, Users, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { WaitlistRequest } from "@/lib/types/waitlist"

interface JoinWaitlistDialogProps {
  isOpen: boolean
  onClose: () => void
  workspace: {
    id: string
    name: string
    capacity: number
    type: string
  }
  date: string
  startTime: string
  endTime: string
  onJoinWaitlist: (request: WaitlistRequest) => void
  currentUser: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function JoinWaitlistDialog({
  isOpen,
  onClose,
  workspace,
  date,
  startTime,
  endTime,
  onJoinWaitlist,
  currentUser,
}: JoinWaitlistDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [purpose, setPurpose] = useState("")
  const [attendees, setAttendees] = useState("1")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!purpose) {
      toast({
        title: "Missing information",
        description: "Please provide a purpose for your booking request.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create waitlist request
      const waitlistRequest: WaitlistRequest = {
        id: uuidv4(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRole: currentUser.role as any,
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        date,
        startTime,
        endTime,
        requestedAt: new Date().toISOString(),
        purpose,
        attendees: Number.parseInt(attendees),
        status: "pending",
        notes: notes || undefined,
        priority: 1, // Default priority
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback with the new request
      onJoinWaitlist(waitlistRequest)

      // Show success toast
      toast({
        title: "Added to waitlist",
        description: `You've been added to the waitlist for ${workspace.name} on ${format(parseISO(date), "MMMM d, yyyy")}`,
      })

      // Close the dialog
      onClose()
    } catch (error) {
      toast({
        title: "Failed to join waitlist",
        description: "There was an error adding you to the waitlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Waitlist</DialogTitle>
            <DialogDescription>
              Add yourself to the waitlist for this workspace. You'll be notified if it becomes available.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Workspace Unavailable</AlertTitle>
              <AlertDescription>
                {workspace.name} is currently booked for your selected time. Join the waitlist to be notified if it
                becomes available.
              </AlertDescription>
            </Alert>

            <div className="grid gap-2">
              <Label>Workspace</Label>
              <div className="rounded-md border p-3 text-sm">
                <div className="font-medium">{workspace.name}</div>
                <div className="text-muted-foreground">{workspace.type}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <div className="flex items-center rounded-md border p-3 text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {format(parseISO(date), "MMMM d, yyyy")}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Time</Label>
                <div className="flex items-center rounded-md border p-3 text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {startTime} - {endTime}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="purpose" className="required">
                Purpose
              </Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Enter the purpose of your booking"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="attendees" className="required">
                Number of Attendees
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attendees"
                  type="number"
                  min="1"
                  max={workspace.capacity}
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  Max: {workspace.capacity}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special requirements or notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
