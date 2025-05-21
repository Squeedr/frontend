"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { workspaces } from "@/lib/mock-data"
import type { CalendarEvent } from "@/components/draggable-event"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateEvent: (event: Omit<CalendarEvent, "id">) => void
  initialDate?: Date
  initialHour?: number
  isEditMode?: boolean
  eventToEdit?: CalendarEvent | null
}

export function CreateEventModal({
  isOpen,
  onClose,
  onCreateEvent,
  initialDate = new Date(),
  initialHour,
  isEditMode = false,
  eventToEdit = null,
}: CreateEventModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date>(initialDate)
  const [startHour, setStartHour] = useState<string>(
    initialHour !== undefined ? `${initialHour.toString().padStart(2, "0")}:00` : "09:00",
  )
  const [endHour, setEndHour] = useState<string>(
    initialHour !== undefined ? `${(initialHour + 1).toString().padStart(2, "0")}:00` : "10:00",
  )
  const [workspace, setWorkspace] = useState<string>("Web Development")
  const [location, setLocation] = useState<string>("")
  const [status, setStatus] = useState<string>("upcoming")
  const [description, setDescription] = useState<string>("")

  // Reset form when modal opens with new initial values or edit mode changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && eventToEdit) {
        // Populate form with event data for editing
        const eventStart = parseISO(eventToEdit.start)
        const eventEnd = parseISO(eventToEdit.end)

        setTitle(eventToEdit.title)
        setDate(eventStart)
        setStartHour(
          `${eventStart.getHours().toString().padStart(2, "0")}:${eventStart.getMinutes().toString().padStart(2, "0")}`,
        )
        setEndHour(
          `${eventEnd.getHours().toString().padStart(2, "0")}:${eventEnd.getMinutes().toString().padStart(2, "0")}`,
        )
        setWorkspace(eventToEdit.workspace || "Web Development")
        setLocation(eventToEdit.location || "")
        setStatus(eventToEdit.status)
        setDescription(eventToEdit.description || "")
      } else {
        // Reset form for new event
        setTitle("")
        setDate(initialDate)
        setStartHour(initialHour !== undefined ? `${initialHour.toString().padStart(2, "0")}:00` : "09:00")
        setEndHour(initialHour !== undefined ? `${(initialHour + 1).toString().padStart(2, "0")}:00` : "10:00")
        setWorkspace("Web Development")
        setLocation("")
        setStatus("upcoming")
        setDescription("")
      }
    }
  }, [isOpen, initialDate, initialHour, isEditMode, eventToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title.trim()) {
      alert("Please enter a title for the event")
      return
    }

    // Create start and end date strings
    const startDate = new Date(date)
    const [startHourStr, startMinuteStr] = startHour.split(":")
    startDate.setHours(Number.parseInt(startHourStr, 10), Number.parseInt(startMinuteStr, 10), 0, 0)

    const endDate = new Date(date)
    const [endHourStr, endMinuteStr] = endHour.split(":")
    endDate.setHours(Number.parseInt(endHourStr, 10), Number.parseInt(endMinuteStr, 10), 0, 0)

    // Create event object
    const newEvent: Omit<CalendarEvent, "id"> = {
      title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      status: status as "upcoming" | "in-progress" | "completed" | "cancelled",
      workspace,
      location,
      description,
    }

    // Call the create/update event handler
    onCreateEvent(newEvent)

    // Close the modal
    onClose()
  }

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        options.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return options
  }

  // Filter end time options to only show times after the selected start time
  const getEndTimeOptions = () => {
    const allOptions = generateTimeOptions()
    const startTimeIndex = allOptions.indexOf(startHour)
    return allOptions.slice(startTimeIndex + 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of your event. Click save when you're done."
                : "Add a new event to your calendar. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="startTime">Start</Label>
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="endTime">End</Label>
                <Select value={endHour} onValueChange={setEndHour} disabled={!startHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getEndTimeOptions().map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workspace">Workspace</Label>
                <Select value={workspace} onValueChange={setWorkspace}>
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Event location (optional)"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
