import { format } from "date-fns"
import { Clock, PenToolIcon as Tool, Calendar, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MaintenanceTask } from "@/lib/maintenance-types"
import { MaintenanceDetailsDialog } from "./maintenance-details-dialog"

interface MaintenanceCardProps {
  task: MaintenanceTask
  onStatusChange: (taskId: string, newStatus: string) => void
}

export function MaintenanceCard({ task, onStatusChange }: MaintenanceCardProps) {
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

  const isOverdue =
    task.status === "overdue" || (task.status === "scheduled" && new Date(task.scheduledDate) < new Date())

  return (
    <Card className={isOverdue ? "border-red-300" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getTypeIcon(task.type)}</span>
            <CardTitle className="text-base">{task.title}</CardTitle>
          </div>
          <Badge className={getStatusColor(task.status)}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-2">{task.workspaceName}</div>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {format(new Date(task.scheduledDate), "MMM d, yyyy")}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            {task.estimatedDuration} {task.estimatedDuration === 1 ? "hour" : "hours"}
          </div>
          <div className="flex items-center">
            <Tool className="h-4 w-4 mr-2 text-muted-foreground" />
            {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
          </div>
          <div>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </div>
        {isOverdue && (
          <div className="mt-2 flex items-center text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {task.status === "overdue" ? "Overdue" : "Past scheduled date"}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src="/placeholder.svg" alt={task.assigneeName} />
            <AvatarFallback>
              {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : "NA"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assigneeName || "Unassigned"}</span>
        </div>
        <MaintenanceDetailsDialog
          task={task}
          onStatusChange={onStatusChange}
          trigger={
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          }
        />
      </CardFooter>
    </Card>
  )
}
