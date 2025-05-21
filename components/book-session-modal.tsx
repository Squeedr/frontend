"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"

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

// Mock experts data
const mockExperts = [
  { id: "1", name: "Dr. Jane Smith", expertise: "Web Development" },
  { id: "2", name: "Prof. John Doe", expertise: "Mobile Development" },
  { id: "3", name: "Sarah Johnson", expertise: "UI/UX Design" },
  { id: "4", name: "Michael Chen", expertise: "Data Science" },
  { id: "5", name: "Emily Wilson", expertise: "Project Management" },
]

// Time slots in 30-minute increments
const timeSlots = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const formattedHour = hour.toString().padStart(2, "0")
  return `${formattedHour}:${minute}`
})

interface BookSessionModalProps {
  buttonVariant?: "default" | "outline" | "secondary" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
  onSessionBooked?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideButton?: boolean
}

export function BookSessionModal({
  buttonVariant = "default",
  buttonSize = "default",
  className,
  onSessionBooked,
  isOpen,
  onOpenChange,
  hideButton = false,
}: BookSessionModalProps) {
  const { toast } = useToast()
  const { role } = useRole()
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")
  const [workspace, setWorkspace] = useState("")
  const [expert, setExpert] = useState("")
  const [notes, setNotes] = useState("")

  // Determine if we're using controlled or uncontrolled open state
  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const open = isControlled ? isOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  // Filter experts based on selected workspace
  const filteredExperts = workspace ? mockExperts.filter((e) => e.expertise === workspace) : mockExperts

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTitle("")
      setDate(undefined)
      setTime("")
      setWorkspace("")
      setExpert("")
      setNotes("")
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!title || !date || !time || !workspace) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create session datetime
    const [hours, minutes] = time.split(":").map(Number)
    const sessionDate = new Date(date)
    sessionDate.setHours(hours, minutes)

    // Prepare form data
    const formData = {
      title,
      datetime: sessionDate.toISOString(),
      workspace,
      expert: expert || null,
      notes,
      role,
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate POST request (commented out as it's not a real endpoint)
      // const response = await fetch('/api/sessions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // if (!response.ok) throw new Error('Failed to book session')

      // Success
      toast({
        title: "Booking confirmed",
        description: `Your session "${title}" has been booked successfully.`,
      })

      // Close modal and reset form
      setOpen(false)

      // Call callback if provided
      if (onSessionBooked) onSessionBooked()
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error booking your session. Please try again.",
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
            Book a Session
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Book a Session</DialogTitle>
            <DialogDescription>Fill in the details below to book a new session.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="required">
                Session Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter session title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="grid gap-2">
                <Label htmlFor="time" className="required">
                  Time
                </Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time" className={!time ? "text-muted-foreground" : ""}>
                    <SelectValue placeholder="Select time">
                      {time ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
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
              <Label htmlFor="workspace" className="required">
                Workspace
              </Label>
              <Select
                value={workspace}
                onValueChange={(value) => {
                  setWorkspace(value)
                  setExpert("") // Reset expert when workspace changes
                }}
              >
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

            {role === "client" && (
              <div className="grid gap-2">
                <Label htmlFor="expert">Select Expert (Optional)</Label>
                <Select value={expert} onValueChange={setExpert} disabled={!workspace}>
                  <SelectTrigger id="expert" className={!expert ? "text-muted-foreground" : ""}>
                    <SelectValue placeholder={workspace ? "Select expert" : "Select workspace first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredExperts.map((exp) => (
                      <SelectItem key={exp.id} value={exp.id}>
                        {exp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information or requirements"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
