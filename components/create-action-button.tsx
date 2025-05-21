"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookSessionModal } from "@/components/book-session-modal"
import { BookWorkspaceModal } from "@/components/book-workspace-modal"
import { CreateWorkspaceModal } from "@/components/create-workspace-modal"

interface CreateActionButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CreateActionButton({ variant = "default", size = "default", className }: CreateActionButtonProps) {
  const { role } = useRole()
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false)
  const [createWorkspaceModalOpen, setCreateWorkspaceModalOpen] = useState(false)

  // Determine which options to show based on user role
  const canBookWorkspace = role === "owner" || role === "expert"
  const canCreateWorkspace = role === "owner"

  // If user can only perform one action, we'll show that directly
  const singleAction =
    !canBookWorkspace && !canCreateWorkspace ? "bookSession" : role === "client" ? "bookSession" : null

  const handleOptionSelect = (action: string) => {
    if (action === "bookSession") {
      setSessionModalOpen(true)
    } else if (action === "bookWorkspace") {
      setWorkspaceModalOpen(true)
    } else if (action === "createWorkspace") {
      setCreateWorkspaceModalOpen(true)
    }
  }

  // If there's only one possible action, show a direct button
  if (singleAction === "bookSession") {
    return <BookSessionModal buttonVariant={variant} buttonSize={size} className={className} />
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOptionSelect("bookSession")}>Book a Session</DropdownMenuItem>

          {canBookWorkspace && (
            <DropdownMenuItem onClick={() => handleOptionSelect("bookWorkspace")}>Book a Workspace</DropdownMenuItem>
          )}

          {canCreateWorkspace && (
            <DropdownMenuItem onClick={() => handleOptionSelect("createWorkspace")}>
              Create a Workspace
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals - these will only open when their respective state is true */}
      <BookSessionModal
        isOpen={sessionModalOpen}
        onOpenChange={setSessionModalOpen}
        buttonVariant="default"
        buttonSize="default"
        hideButton
      />

      {canBookWorkspace && (
        <BookWorkspaceModal isOpen={workspaceModalOpen} onOpenChange={setWorkspaceModalOpen} hideButton />
      )}

      {canCreateWorkspace && (
        <CreateWorkspaceModal
          isOpen={createWorkspaceModalOpen}
          onOpenChange={setCreateWorkspaceModalOpen}
          onWorkspaceCreated={() => {}} // Pass the actual handler from parent
          hideButton
        />
      )}
    </>
  )
}
