"use client"

import { useState, useEffect } from "react"
import { ShieldAlert, Code2, UserCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRole, type Role } from "@/hooks/use-role"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface RoleOption {
  value: Role
  label: string
  description: string
  icon: React.ElementType
  color: string
  features: string[]
}

const roleOptions: Record<Role, RoleOption> = {
  owner: {
    value: "owner",
    label: "Owner",
    description: "Full administrative access",
    icon: ShieldAlert,
    color: "border-blue-500 bg-blue-50 hover:bg-blue-100",
    features: ["User management", "System settings", "All features", "Analytics"]
  },
  expert: {
    value: "expert",
    label: "Expert",
    description: "Manage sessions and clients",
    icon: Code2,
    color: "border-green-500 bg-green-50 hover:bg-green-100",
    features: ["Session management", "Client interaction", "Availability", "Earnings"]
  },
  client: {
    value: "client",
    label: "Client",
    description: "Book sessions and communicate",
    icon: UserCircle,
    color: "border-purple-500 bg-purple-50 hover:bg-purple-100",
    features: ["Book sessions", "Message experts", "Manage bookings", "Reviews"]
  },
}

interface RoleSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleSelectionModal({ open, onOpenChange }: RoleSelectionModalProps) {
  const { availableRoles, selectRole, user } = useRole()
  const [selecting, setSelecting] = useState<Role | null>(null)

  const handleRoleSelect = async (role: Role) => {
    setSelecting(role)
    try {
      await selectRole(role)
      onOpenChange(false)
    } catch (error) {
      console.error("Error selecting role:", error)
    } finally {
      setSelecting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Choose Your Role</DialogTitle>
          <DialogDescription className="text-center">
            {user && `Welcome ${user.username}! `}
            You have access to multiple roles. Please select how you'd like to use the platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {availableRoles.map((roleValue) => {
            const option = roleOptions[roleValue]
            const Icon = option.icon
            const isSelecting = selecting === roleValue
            
            return (
              <Card
                key={roleValue}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  option.color,
                  isSelecting && "opacity-50"
                )}
                onClick={() => !isSelecting && handleRoleSelect(roleValue)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6" />
                      <div>
                        <CardTitle className="text-lg">{option.label}</CardTitle>
                        <CardDescription className="text-sm">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 opacity-50" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {option.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {isSelecting && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Selecting {option.label}...
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Full page version for /select-role route
export function RoleSelectionPage() {
  const { availableRoles, selectRole, saveRoleSelections, user } = useRole()
  const { toast } = useToast()
  const [selecting, setSelecting] = useState<Role | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([])
  const [isFirstTime, setIsFirstTime] = useState(false)

  // Check if this is first-time role selection
  useEffect(() => {
    const savedUserRoles = localStorage.getItem("squeedr-user-selected-roles")
    const userSelectedRoles = savedUserRoles ? JSON.parse(savedUserRoles) : []
    setIsFirstTime(userSelectedRoles.length === 0)
    setSelectedRoles(userSelectedRoles)
  }, [])

  const handleRoleToggle = (role: Role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role)
      } else {
        return [...prev, role]
      }
    })
  }

  const handleSaveRoles = () => {
    if (selectedRoles.length === 0) {
      toast({
        title: "No roles selected",
        description: "Please select at least one role to continue",
        variant: "destructive",
      })
      return
    }

    // Save the selected roles
    saveRoleSelections(selectedRoles)
    
    // If only one role selected, auto-select it
    if (selectedRoles.length === 1) {
      selectRole(selectedRoles[0])
    } else {
      // Show role selection for active role
      toast({
        title: "Roles saved successfully",
        description: "Now select your active role",
        duration: 3000,
      })
    }
  }

  const handleRoleSelect = async (role: Role) => {
    if (!selectedRoles.includes(role)) {
      toast({
        title: "Role not available",
        description: "This role is not in your selected roles",
        variant: "destructive",
      })
      return
    }

    setSelecting(role)
    try {
      await selectRole(role)
    } catch (error) {
      console.error("Error selecting role:", error)
    } finally {
      setSelecting(null)
    }
  }

  if (isFirstTime) {
    // First-time role selection with checkboxes
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Squeedr!</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {user && `Hi ${user.username}! `}
              To get started, please select the role(s) you'd like to use on our platform. You can select multiple roles if needed.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {(["owner", "expert", "client"] as Role[]).map((roleValue) => {
              const option = roleOptions[roleValue]
              const Icon = option.icon
              const isSelected = selectedRoles.includes(roleValue)
              
              return (
                <Card
                  key={roleValue}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg",
                    option.color,
                    isSelected && "ring-2 ring-blue-500 ring-offset-2"
                  )}
                  onClick={() => handleRoleToggle(roleValue)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="mx-auto p-3 rounded-full bg-white/50 w-fit">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center",
                        isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      )}>
                        {isSelected && <span className="text-white text-sm">✓</span>}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{option.label}</CardTitle>
                    <CardDescription className="text-sm">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {option.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleSaveRoles}
              size="lg"
              className="px-8 py-3"
              disabled={selectedRoles.length === 0}
            >
              Continue with Selected Roles ({selectedRoles.length})
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              You can change your role selections later from your profile settings
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Regular role selection for users with existing roles
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Active Role</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {user && `Welcome back ${user.username}! `}
            Select which role you'd like to use for this session.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableRoles.map((roleValue) => {
            const option = roleOptions[roleValue]
            const Icon = option.icon
            const isSelecting = selecting === roleValue
            
            return (
              <Card
                key={roleValue}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                  option.color,
                  isSelecting && "opacity-50 scale-95"
                )}
                onClick={() => !isSelecting && handleRoleSelect(roleValue)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-white/50 w-fit">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{option.label}</CardTitle>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {option.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    {isSelecting ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Selecting...
                      </div>
                    ) : (
                      <Button className="w-full mt-4" variant="outline">
                        Continue as {option.label}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            You can change your role later from the dashboard
          </p>
        </div>
      </div>
    </div>
  )
} 