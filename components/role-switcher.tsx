"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ShieldAlert, Code2, UserCircle, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UserRole } from "@/lib/role-utils"
import { useRole } from "@/hooks/use-role"

interface RoleSwitcherProps {
  className?: string
}

interface RoleOption {
  value: UserRole
  label: string
  icon: React.ElementType
  description: string
  color: string
  textColor: string
  bgColor: string
  borderColor: string
}

const roleOptions: RoleOption[] = [
  {
    value: "owner",
    label: "Owner",
    icon: ShieldAlert,
    description: "Full access to all features, user management, and workspace administration",
    color: "text-blue-600",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    value: "expert",
    label: "Expert",
    icon: Code2,
    description: "Manage sessions, availability, and client interactions",
    color: "text-green-600",
    textColor: "text-green-800",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    value: "client",
    label: "Client",
    icon: UserCircle,
    description: "Book sessions, view calendar, and communicate with experts",
    color: "text-purple-600",
    textColor: "text-purple-800",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
]

export function RoleSwitcher({ className }: RoleSwitcherProps) {
  const { role, setRole } = useRole()
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the current role option
  const currentRole = roleOptions.find((option) => option.value === role)

  // Function to handle role change confirmation
  const confirmRoleChange = () => {
    if (!selectedRole) return

    try {
      // Update localStorage
      localStorage.setItem("squeedr-user-role", selectedRole)

      // Update role state
      setRole(selectedRole)

      // Close dialog
      setConfirmOpen(false)

      // Show success toast
      toast({
        title: "Role changed",
        description: `You are now viewing as ${roleOptions.find((option) => option.value === selectedRole)?.label}`,
      })

      // Reload the page to ensure all components update with the new role
      window.location.reload()
    } catch (error) {
      console.error("Error changing role:", error)
      toast({
        title: "Error changing role",
        description: "There was a problem changing your role. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to handle role selection
  const handleRoleSelect = (value: UserRole) => {
    if (value === role) return
    setSelectedRole(value)
    setConfirmOpen(true)
  }

  // If not mounted yet, return null
  if (!mounted) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("flex items-center gap-2 h-9 px-3 border-gray-200", className)}
          >
            {currentRole && (
              <>
                <span className={cn("rounded-full p-1", currentRole.bgColor)}>
                  <currentRole.icon className={cn("h-4 w-4", currentRole.color)} />
                </span>
                <span className="text-sm font-medium">{currentRole.label}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {roleOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleRoleSelect(option.value)}
              className={cn(
                "flex items-center gap-2 py-2 px-3 cursor-pointer",
                role === option.value && option.bgColor,
              )}
            >
              <span className={cn("rounded-full p-1", option.bgColor)}>
                <option.icon className={cn("h-4 w-4", option.color)} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-gray-500 truncate max-w-[180px]">
                  {option.description.substring(0, 30)}...
                </span>
              </div>
              {role === option.value && (
                <Badge variant="outline" className="ml-auto">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role change confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRole && (
                <>
                  <span className={cn("rounded-full p-1", roleOptions.find((o) => o.value === selectedRole)?.bgColor)}>
                    {selectedRole === "owner" && <ShieldAlert className="h-5 w-5 text-blue-600" />}
                    {selectedRole === "expert" && <Code2 className="h-5 w-5 text-green-600" />}
                    {selectedRole === "client" && <UserCircle className="h-5 w-5 text-purple-600" />}
                  </span>
                  Switch to {roleOptions.find((o) => o.value === selectedRole)?.label} Role?
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              This will change your view and permissions to match the selected role.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <Alert
              className={cn(
                "border",
                selectedRole === "owner" && "border-blue-200 bg-blue-50",
                selectedRole === "expert" && "border-green-200 bg-green-50",
                selectedRole === "client" && "border-purple-200 bg-purple-50",
              )}
            >
              <AlertDescription className="text-sm">
                <p className="font-medium mb-1">
                  {selectedRole === "owner" && "As an Owner, you will be able to:"}
                  {selectedRole === "expert" && "As an Expert, you will be able to:"}
                  {selectedRole === "client" && "As a Client, you will be able to:"}
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedRole === "owner" && (
                    <>
                      <li>Manage all workspaces and users</li>
                      <li>Configure system-wide settings</li>
                      <li>Access all expert and client features</li>
                      <li>View analytics and reporting</li>
                    </>
                  )}
                  {selectedRole === "expert" && (
                    <>
                      <li>Manage your availability and sessions</li>
                      <li>Communicate with clients</li>
                      <li>View and create invoices</li>
                      <li>Access expert-specific features</li>
                    </>
                  )}
                  {selectedRole === "client" && (
                    <>
                      <li>Book and manage sessions</li>
                      <li>View your calendar and notifications</li>
                      <li>Communicate with experts</li>
                      <li>Access client-specific features</li>
                    </>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              className={cn(
                selectedRole === "owner" && "bg-blue-600 hover:bg-blue-700",
                selectedRole === "expert" && "bg-green-600 hover:bg-green-700",
                selectedRole === "client" && "bg-purple-600 hover:bg-purple-700",
              )}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
