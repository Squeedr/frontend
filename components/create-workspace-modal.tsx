"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WorkspaceForm, type WorkspaceFormValues } from "@/components/workspace-form"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

interface CreateWorkspaceModalProps {
  onWorkspaceCreated: (workspace: any) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  hideButton?: boolean
}

export function CreateWorkspaceModal({
  onWorkspaceCreated,
  isOpen,
  onOpenChange,
  hideButton = false,
}: CreateWorkspaceModalProps) {
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine if we're using controlled or uncontrolled open state
  const isControlled = isOpen !== undefined && onOpenChange !== undefined
  const open = isControlled ? isOpen : internalOpen
  const setOpen = isControlled ? onOpenChange : setInternalOpen

  const handleCreateWorkspace = async (data: WorkspaceFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new workspace object
      const newWorkspace = {
        id: uuidv4(),
        name: data.name,
        description: data.description || "",
        location: data.location,
        capacity: data.capacity,
        experts: 0,
        sessions: 0,
        revenue: 0,
        utilization: 0,
        createdAt: new Date().toISOString(),
        amenities: ["High-speed WiFi"],
        availability: "Available",
        image: "/abstract-geometric-shapes.png",
      }

      // Call the callback to update the parent component
      onWorkspaceCreated(newWorkspace)

      // Show success toast
      toast({
        title: "Workspace created",
        description: `${data.name} has been created successfully.`,
      })

      // Close the modal
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error creating workspace",
        description: "There was a problem creating the workspace. Please try again.",
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
            Create Workspace
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace to your organization. Fill out the form below with the workspace details.
          </DialogDescription>
        </DialogHeader>

        <WorkspaceForm
          onSubmit={handleCreateWorkspace}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Create Workspace"
        />
      </DialogContent>
    </Dialog>
  )
}
