"use client"

import { useState } from "react"
import { Check, ChevronDown, ShieldAlert, Code2, UserCircle, RotateCcw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRole, type Role } from "@/hooks/use-role"
import { cn } from "@/lib/utils"

interface RoleOption {
  value: Role
  label: string
  description: string
  icon: React.ElementType
  color: string
}

const roleOptions: Record<Role, RoleOption> = {
  owner: {
    value: "owner",
    label: "Owner",
    description: "Full access & administration",
    icon: ShieldAlert,
    color: "text-blue-600",
  },
  expert: {
    value: "expert",
    label: "Expert",
    description: "Manage sessions & clients",
    icon: Code2,
    color: "text-green-600",
  },
  client: {
    value: "client",
    label: "Client",
    description: "Book sessions & communicate",
    icon: UserCircle,
    color: "text-purple-600",
  },
}

interface RoleSwitcherMenuProps {
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  showDescription?: boolean
}

export function RoleSwitcherMenu({ 
  className, 
  size = "default", 
  variant = "outline",
  showDescription = true 
}: RoleSwitcherMenuProps) {
  const { role, availableRoles, switchRole, user, isLoading } = useRole()
  const [isOpen, setIsOpen] = useState(false)
  const [switching, setSwitching] = useState<Role | null>(null)

  const currentRoleOption = roleOptions[role]
  const CurrentIcon = currentRoleOption?.icon || UserCircle

  const handleRoleSwitch = async (newRole: Role) => {
    if (newRole === role) {
      setIsOpen(false)
      return
    }

    setSwitching(newRole)
    try {
      await switchRole(newRole)
      setIsOpen(false)
    } catch (error) {
      console.error("Error switching role:", error)
    } finally {
      setSwitching(null)
    }
  }

  // Don't show the switcher if user has only one role
  if (availableRoles.length <= 1) {
    return null
  }

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <RotateCcw className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className={cn("h-4 w-4", currentRoleOption?.color)} />
            <span>{currentRoleOption?.label || "Unknown"}</span>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Role
          {user && (
            <span className="block font-normal text-sm mt-1">
              {user.username} ({user.email})
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availableRoles.map((roleValue) => {
          const option = roleOptions[roleValue]
          const Icon = option.icon
          const isActive = role === roleValue
          const isSwitching = switching === roleValue
          
          return (
            <DropdownMenuItem
              key={roleValue}
              className="cursor-pointer p-3"
              onSelect={() => handleRoleSwitch(roleValue)}
              disabled={isSwitching}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", option.color)} />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {showDescription && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSwitching && (
                    <RotateCcw className="h-3 w-3 animate-spin" />
                  )}
                  {isActive && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-xs text-muted-foreground cursor-default"
          onSelect={(e) => e.preventDefault()}
        >
          You have {availableRoles.length} role{availableRoles.length !== 1 ? 's' : ''} available
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact version for smaller spaces
export function CompactRoleSwitcher({ className }: { className?: string }) {
  const { role, availableRoles, switchRole } = useRole()
  const [switching, setSwitching] = useState<Role | null>(null)

  const currentRoleOption = roleOptions[role]
  const CurrentIcon = currentRoleOption?.icon || UserCircle

  const handleRoleSwitch = async (newRole: Role) => {
    if (newRole === role) return

    setSwitching(newRole)
    try {
      await switchRole(newRole)
    } catch (error) {
      console.error("Error switching role:", error)
    } finally {
      setSwitching(null)
    }
  }

  if (availableRoles.length <= 1) {
    return (
      <Badge variant="outline" className={cn("flex items-center gap-1", className)}>
        <CurrentIcon className="h-3 w-3" />
        {currentRoleOption?.label}
      </Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 px-2 flex items-center gap-1", className)}
        >
          <CurrentIcon className={cn("h-3 w-3", currentRoleOption?.color)} />
          <span className="text-xs">{currentRoleOption?.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-48" align="end">
        {availableRoles.map((roleValue) => {
          const option = roleOptions[roleValue]
          const Icon = option.icon
          const isActive = role === roleValue
          const isSwitching = switching === roleValue
          
          return (
            <DropdownMenuItem
              key={roleValue}
              className="cursor-pointer"
              onSelect={() => handleRoleSwitch(roleValue)}
              disabled={isSwitching}
            >
              <Icon className={cn("h-4 w-4 mr-2", option.color)} />
              <span>{option.label}</span>
              {isActive && <Check className="h-4 w-4 ml-auto text-green-600" />}
              {isSwitching && <RotateCcw className="h-4 w-4 ml-auto animate-spin" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 