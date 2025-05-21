"use client"

import type React from "react"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteWorkspaceDialogProps {
  workspaceId: string
  workspaceName: string
  onWorkspaceDeleted: (id: string) => void
  trigger?: React.ReactNode
}

export function DeleteWorkspaceDialog({
  workspaceId,
  workspaceName,
  onWorkspaceDeleted,
  trigger,
}: DeleteWorkspaceDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback to update the parent component
      onWorkspaceDeleted(workspaceId)

      // Show success toast
      toast({
        title: "Workspace deleted",
        description: `${workspaceName} has been deleted successfully.`,
      })

      // Close the dialog
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error deleting workspace",
        description: "There was a problem deleting the workspace. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the workspace "{workspaceName}" and all associated data. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isDeleting ? "Deleting..." : "Delete Workspace"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
