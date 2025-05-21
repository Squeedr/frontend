"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"

// Define the notification type
export type Notification = {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  time: string
}

// Define the context type
type NotificationsContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read" | "time">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismissNotification: (id: string) => void
  clearAllNotifications: () => void
}

// Create the context
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Sample notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New session booked",
    message: "You have a new session booked with Dr. Smith on May 10th at 2:00 PM.",
    type: "info",
    read: false,
    time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    title: "Session reminder",
    message: "Your session with Dr. Johnson starts in 30 minutes.",
    type: "warning",
    read: false,
    time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: "3",
    title: "Payment received",
    message: "Payment of $150 for your session on April 28th has been received.",
    type: "success",
    read: false,
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "4",
    title: "Session cancelled",
    message: "Your session with Dr. Williams on May 5th has been cancelled.",
    type: "error",
    read: true,
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "5",
    title: "New message",
    message: "You have a new message from Dr. Brown regarding your upcoming session.",
    type: "info",
    read: true,
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
]

// Create the provider component
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "read" | "time">) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      time: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Dismiss a notification
  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Create the context value
  const contextValue: NotificationsContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
  }

  return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>
}

// Create the hook
export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
