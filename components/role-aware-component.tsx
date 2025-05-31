"use client"

import { useRole, type Role } from "@/hooks/use-role"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Code2, UserCircle, Users, Calendar, Settings } from "lucide-react"

// Example component showing how to access and use the "acting role"
export function RoleAwareComponent() {
  const { role, user, availableRoles, switchRole } = useRole()

  // Example: Role-based feature access
  const hasAccess = (feature: string): boolean => {
    switch (feature) {
      case "user-management":
        return role === "owner"
      case "session-management":
        return role === "owner" || role === "expert"
      case "booking":
        return true // All roles can book
      default:
        return false
    }
  }

  // Example: Role-based UI rendering
  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "owner":
        return <ShieldAlert className="h-5 w-5 text-blue-600" />
      case "expert":
        return <Code2 className="h-5 w-5 text-green-600" />
      case "client":
        return <UserCircle className="h-5 w-5 text-purple-600" />
    }
  }

  // Example: Role-based content
  const getRoleDescription = (role: Role): string => {
    switch (role) {
      case "owner":
        return "You have full administrative access to all features and user management."
      case "expert":
        return "You can manage sessions, interact with clients, and update your availability."
      case "client":
        return "You can book sessions, communicate with experts, and manage your bookings."
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Role Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRoleIcon(role)}
            Current Role: {role.charAt(0).toUpperCase() + role.slice(1)}
          </CardTitle>
          <CardDescription>
            {getRoleDescription(role)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Acting as:</span>
            <Badge variant="outline">{role}</Badge>
            {availableRoles.length > 1 && (
              <span className="text-xs text-muted-foreground">
                ({availableRoles.length} roles available)
              </span>
            )}
          </div>
          
          {user && (
            <div className="text-sm text-muted-foreground">
              <p>User: {user.username} ({user.email})</p>
              <p>Available roles: {availableRoles.join(", ")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role-Based Feature Access Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Available Features</CardTitle>
          <CardDescription>
            Features available based on your current role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* User Management - Owner only */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <div>
                <p className="font-medium">User Management</p>
                <p className="text-sm text-muted-foreground">Manage users and permissions</p>
              </div>
            </div>
            <Button 
              variant={hasAccess("user-management") ? "default" : "secondary"}
              disabled={!hasAccess("user-management")}
              size="sm"
            >
              {hasAccess("user-management") ? "Access" : "Restricted"}
            </Button>
          </div>

          {/* Session Management - Owner and Expert */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <div>
                <p className="font-medium">Session Management</p>
                <p className="text-sm text-muted-foreground">Create and manage sessions</p>
              </div>
            </div>
            <Button 
              variant={hasAccess("session-management") ? "default" : "secondary"}
              disabled={!hasAccess("session-management")}
              size="sm"
            >
              {hasAccess("session-management") ? "Access" : "Restricted"}
            </Button>
          </div>

          {/* Booking - All roles */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <div>
                <p className="font-medium">Book Sessions</p>
                <p className="text-sm text-muted-foreground">Book and manage your sessions</p>
              </div>
            </div>
            <Button 
              variant={hasAccess("booking") ? "default" : "secondary"}
              disabled={!hasAccess("booking")}
              size="sm"
            >
              {hasAccess("booking") ? "Access" : "Restricted"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role Switching Example */}
      {availableRoles.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Switch Role</CardTitle>
            <CardDescription>
              You have access to multiple roles. Switch to change your permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {availableRoles.map((availableRole) => (
                <Button
                  key={availableRole}
                  variant={role === availableRole ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchRole(availableRole)}
                  className="flex items-center gap-2"
                >
                  {getRoleIcon(availableRole)}
                  {availableRole.charAt(0).toUpperCase() + availableRole.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role-Specific Content Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Specific Content</CardTitle>
          <CardDescription>
            Content that changes based on your current role
          </CardDescription>
        </CardHeader>
        <CardContent>
          {role === "owner" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Owner Dashboard</h4>
              <p className="text-blue-800 text-sm">
                Welcome to the owner dashboard! You have full access to user management, 
                system settings, and all administrative features.
              </p>
            </div>
          )}

          {role === "expert" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Expert Dashboard</h4>
              <p className="text-green-800 text-sm">
                Welcome to the expert dashboard! You can manage your sessions, 
                interact with clients, and update your availability.
              </p>
            </div>
          )}

          {role === "client" && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Client Dashboard</h4>
              <p className="text-purple-800 text-sm">
                Welcome to the client dashboard! You can book sessions with experts, 
                view your upcoming appointments, and manage your bookings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook example for custom role-based logic
export function useRolePermissions() {
  const { role } = useRole()

  const hasPermission = (permission: string): boolean => {
    const rolePermissions = {
      owner: ["read", "write", "delete", "admin", "user-management"],
      expert: ["read", "write", "session-management"],
      client: ["read", "booking"]
    }

    return rolePermissions[role]?.includes(permission) ?? false
  }

  const canAccess = (feature: string): boolean => {
    const featureRoles: Record<string, Role[]> = {
      "admin-panel": ["owner"],
      "session-creation": ["owner", "expert"],
      "user-profile": ["owner", "expert", "client"],
      "booking": ["owner", "expert", "client"]
    }

    return featureRoles[feature]?.includes(role) ?? false
  }

  return {
    hasPermission,
    canAccess,
    role,
    isOwner: role === "owner",
    isExpert: role === "expert",
    isClient: role === "client"
  }
} 