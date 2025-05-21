"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { UserTable } from "@/components/access-control/user-table"
import { AddUserDialog } from "@/components/access-control/add-user-dialog"
import { UserFilter } from "@/components/access-control/user-filter"
import { RolesPermissions } from "@/components/access-control/roles-permissions"
import { mockUsers, mockRoles, type User, type RolePerm } from "@/lib/mock-access"
import { ImportUsersDialog } from "@/components/access-control/import-users-dialog"
import { ExportUsersDialog } from "@/components/access-control/export-users-dialog"
import { CSVTemplateDialog } from "@/components/access-control/csv-template-dialog"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { v4 as uuidv4 } from "uuid"
import { ImportExportSection } from "@/components/access-control/import-export-section"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AccessControlPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<RolePerm[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ role: "all", status: "all" })

  // Initialize data after component mounts to prevent hydration issues
  useEffect(() => {
    setUsers(mockUsers)
    setRoles(mockRoles)
  }, [])

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRoleFilter = filters.role === "all" || user.role === filters.role

    const matchesStatusFilter = filters.status === "all" || user.status === filters.status

    return matchesSearch && matchesRoleFilter && matchesStatusFilter
  })

  const handleImportUsers = (newUsers: Partial<User>[]) => {
    const usersToAdd = newUsers.map((userData) => ({
      id: uuidv4(),
      name: userData.name || userData.email?.split("@")[0] || "User",
      email: userData.email || "",
      role: userData.role || "client",
      status: userData.status || "invited",
      avatarUrl: `/placeholder.svg?height=40&width=40&query=${userData.name?.substring(0, 2).toUpperCase() || userData.email?.substring(0, 2).toUpperCase() || "US"}`,
    }))

    setUsers([...users, ...usersToAdd])
  }

  const handleAddUser = (userData: { email: string; role: string; workspaces: string[] }) => {
    const newUser: User = {
      id: uuidv4(),
      name: userData.email.split("@")[0], // Generate a name from email
      email: userData.email,
      role: userData.role,
      status: "invited",
      workspaces: userData.workspaces,
      avatarUrl: `/placeholder.svg?height=40&width=40&query=${userData.email.substring(0, 2).toUpperCase()}`,
    }

    setUsers([...users, newUser])
  }

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, ...updates } : user)))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleUpdateRole = (roleId: string, permissions: Record<string, boolean>) => {
    setRoles(roles.map((role) => (role.id === roleId ? { ...role, permissions } : role)))
  }

  return (
    <PermissionGuard allowedRoles={["owner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Access Control</h1>
          <p className="text-muted-foreground mt-1">Manage users, roles, and permissions.</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="users" className="rounded-md">
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-md">
              Roles & Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 mt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <UserFilter onFilterChange={setFilters} />
                <div className="flex items-center gap-2">
                  <ImportUsersDialog onImportUsers={handleImportUsers} />
                  <ExportUsersDialog users={users} />
                  <CSVTemplateDialog />
                </div>
                <AddUserDialog onAddUser={handleAddUser} />
              </div>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <h2 className="text-xl font-semibold">User Management</h2>
                <p className="text-muted-foreground">Manage users and their access levels.</p>
              </div>
              <UserTable users={filteredUsers} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} />

              <div className="mt-6 p-6 border-t">
                <ImportExportSection users={users} onImportUsers={handleImportUsers} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <div className="rounded-lg border bg-card p-6">
              <RolesPermissions roles={roles} onUpdateRole={handleUpdateRole} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}
