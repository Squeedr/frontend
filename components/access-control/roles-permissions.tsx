"use client"

import { useState } from "react"
import type { RolePerm } from "@/lib/mock-access"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface RolesPermissionsProps {
  roles: RolePerm[]
  onUpdateRole: (roleId: string, permissions: Record<string, boolean>) => void
}

export function RolesPermissions({ roles, onUpdateRole }: RolesPermissionsProps) {
  const [selectedRole, setSelectedRole] = useState<RolePerm>(roles[0])
  const [permissions, setPermissions] = useState<Record<string, boolean>>(roles[0].permissions)
  const { toast } = useToast()

  const handleRoleSelect = (role: RolePerm) => {
    setSelectedRole(role)
    setPermissions(role.permissions)
  }

  const handlePermissionChange = (feature: string, value: boolean) => {
    setPermissions({
      ...permissions,
      [feature]: value,
    })
  }

  const handleSave = () => {
    onUpdateRole(selectedRole.id, permissions)
    toast({
      title: "Permissions updated",
      description: `Permissions for ${selectedRole.name} role have been updated.`,
    })
  }

  const permissionFeatures = [
    { id: "dashboard", name: "Dashboard" },
    { id: "sessions", name: "Sessions" },
    { id: "calendar", name: "Calendar" },
    { id: "experts", name: "Experts" },
    { id: "workspaces", name: "Workspaces" },
    { id: "ratings", name: "Ratings" },
    { id: "messages", name: "Messages" },
    { id: "invoices", name: "Invoices" },
    { id: "notifications", name: "Notifications" },
    { id: "availability", name: "Availability" },
    { id: "settings", name: "Settings" },
    { id: "profile", name: "Profile" },
    { id: "users", name: "Users" },
    { id: "roles", name: "Roles" },
  ]

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 space-y-4">
        <h3 className="text-lg font-medium">Roles</h3>
        <div className="space-y-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md transition-colors",
                selectedRole.id === role.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <div className="font-medium">{role.name}</div>
              {role.description && <div className="text-xs opacity-70">{role.description}</div>}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Permissions for {selectedRole.name} Role</h3>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <div className="border rounded-md">
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
            {permissionFeatures.map((feature) => (
              <div key={feature.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`permission-${feature.id}`}
                  checked={permissions[feature.id] || false}
                  onCheckedChange={(checked) => handlePermissionChange(feature.id, !!checked)}
                />
                <Label
                  htmlFor={`permission-${feature.id}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {feature.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Changes to permissions will be applied immediately to all users with this role.</p>
        </div>
      </div>
    </div>
  )
}
