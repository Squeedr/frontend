"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"

interface UserFilterProps {
  onFilterChange: (filters: {
    role: string
    status: string
  }) => void
}

export function UserFilter({ onFilterChange }: UserFilterProps) {
  const handleRoleChange = (role: string) => {
    onFilterChange({ role, status: "all" })
  }

  const handleStatusChange = (status: string) => {
    onFilterChange({ role: "all", status })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">Filter users by role or status</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role-filter">Role</Label>
            <Select onValueChange={handleRoleChange} defaultValue="all">
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select onValueChange={handleStatusChange} defaultValue="all">
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => onFilterChange({ role: "all", status: "all" })}>Reset Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
