"use client"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { permissionCategories } from "@/lib/mock-permission-requests"
import { useRole } from "@/hooks/use-role"
import { mockUsers } from "@/lib/mock-access"
import { PlusCircle } from "lucide-react"

interface RequestPermissionDialogProps {
  onRequestPermission: (request: {
    userId: string
    userName: string
    userEmail: string
    requestedPermissions: string[]
    reason: string
  }) => void
}

export function RequestPermissionDialog({ onRequestPermission }: RequestPermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [reason, setReason] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const { role } = useRole()

  // Find current user based on role switcher (in a real app, this would come from auth)
  const currentUser = mockUsers.find((user) => user.role === role) || mockUsers[0]

  const handleSubmit = () => {
    if (selectedPermissions.length === 0) {
      toast({
        title: "No permissions selected",
        description: "Please select at least one permission to request",
        variant: "destructive",
      })
      return
    }

    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for your permission request",
        variant: "destructive",
      })
      return
    }

    onRequestPermission({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      requestedPermissions: selectedPermissions,
      reason: reason.trim(),
    })

    toast({
      title: "Permission request submitted",
      description: "Your request has been sent to administrators for review",
    })

    // Reset form and close dialog
    setSelectedPermissions([])
    setReason("")
    setOpen(false)
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Request Permissions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Request Additional Permissions</DialogTitle>
          <DialogDescription>
            Select the permissions you need and provide a reason for your request. An administrator will review your
            request.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-medium mb-3">Available Permissions</h3>
          <ScrollArea className="h-[240px] rounded-md border p-4">
            <div className="space-y-4">
              {permissionCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h4 className="text-sm font-semibold">{category.name}</h4>
                  <div className="ml-4 space-y-1">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.name}
                          </label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm font-medium">
            Reason for Request
          </label>
          <Textarea
            id="reason"
            placeholder="Please explain why you need these permissions..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedPermissions.length === 0 || !reason.trim()}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
