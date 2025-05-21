import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType =
  // Session statuses
  | "upcoming"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "recording"
  // Invoice statuses
  | "paid"
  | "pending"
  | "overdue"
  | "draft"
  // User statuses
  | "active"
  | "invited"
  | "suspended"
  | "inactive"

interface StatusConfig {
  color: string
  label?: string
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  // Session statuses
  upcoming: { color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  "in-progress": { color: "bg-green-100 text-green-800 hover:bg-green-200" },
  completed: { color: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
  cancelled: { color: "bg-red-100 text-red-800 hover:bg-red-200" },
  recording: { color: "bg-amber-100 text-amber-800 hover:bg-amber-200" },

  // Invoice statuses
  paid: { color: "bg-green-100 text-green-800 hover:bg-green-200" },
  pending: { color: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
  overdue: { color: "bg-red-100 text-red-800 hover:bg-red-200" },
  draft: { color: "bg-gray-100 text-gray-800 hover:bg-gray-200" },

  // User statuses
  active: { color: "bg-green-100 text-green-800 hover:bg-green-200" },
  invited: { color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  suspended: { color: "bg-red-100 text-red-800 hover:bg-red-200" },
  inactive: { color: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
}

interface StatusBadgeProps {
  status: StatusType
  size?: "sm" | "md" | "lg"
  className?: string
  customLabel?: string
}

export function StatusBadge({ status, size = "md", className, customLabel }: StatusBadgeProps) {
  const config = statusConfigs[status] || { color: "bg-gray-100 text-gray-800 hover:bg-gray-200" }

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "px-2.5 py-1",
  }

  const formattedStatus = customLabel || status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")

  return (
    <Badge variant="outline" className={cn(config.color, sizeClasses[size], "font-medium", className)}>
      {formattedStatus}
    </Badge>
  )
}
