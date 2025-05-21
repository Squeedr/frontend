import type React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Info, AlertTriangle, CheckCircle, X } from "lucide-react"

export type NotificationType = "info" | "warning" | "success" | "error"

interface NotificationBadgeProps {
  type: NotificationType
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
  children: React.ReactNode
}

export function NotificationBadge({ type, size = "md", showIcon = true, className, children }: NotificationBadgeProps) {
  const typeConfig = {
    info: {
      color: "bg-blue-100 text-blue-800 border-blue-300",
      icon: Info,
    },
    warning: {
      color: "bg-amber-100 text-amber-800 border-amber-300",
      icon: AlertTriangle,
    },
    success: {
      color: "bg-green-100 text-green-800 border-green-300",
      icon: CheckCircle,
    },
    error: {
      color: "bg-red-100 text-red-800 border-red-300",
      icon: X,
    },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "px-2.5 py-1",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <Badge variant="outline" className={cn(config.color, sizeClasses[size], "font-medium", className)}>
      {showIcon && <Icon className={cn(iconSizes[size], "mr-1")} />}
      {children}
    </Badge>
  )
}
