"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { PermissionGuard } from "@/components/guards/permission-guard"
import {
  type Permission,
  type PermissionCategory,
  getAllPermissions,
  getPermissionName,
  getPermissionsForRole,
} from "@/lib/permissions"
import type { UserRole } from "@/lib/types"
import { usePermissions } from "@/hooks/permissions-provider"
import { Shield, AlertTriangle, Info, CheckCircle2 } from "lucide-react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("owner")
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([])
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [groupedPermissions, setGroupedPermissions] = useState<Record<PermissionCategory, Permission[]>>({} as any)
  const { toast } = useToast()
  const { checkPermission } = usePermissions()

  // Create refs for checkboxes that need indeterminate state
  const checkboxRefs = useRef<Record<string, React.ElementRef<typeof CheckboxPrimitive.Root> | null>>({})

  useEffect(() => {
    // Get all available permissions
    const permissions = getAllPermissions()
    setAllPermissions(permissions)

    // Group permissions by category
    const grouped = permissions.reduce(
      (acc, permission) => {
        const [category] = permission.split(":") as [PermissionCategory, string]
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(permission)
        return acc
      },
      {} as Record<PermissionCategory, Permission[]>,
    )

    setGroupedPermissions(grouped)

    // Set initial role permissions
    setRolePermissions(getPermissionsForRole(selectedRole))
  }, [selectedRole])

  // Update indeterminate state for checkboxes
  useEffect(() => {
    Object.keys(groupedPermissions).forEach((category) => {
      const ref = checkboxRefs.current[`category-${category}`]
      if (ref) {
        // Instead of using indeterminate property, we'll use a data attribute
        const isIndeterminate = isCategoryIndeterminate(category as PermissionCategory)
        ref.setAttribute('data-indeterminate', isIndeterminate.toString())
      }
    })
  }, [rolePermissions, groupedPermissions])

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setRolePermissions(getPermissionsForRole(role))
  }

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    if (checked) {
      setRolePermissions([...rolePermissions, permission])
    } else {
      setRolePermissions(rolePermissions.filter((p) => p !== permission))
    }
  }

  const handleSavePermissions = () => {
    // In a real app, you would save these permissions to your backend
    toast({
      title: "Permissions updated",
      description: `Permissions for ${selectedRole} role have been updated.`,
    })
  }

  const handleCategoryToggle = (category: PermissionCategory, checked: boolean) => {
    const categoryPermissions = groupedPermissions[category] || []

    if (checked) {
      // Add all permissions for this category
      const newPermissions = [...rolePermissions]
      categoryPermissions.forEach((permission) => {
        if (!newPermissions.includes(permission)) {
          newPermissions.push(permission)
        }
      })
      setRolePermissions(newPermissions)
    } else {
      // Remove all permissions for this category
      setRolePermissions(rolePermissions.filter((p) => !categoryPermissions.includes(p)))
    }
  }

  const isCategoryChecked = (category: PermissionCategory): boolean => {
    const categoryPermissions = groupedPermissions[category] || []
    return categoryPermissions.every((permission) => rolePermissions.includes(permission))
  }

  const isCategoryIndeterminate = (category: PermissionCategory): boolean => {
    const categoryPermissions = groupedPermissions[category] || []
    const hasAny = categoryPermissions.some((permission) => rolePermissions.includes(permission))
    const hasAll = categoryPermissions.every((permission) => rolePermissions.includes(permission))
    return hasAny && !hasAll
  }

  const filteredCategories = Object.keys(groupedPermissions).filter((category) => {
    if (!searchQuery) return true

    // Check if category name matches search
    if (category.toLowerCase().includes(searchQuery.toLowerCase())) return true

    // Check if any permission in this category matches search
    return groupedPermissions[category as PermissionCategory].some((permission) =>
      getPermissionName(permission).toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }) as PermissionCategory[]

  return (
    <PermissionGuard requiredPermission="roles:view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Permissions Management</h1>
            <p className="text-muted-foreground mt-1">Configure role-based permissions for your organization</p>
          </div>

          {checkPermission("roles:edit") && <Button onClick={handleSavePermissions}>Save Changes</Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Roles</span>
              </CardTitle>
              <CardDescription>Select a role to manage its permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedRole === "owner" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleRoleSelect("owner")}
                >
                  <Badge variant="outline" className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Owner
                  </Badge>
                  <span>Full access</span>
                </Button>
                <Button
                  variant={selectedRole === "expert" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleRoleSelect("expert")}
                >
                  <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">
                    Expert
                  </Badge>
                  <span>Limited access</span>
                </Button>
                <Button
                  variant={selectedRole === "client" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleRoleSelect("client")}
                >
                  <Badge variant="outline" className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                    Client
                  </Badge>
                  <span>Basic access</span>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-2">Role Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Active Permissions</p>
                      <p className="text-muted-foreground">{rolePermissions.length} permissions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Access Level</p>
                      <p className="text-muted-foreground">
                        {selectedRole === "owner"
                          ? "Full system access"
                          : selectedRole === "expert"
                            ? "Operational access"
                            : "Basic user access"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Restrictions</p>
                      <p className="text-muted-foreground">
                        {selectedRole === "owner"
                          ? "None"
                          : selectedRole === "expert"
                            ? "Limited administrative functions"
                            : "View-only for most sections"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Permissions for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Role</CardTitle>
              <CardDescription>Configure which actions this role can perform</CardDescription>
              <div className="mt-2">
                <Input
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="categories">
                <TabsList className="mb-4">
                  <TabsTrigger value="categories">By Category</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category} className="border rounded-md p-4">
                      <div className="flex items-center mb-4">
                        <Checkbox
                          id={`category-${category}`}
                          ref={(el) => {
                            checkboxRefs.current[`category-${category}`] = el
                          }}
                          checked={isCategoryChecked(category)}
                          onCheckedChange={(checked) => handleCategoryToggle(category, !!checked)}
                          disabled={!checkPermission("roles:edit")}
                        />
                        <Label htmlFor={`category-${category}`} className="ml-2 text-lg font-medium">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                        {groupedPermissions[category].map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={rolePermissions.includes(permission)}
                              onCheckedChange={(checked) => handlePermissionToggle(permission, !!checked)}
                              disabled={!checkPermission("roles:edit")}
                            />
                            <Label htmlFor={permission} className="text-sm">
                              {getPermissionName(permission)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="list">
                  <div className="border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                      {allPermissions
                        .filter(
                          (permission) =>
                            !searchQuery ||
                            getPermissionName(permission).toLowerCase().includes(searchQuery.toLowerCase()),
                        )
                        .map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={`list-${permission}`}
                              checked={rolePermissions.includes(permission)}
                              onCheckedChange={(checked) => handlePermissionToggle(permission, !!checked)}
                              disabled={!checkPermission("roles:edit")}
                            />
                            <Label htmlFor={`list-${permission}`} className="text-sm">
                              {getPermissionName(permission)}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {checkPermission("roles:edit") && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSavePermissions}>Save Changes</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}
