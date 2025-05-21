"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MaintenanceTask, MaintenanceLog } from "@/lib/maintenance-types"
import { getMaintenanceTaskLogs } from "@/lib/mock-maintenance-data"
import { useToast } from "@/hooks/use-toast"

interface MaintenanceDetailsDialogProps {
  task: MaintenanceTask
  onStatusChange: (taskId: string, newStatus: string) => void
  trigger?: React.ReactNode
}

export function MaintenanceDetailsDialog({ task, onStatusChange, trigger }: MaintenanceDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<MaintenanceLog[]>([])
  const [activeTab, setActiveTab] = useState("details")
  const { toast } = useToast()

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Fetch logs when dialog opens
      const taskLogs = getMaintenanceTaskLogs(task.id)
      setLogs(taskLogs)
    }
    setOpen(isOpen)
  }

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task.id, newStatus)
    toast({
      title: "Status Updated",
      description: `Maintenance task status changed to ${newStatus}.`,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{task.title}</span>
            <Badge className={getStatusColor(task.status)}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Maintenance for {task.workspaceName} • Scheduled for {format(new Date(task.scheduledDate), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                <p>{getTypeLabel(task.type)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Priority</h4>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                <p>{task.estimatedDuration} hours</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Recurrence</h4>
                <p>{task.recurrence ? task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1) : "None"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Affects Availability</h4>
                <p>{task.affectsAvailability ? "Yes" : "No"}</p>
              </div>
              {task.cost && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Cost</h4>
                  <p>${task.cost.toFixed(2)}</p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-sm">{task.description}</p>
            </div>

            {task.notes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                <p className="text-sm">{task.notes}</p>
              </div>
            )}

            <Separator />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h4>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={task.assigneeName} />
                  <AvatarFallback>
                    {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : "NA"}
                  </AvatarFallback>
                </Avatar>
                <span>{task.assigneeName || "Not assigned"}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between">
              {task.status !== "completed" && task.status !== "cancelled" && (
                <div className="space-x-2">
                  {task.status === "scheduled" && (
                    <Button size="sm" onClick={() => handleStatusChange("in-progress")}>
                      Start Maintenance
                    </Button>
                  )}
                  {task.status === "in-progress" && (
                    <Button size="sm" onClick={() => handleStatusChange("completed")}>
                      Mark as Completed
                    </Button>
                  )}
                  {task.status === "overdue" && (
                    <Button size="sm" onClick={() => handleStatusChange("in-progress")}>
                      Start Maintenance
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange("cancelled")}>
                    Cancel Maintenance
                  </Button>
                </div>
              )}
              {(task.status === "completed" || task.status === "cancelled") && (
                <Button size="sm" variant="outline" onClick={() => handleStatusChange("scheduled")}>
                  Reschedule
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{log.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{log.userName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(new Date(log.timestamp), "PPp")}</span>
                      </div>
                      <p className="text-sm">{log.action}</p>
                      {log.statusChange && (
                        <div className="text-xs">
                          Status changed from{" "}
                          <Badge variant="outline" className="text-xs">
                            {log.statusChange.from}
                          </Badge>{" "}
                          to{" "}
                          <Badge variant="outline" className="text-xs">
                            {log.statusChange.to}
                          </Badge>
                        </div>
                      )}
                      {log.notes && <p className="text-xs italic">{log.notes}</p>}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No history records available</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
