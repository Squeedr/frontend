"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, Clock, FileText, MessageSquare, Star, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface NotificationItemProps {
  id: string
  type: "message" | "reminder" | "system" | "invoice" | "review"
  title: string
  description: string
  timestamp: Date
  read: boolean
  sender?: {
    name: string
    avatar?: string
    initials: string
  }
  actions?: {
    primary?: {
      label: string
      onClick: () => void
    }
    secondary?: {
      label: string
      onClick: () => void
    }
  }
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

export function NotificationItem({
  id,
  type,
  title,
  description,
  timestamp,
  read,
  sender,
  actions,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [isRead, setIsRead] = useState(read)

  const handleMarkAsRead = () => {
    setIsRead(true)
    if (onMarkAsRead) {
      onMarkAsRead(id)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id)
    }
  }

  const getIcon = () => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "reminder":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "system":
        return <Bell className="h-4 w-4 text-purple-500" />
      case "invoice":
        return <FileText className="h-4 w-4 text-green-500" />
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card className={cn("transition-all duration-200", !isRead && "border-l-4 border-l-primary bg-muted/20")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {sender ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
              <AvatarFallback>{sender.initials}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">{getIcon()}</div>
          )}

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium leading-none">{title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {typeof timestamp === "string"
                      ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
                      : formatDistanceToNow(timestamp, { addSuffix: true })}
                  </span>
                  {!isRead && (
                    <Badge variant="outline" className="px-1 py-0 text-xs">
                      New
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isRead && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMarkAsRead}>
                    <Check className="h-3 w-3" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDelete}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>

      {actions && (
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          {actions.secondary && (
            <Button variant="outline" size="sm" onClick={actions.secondary.onClick}>
              {actions.secondary.label}
            </Button>
          )}
          {actions.primary && (
            <Button size="sm" onClick={actions.primary.onClick}>
              {actions.primary.label}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
