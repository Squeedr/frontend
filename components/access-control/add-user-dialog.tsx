"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus } from "lucide-react"
import { workspaces } from "@/lib/mock-access"
import { useToast } from "@/hooks/use-toast"

interface AddUserDialogProps {
  onAddUser: (user: {
    email: string
    role: string
    workspaces: string[]
  }) => void
}

export function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("client")
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([])
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    onAddUser({
      email,
      role,
      workspaces: selectedWorkspaces,
    })

    // Reset form
    setEmail("")
    setRole("client")
    setSelectedWorkspaces([])
    setOpen(false)

    toast({
      title: "Invite sent",
      description: `An invitation has been sent to ${email}`,
    })
  }

  const toggleWorkspace = (workspace: string) => {
    if (selectedWorkspaces.includes(workspace)) {
      setSelectedWorkspaces(selectedWorkspaces.filter((w) => w !== workspace))
    } else {
      setSelectedWorkspaces([...selectedWorkspaces, workspace])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Invite a new user to join your organization.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Workspace Access</Label>
              <div className="grid grid-cols-2 gap-2">
                {workspaces.map((workspace) => (
                  <div key={workspace} className="flex items-center space-x-2">
                    <Checkbox
                      id={`workspace-${workspace}`}
                      checked={selectedWorkspaces.includes(workspace)}
                      onCheckedChange={() => toggleWorkspace(workspace)}
                    />
                    <Label htmlFor={`workspace-${workspace}`} className="text-sm font-normal">
                      {workspace}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Send Invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
