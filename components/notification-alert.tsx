"use client"

import * as React from "react"
import { Bell, Check, Filter, MessageSquare, Calendar, Settings, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { format, subHours, subMinutes, subDays } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRole } from "@/hooks/use-role"
import { cn } from "@/lib/utils"

// Notification type definition
interface Notification {
  id: string
  title: string
  message: string
  time: Date
  read: boolean
  type: "system" | "session" | "message" | "alert"
  priority: "low" | "medium" | "high"
}

// Generate mock notifications
const generateMockNotifications = (role: string): Notification[] => {
  const now = new Date()
  const notifications: Notification[] = []

  // Different notifications based on role
  if (role === "owner") {
    notifications.push(
      {
        id: "1",
        title: "New Expert Joined",
        message: "Dr. Sarah Johnson has joined as an expert. Review their profile.",
        time: subHours(now, 1),
        read: false,
        type: "system",
        priority: "medium",
      },
      {
        id: "2",
        title: "Billing Update",
        message: "Monthly subscription payment processed successfully.",
        time: subHours(now, 3),
        read: false,
        type: "system",
        priority: "low",
      },
      {
        id: "3",
        title: "Permission Request",
        message: "Michael Chen requested access to client reports.",
        time: subHours(now, 5),
        read: true,
        type: "alert",
        priority: "high",
      },
      {
        id: "4",
        title: "System Maintenance",
        message: "Scheduled maintenance in 24 hours. No downtime expected.",
        time: subDays(now, 1),
        read: true,
        type: "system",
        priority: "medium",
      },
    )
  } else if (role === "expert") {
    notifications.push(
      {
        id: "1",
        title: "New Session Request",
        message: "Alex Morgan requested a session for tomorrow at 2:00 PM.",
        time: subMinutes(now, 30),
        read: false,
        type: "session",
        priority: "high",
      },
      {
        id: "2",
        title: "Session Reminder",
        message: "Your session with Jamie Lee starts in 1 hour.",
        time: subHours(now, 2),
        read: false,
        type: "session",
        priority: "high",
      },
      {
        id: "3",
        title: "New Message",
        message: "You have a new message from Taylor Swift.",
        time: subHours(now, 4),
        read: true,
        type: "message",
        priority: "medium",
      },
      {
        id: "4",
        title: "Payment Received",
        message: "You received a payment of $150 for your last session.",
        time: subDays(now, 1),
        read: true,
        type: "system",
        priority: "low",
      },
    )
  } else {
    // client
    notifications.push(
      {
        id: "1",
        title: "Session Confirmed",
        message: "Your session with Dr. Emily Chen has been confirmed.",
        time: subHours(now, 1),
        read: false,
        type: "session",
        priority: "medium",
      },
      {
        id: "2",
        title: "Session Reminder",
        message: "Your session with Prof. James Wilson starts in 30 minutes.",
        time: subHours(now, 2),
        read: false,
        type: "session",
        priority: "high",
      },
      {
        id: "3",
        title: "New Message",
        message: "You have a new message from Coach Sarah Smith.",
        time: subDays(now, 1),
        read: true,
        type: "message",
        priority: "medium",
      },
    )
  }

  // Sort by time (newest first) and then by priority
  return notifications.sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1
    if (a.priority !== "high" && b.priority === "high") return 1
    return b.time.getTime() - a.time.getTime()
  })
}

export function NotificationAlert() {
  const { role } = useRole()
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [activeTab, setActiveTab] = React.useState("all")
  const [filters, setFilters] = React.useState({
    system: true,
    session: true,
    message: true,
    alert: true,
  })

  React.useEffect(() => {
    // Generate mock notifications when role changes
    setNotifications(generateMockNotifications(role))
  }, [role])

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread" && n.read) return false
    return filters[n.type]
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  // Format time for display
  const formatNotificationTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  // Get notification icon
  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case "system":
        return <Info className={cn("h-4 w-4", priority === "high" ? "text-blue-600" : "text-gray-500")} />
      case "session":
        return <Calendar className={cn("h-4 w-4", priority === "high" ? "text-green-600" : "text-gray-500")} />
      case "message":
        return <MessageSquare className={cn("h-4 w-4", priority === "high" ? "text-purple-600" : "text-gray-500")} />
      case "alert":
        return <AlertTriangle className={cn("h-4 w-4", priority === "high" ? "text-red-600" : "text-gray-500")} />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  // Toggle filter
  const toggleFilter = (type: keyof typeof filters) => {
    setFilters({ ...filters, [type]: !filters[type] })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "No new notifications"}
            </p>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={filters.system} onCheckedChange={() => toggleFilter("system")}>
                  System
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={filters.session} onCheckedChange={() => toggleFilter("session")}>
                  Sessions
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={filters.message} onCheckedChange={() => toggleFilter("message")}>
                  Messages
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={filters.alert} onCheckedChange={() => toggleFilter("alert")}>
                  Alerts
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[350px] overflow-y-auto py-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-4">
                <CheckCircle className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  {activeTab === "unread" ? "No unread notifications" : "No notifications match your filters"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} asChild>
                    <div
                      className={cn(
                        "cursor-pointer p-2 hover:bg-gray-50 rounded-md relative",
                        !notification.read && "bg-blue-50/50",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      {!notification.read && (
                        <span className="absolute left-2 top-3 h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      <div className="flex gap-3 pl-3">
                        <div
                          className={cn(
                            "mt-0.5 rounded-full p-1.5",
                            notification.type === "system" && "bg-blue-100",
                            notification.type === "session" && "bg-green-100",
                            notification.type === "message" && "bg-purple-100",
                            notification.type === "alert" && "bg-red-100",
                          )}
                        >
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{formatNotificationTime(notification.time)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          {notification.priority === "high" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs mt-1.5">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </div>
        </Tabs>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant="ghost" className="w-full justify-between" asChild>
            <a href="/dashboard/notifications">
              View all notifications
              <Settings className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
