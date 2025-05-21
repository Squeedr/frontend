"use client"

import type React from "react"

import { useState } from "react"
import { Edit2 } from "lucide-react"

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
import type { Workspace } from "@/lib/types"

interface EditWorkspaceModalProps {
  workspace: Workspace & {
    location?: string
    capacity?: number
    amenities?: string[]
    availability?: string
    image?: string
  }
  onWorkspaceUpdated: (updatedWorkspace: any) => void
  trigger?: React.ReactNode
}

export function EditWorkspaceModal({ workspace, onWorkspaceUpdated, trigger }: EditWorkspaceModalProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdateWorkspace = async (data: WorkspaceFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create an updated workspace object
      const updatedWorkspace = {
        ...workspace,
        name: data.name,
        description: data.description || "",
        location: data.location,
        capacity: data.capacity,
      }

      // Call the callback to update the parent component
      onWorkspaceUpdated(updatedWorkspace)

      // Show success toast
      toast({
        title: "Workspace updated",
        description: `${data.name} has been updated successfully.`,
      })

      // Close the modal
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error updating workspace",
        description: "There was a problem updating the workspace. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>Update the details for {workspace.name}. Make your changes below.</DialogDescription>
        </DialogHeader>

        <WorkspaceForm
          workspace={workspace}
          onSubmit={handleUpdateWorkspace}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
          submitLabel="Update Workspace"
        />
      </DialogContent>
    </Dialog>
  )
}
