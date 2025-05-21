"use client"

import { useState } from "react"
import type { User } from "@/lib/mock-access"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash, Ban, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface UserTableProps {
  users: User[]
  onUpdateUser: (userId: string, updates: Partial<User>) => void
  onDeleteUser: (userId: string) => void
}

export function UserTable({ users, onUpdateUser, onDeleteUser }: UserTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { toast } = useToast()

  const handleSelectUser = (userId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers(users.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleRoleChange = (userId: string, role: string) => {
    onUpdateUser(userId, { role })
  }

  const handleBulkAction = (action: "suspend" | "delete" | "resend") => {
    if (action === "suspend") {
      selectedUsers.forEach((userId) => {
        onUpdateUser(userId, { status: "suspended" })
      })
      toast({
        title: "Users suspended",
        description: `${selectedUsers.length} users have been suspended.`,
      })
    } else if (action === "delete") {
      selectedUsers.forEach((userId) => {
        onDeleteUser(userId)
      })
      toast({
        title: "Users deleted",
        description: `${selectedUsers.length} users have been deleted.`,
      })
    } else if (action === "resend") {
      toast({
        title: "Invites resent",
        description: `Invites have been resent to ${selectedUsers.length} users.`,
      })
    }
    setSelectedUsers([])
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "expert":
        return "secondary"
      case "client":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "invited":
        return "info"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {selectedUsers.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("resend")}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Resend Invite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction("suspend")}
              className="flex items-center gap-1"
            >
              <Ban className="h-4 w-4" />
              Suspend
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction("delete")}
              className="flex items-center gap-1"
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-2 text-left font-medium">User</th>
              <th className="p-2 text-left font-medium">Email</th>
              <th className="p-2 text-left font-medium">Role</th>
              <th className="p-2 text-left font-medium">Status</th>
              <th className="p-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-muted/50">
                <td className="p-2">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <a href={`/dashboard/profile?id=${user.id}`} className="font-medium hover:underline">
                      {user.name}
                    </a>
                  </div>
                </td>
                <td className="p-2 text-muted-foreground">{user.email}</td>
                <td className="p-2">
                  <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize">
                    {user.status}
                  </Badge>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/dashboard/profile?id=${user.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteUser(user.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
