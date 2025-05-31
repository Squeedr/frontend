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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { workspaces } from "@/lib/mock-data"
import type { Expert } from "@/lib/mock-data"

interface CreateExpertModalProps {
  onExpertCreated?: (expert: Expert) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideButton?: boolean
}

export function CreateExpertModal({
  onExpertCreated,
  isOpen,
  onOpenChange,
  hideButton = false,
}: CreateExpertModalProps) {
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [bio, setBio] = useState("")
  const [workspace, setWorkspace] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [skills, setSkills] = useState("")
  const [languages, setLanguages] = useState("")

  // Controlled/uncontrolled open state
  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const open = isControlled ? isOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  // Reset form when modal closes
  const resetForm = () => {
    setName("")
    setEmail("")
    setSpecialty("")
    setBio("")
    setWorkspace("")
    setHourlyRate("")
    setSkills("")
    setLanguages("")
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation
    if (!name || !email || !specialty || !workspace) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create expert object
    const newExpert: Expert = {
      id: uuidv4(),
      name,
      email,
      specialty,
      bio: bio || undefined,
      rating: 0,
      sessions: 0,
      revenue: 0,
      status: "active",
      workspaces: [workspace],
      hourlyRate: hourlyRate ? parseInt(hourlyRate) : undefined,
      skills: skills ? skills.split(",").map((s) => s.trim()) : undefined,
      languages: languages ? languages.split(",").map((l) => l.trim()) : undefined,
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (onExpertCreated) onExpertCreated(newExpert)
      toast({
        title: "Expert Created",
        description: `${name} has been added as an expert.`,
      })
      setOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating the expert. Please try again.",
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
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expert
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Expert</DialogTitle>
            <DialogDescription>
              Add a new expert to your platform. Fill out the details below and click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="required">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Smith" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="required">Email *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., jane@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty" className="required">Specialty *</Label>
              <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g., React Development" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief description of the expert's background and experience" rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workspace" className="required">Workspace *</Label>
              <Select value={workspace} onValueChange={setWorkspace}>
                <SelectTrigger id="workspace" className={!workspace ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((ws) => (
                    <SelectItem key={ws.id} value={ws.name}>{ws.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input id="hourlyRate" type="number" min="0" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g., 100" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, TypeScript, Node.js" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="languages">Languages (comma-separated)</Label>
              <Input id="languages" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g., English, Spanish, French" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Expert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 