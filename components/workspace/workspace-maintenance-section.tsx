"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus, PenToolIcon as Tool, Clock, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MaintenanceTask } from "@/lib/maintenance-types"
import { getWorkspaceMaintenanceTasks } from "@/lib/mock-maintenance-data"
import { MaintenanceDetailsDialog } from "./maintenance-details-dialog"
import { ScheduleMaintenanceDialog } from "./schedule-maintenance-dialog"

interface WorkspaceMaintenanceSectionProps {
  workspaceId: string
  workspaceName: string
  onStatusChange: (taskId: string, newStatus: string) => void
  onSchedule: (data: any) => void
  technicians: { id: string; name: string }[]
}

export function WorkspaceMaintenanceSection({
  workspaceId,
  workspaceName,
  onStatusChange,
  onSchedule,
  technicians,
}: WorkspaceMaintenanceSectionProps) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])

  useEffect(() => {
    // Get maintenance tasks for this workspace
    const workspaceTasks = getWorkspaceMaintenanceTasks(workspaceId)
    setTasks(workspaceTasks)
  }, [workspaceId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cleaning":
        return "🧹"
      case "repair":
        return "🔧"
      case "inspection":
        return "🔍"
      case "upgrade":
        return "⬆️"
      case "furniture":
        return "🪑"
      case "technology":
        return "💻"
      case "plumbing":
        return "🚿"
      case "electrical":
        return "⚡"
      case "hvac":
        return "❄️"
      default:
        return "🔧"
    }
  }

  const upcomingTasks = tasks.filter(
    (task) =>
      (task.status === "scheduled" || task.status === "in-progress") && new Date(task.scheduledDate) >= new Date(),
  )

  const pastTasks = tasks.filter(
    (task) =>
      task.status === "completed" ||
      task.status === "cancelled" ||
      (task.status === "scheduled" && new Date(task.scheduledDate) < new Date()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Maintenance</CardTitle>
        <ScheduleMaintenanceDialog
          workspaces={[{ id: workspaceId, name: workspaceName }]}
          technicians={technicians}
          onSchedule={onSchedule}
          trigger={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🔧</div>
            <p className="text-muted-foreground mb-4">No maintenance tasks scheduled</p>
            <ScheduleMaintenanceDialog
              workspaces={[{ id: workspaceId, name: workspaceName }]}
              technicians={technicians}
              onSchedule={onSchedule}
              trigger={
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule First Maintenance
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Upcoming & Active Maintenance</h3>
              {upcomingTasks.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-start justify-between border rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="text-xl mt-1">{getTypeIcon(task.type)}</div>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(task.scheduledDate), "MMM d, yyyy")}
                            </div>
                            <div className="flex items-center text-sm mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{task.estimatedDuration} hours</span>
                              <Tool className="h-3 w-3 ml-3 mr-1 text-muted-foreground" />
                              <span>{task.type.charAt(0).toUpperCase() + task.type.slice(1)}</span>
                            </div>
                            {task.assigneeName && (
                              <div className="flex items-center mt-1">
                                <Avatar className="h-4 w-4 mr-1">
                                  <AvatarFallback>{task.assigneeName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{task.assigneeName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                          <MaintenanceDetailsDialog
                            task={task}
                            onStatusChange={onStatusChange}
                            trigger={
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                Details
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">No upcoming maintenance tasks</div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Past Maintenance</h3>
              {pastTasks.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-4">
                    {pastTasks.map((task) => (
                      <div key={task.id} className="flex items-start justify-between border rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="text-xl mt-1">{getTypeIcon(task.type)}</div>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(task.scheduledDate), "MMM d, yyyy")}
                            </div>
                            {task.status === "scheduled" && new Date(task.scheduledDate) < new Date() && (
                              <div className="flex items-center text-red-600 text-xs mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Past scheduled date
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                          <MaintenanceDetailsDialog
                            task={task}
                            onStatusChange={onStatusChange}
                            trigger={
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                Details
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">No past maintenance records</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
