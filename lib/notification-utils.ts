import type { Notification, NotificationType } from "@/lib/types"
import { Info, AlertTriangle, CheckCircle, X } from "lucide-react"

export function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "info":
      return Info
    case "warning":
      return AlertTriangle
    case "success":
      return CheckCircle
    case "error":
      return X
    default:
      return Info
  }
}

export function getNotificationStyles(type: NotificationType) {
  switch (type) {
    case "info":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        icon: "text-blue-500",
        hover: "hover:bg-blue-50",
      }
    case "warning":
      return {
        bg: "bg-amber-100",
        text: "text-amber-600",
        icon: "text-amber-500",
        hover: "hover:bg-amber-50",
      }
    case "success":
      return {
        bg: "bg-green-100",
        text: "text-green-600",
        icon: "text-green-500",
        hover: "hover:bg-green-50",
      }
    case "error":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        icon: "text-red-500",
        hover: "hover:bg-red-50",
      }
    default:
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        icon: "text-blue-500",
        hover: "hover:bg-blue-50",
      }
  }
}

export function sortNotificationsByDate(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.time).getTime()
    const dateB = new Date(b.time).getTime()
    return dateB - dateA // Sort in descending order (newest first)
  })
}

export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  const sorted = sortNotificationsByDate(notifications)
  const grouped: Record<string, Notification[]> = {}

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  sorted.forEach((notification) => {
    const notificationDate = new Date(notification.time)

    let group = "Older"

    if (notificationDate >= today) {
      group = "Today"
    } else if (notificationDate >= yesterday) {
      group = "Yesterday"
    } else if (notificationDate >= lastWeek) {
      group = "This Week"
    }

    if (!grouped[group]) {
      grouped[group] = []
    }

    grouped[group].push(notification)
  })

  return grouped
}
