"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, Calendar, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { useToast } from "@/hooks/use-toast"
import { MaintenanceCard } from "@/components/maintenance/maintenance-card"
import { ScheduleMaintenanceDialog } from "@/components/maintenance/schedule-maintenance-dialog"
import type { MaintenanceTask } from "@/lib/maintenance-types"
import { maintenanceTasks } from "@/lib/mock-maintenance-data"
import { v4 as uuidv4 } from "uuid"

// Mock workspaces data
const workspaces = [
  { id: "ws1", name: "Conference Room A" },
  { id: "ws2", name: "Meeting Room B" },
  { id: "ws3", name: "Quiet Office" },
  { id: "ws4", name: "Collaboration Space" },
  { id: "ws5", name: "Open Workspace" },
  { id: "ws6", name: "Executive Office" },
]

// Mock technicians data
const technicians = [
  { id: "tech1", name: "Alex Johnson" },
  { id: "tech2", name: "Sarah Williams" },
  { id: "tech3", name: "Network Solutions Team" },
  { id: "elec1", name: "Electrical Maintenance Team" },
  { id: "plumb1", name: "Plumbing Services" },
  { id: "clean1", name: "Cleaning Services Inc." },
  { id: "furn1", name: "Modern Office Supplies" },
  { id: "safety1", name: "Fire Safety Inspector" },
]

export default function MaintenanceManagementPage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [filteredTasks, setFilteredTasks] = useState<MaintenanceTask[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with mock data
    setTasks(maintenanceTasks)
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...tasks]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.workspaceName.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((task) => task.type === typeFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Filter by tab
    if (activeTab === "upcoming") {
      filtered = filtered.filter((task) => task.status === "scheduled" && new Date(task.scheduledDate) >= new Date())
    } else if (activeTab === "active") {
      filtered = filtered.filter((task) => task.status === "in-progress")
    } else if (activeTab === "completed") {
      filtered = filtered.filter((task) => task.status === "completed")
    } else if (activeTab === "overdue") {
      filtered = filtered.filter(
        (task) =>
          task.status === "overdue" || (task.status === "scheduled" && new Date(task.scheduledDate) < new Date()),
      )
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, statusFilter, typeFilter, priorityFilter, activeTab])

  const handleScheduleMaintenance = (data: any) => {
    const newTask: MaintenanceTask = {
      id: uuidv4(),
      workspaceId: data.workspaceId,
      workspaceName: workspaces.find((w) => w.id === data.workspaceId)?.name || "",
      title: data.title,
      description: data.description,
      type: data.type as any,
      priority: data.priority as any,
      status: "scheduled",
      scheduledDate: data.scheduledDate.toISOString(),
      estimatedDuration: data.estimatedDuration,
      assignedTo: data.assignedTo,
      assigneeName: technicians.find((t) => t.id === data.assignedTo)?.name,
      createdBy: "owner1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: data.notes,
      recurrence: data.recurrence as any,
      affectsAvailability: data.affectsAvailability,
    }

    setTasks((prev) => [newTask, ...prev])

    toast({
      title: "Maintenance Scheduled",
      description: `${data.title} has been scheduled for ${workspaces.find((w) => w.id === data.workspaceId)?.name}.`,
    })
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus as any,
              updatedAt: new Date().toISOString(),
              completedAt: newStatus === "completed" ? new Date().toISOString() : task.completedAt,
            }
          : task,
      ),
    )
  }

  const getMaintenanceStats = () => {
    const upcoming = tasks.filter(
      (task) => task.status === "scheduled" && new Date(task.scheduledDate) >= new Date(),
    ).length
    const active = tasks.filter((task) => task.status === "in-progress").length
    const completed = tasks.filter((task) => task.status === "completed").length
    const overdue = tasks.filter(
      (task) => task.status === "overdue" || (task.status === "scheduled" && new Date(task.scheduledDate) < new Date()),
    ).length

    return { upcoming, active, completed, overdue }
  }

  const stats = getMaintenanceStats()

  return (
    <PermissionGuard allowedRoles={["owner"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Management</h1>
            <p className="text-muted-foreground mt-1">Schedule and track maintenance for all workspaces</p>
          </div>
          <ScheduleMaintenanceDialog
            workspaces={workspaces}
            technicians={technicians}
            onSchedule={handleScheduleMaintenance}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <p className="text-xs text-muted-foreground">Scheduled maintenance tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">🔧</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently active maintenance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully completed tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">⚠️</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">Maintenance tasks past due date</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search maintenance tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredTasks.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <MaintenanceCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No maintenance tasks found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {activeTab === "all"
                    ? "There are no maintenance tasks matching your filters."
                    : activeTab === "upcoming"
                      ? "There are no upcoming maintenance tasks scheduled."
                      : activeTab === "active"
                        ? "There are no maintenance tasks currently in progress."
                        : activeTab === "completed"
                          ? "There are no completed maintenance tasks."
                          : "There are no overdue maintenance tasks."}
                </p>
                <ScheduleMaintenanceDialog
                  workspaces={workspaces}
                  technicians={technicians}
                  onSchedule={handleScheduleMaintenance}
                  trigger={
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule New Maintenance
                    </Button>
                  }
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}
