"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationBadge } from "@/components/ui/notification-badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "New Session Request",
    message: "You have a new session request from John Doe",
    time: "5 minutes ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Session Reminder",
    message: "Your session with Jane Smith starts in 30 minutes",
    time: "30 minutes ago",
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Payment Received",
    message: "You received a payment of $150 for your last session",
    time: "2 hours ago",
    read: true,
    type: "success",
  },
]

export function NotificationBell() {
  const [notifications, setNotifications] = React.useState<Notification[]>(dummyNotifications)
  const [open, setOpen] = React.useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            <div>
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={cn("p-4 cursor-pointer hover:bg-gray-50", !notification.read && "bg-gray-50")}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <NotificationBadge type={notification.type} size="sm" showIcon className="mt-0.5">
                      {notification.type}
                    </NotificationBadge>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                  {index < notifications.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
