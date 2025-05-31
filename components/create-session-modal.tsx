"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { filterOptions } from "@/lib/mock-data"
import type { Session } from "@/lib/mock-data"
import { createSession } from "@/lib/api/sessions"
import { useRole } from "@/hooks/use-role"

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface CreateSessionModalProps {
  onSessionCreated: (session: Session) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideButton?: boolean
}

export function CreateSessionModal({
  onSessionCreated,
  isOpen,
  onOpenChange,
  hideButton = false,
}: CreateSessionModalProps) {
  const { toast } = useToast()
  const { user } = useRole()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [expertName, setExpertName] = useState("")
  const [clientName, setClientName] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [workspace, setWorkspace] = useState("")
  const [price, setPrice] = useState("")
  const [notes, setNotes] = useState("")

  // Determine if we're using controlled or uncontrolled open state
  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const open = isControlled ? isOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  // Reset form when modal closes
  const resetForm = () => {
    setTitle("")
    setExpertName("")
    setClientName("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setWorkspace("")
    setPrice("")
    setNotes("")
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!title || !expertName || !clientName || !date || !startTime || !endTime || !workspace || !price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (selectedDate < today) {
      toast({
        title: "Invalid Date",
        description: "Session date cannot be in the past. Please select a future date.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Check if user is authenticated - fix JWT token retrieval
    const jwt = localStorage.getItem("squeedr-token") || localStorage.getItem("token")
    if (!jwt) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create sessions.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Prepare session data for Strapi
    const sessionData = {
      title,
      workspace,
      expertName,
      expertId: `e-${uuidv4().slice(0, 8)}`,
      clientName,
      clientId: `c-${uuidv4().slice(0, 8)}`,
      date,
      startTime,
      endTime,
      price: parseInt(price),
      status: "upcoming",
      notes: notes || undefined,
      recordingUrl: "",
    }

    try {
      // Create session via Strapi API
      console.log("Creating session with data:", sessionData)
      console.log("Using JWT token:", jwt ? "✓ Token available" : "✗ No token")
      
      const response = await createSession(sessionData, jwt)
      console.log("Session creation response:", response)
      
      // Convert Strapi response to local session format
      const newSession: Session = {
        id: response.data.id.toString(),
        title: response.data.attributes.title,
        expertId: response.data.attributes.expertId,
        expertName: response.data.attributes.expertName,
        clientId: response.data.attributes.clientId,
        clientName: response.data.attributes.clientName,
        date: response.data.attributes.date,
        startTime: response.data.attributes.startTime,
        endTime: response.data.attributes.endTime,
        status: response.data.attributes.status,
        price: response.data.attributes.price,
        workspace: response.data.attributes.workspace,
        notes: response.data.attributes.notes,
        recordingUrl: response.data.attributes.recordingUrl,
      }

      onSessionCreated(newSession)
      toast({
        title: "Session Created",
        description: `${title} has been created successfully.`,
      })
      setOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Session creation error:", error)
      console.error("Full error object:", JSON.stringify(error, null, 2))
      
      // Handle different types of errors
      let errorMessage = "There was a problem creating the session. Please try again."
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again."
      } else if (error.response?.status === 403) {
        errorMessage = "Permission denied. Please contact your administrator to enable session creation permissions for your role."
        console.log("🚫 403 ERROR - STRAPI PERMISSION ISSUE")
        console.log("TO FIX: Go to Strapi Admin → Settings → Users & Permissions Plugin → Roles")
        console.log("Select your user's role → Enable 'create' permission for 'Session' collection")
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid session data. Please check your inputs."
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Error creating session",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideButton && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>Fill in the details to create a new expert session.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                placeholder="e.g., React Performance Optimization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace *</Label>
              <Select value={workspace} onValueChange={setWorkspace} required>
                <SelectTrigger id="workspace">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.workspaces.map((ws) => (
                    <SelectItem key={ws} value={ws}>
                      {ws}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertName">Expert Name *</Label>
              <Input
                id="expertName"
                placeholder="e.g., Jane Smith"
                value={expertName}
                onChange={(e) => setExpertName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="e.g., Bob Johnson"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayDate()}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about the session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 