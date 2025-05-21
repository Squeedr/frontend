"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationItem } from "@/components/notification-item"
import { Bell } from "lucide-react"
import { groupNotificationsByDate } from "@/lib/notification-utils"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, dismissNotification } = useNotifications()

  const groupedNotifications = groupNotificationsByDate(notifications)
  const hasNotifications = notifications.length > 0

  return (
    <div className="space-y-6">
      <PageHeader title="Your Notifications" description="Manage your alerts and notifications">
        {hasNotifications && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </PageHeader>

      <div className="space-y-6">
        {hasNotifications ? (
          Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
            <div key={group} className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">{group}</h3>
              <Card>
                <div className="divide-y">
                  {groupNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      id={notification.id}
                      type={
                        notification.type === "info" ||
                        notification.type === "warning" ||
                        notification.type === "success" ||
                        notification.type === "error"
                          ? notification.type
                          : "info"
                      }
                      title={notification.title}
                      description={notification.message}
                      timestamp={new Date(notification.time)}
                      read={notification.read}
                      onMarkAsRead={markAsRead}
                      onDelete={dismissNotification}
                    />
                  ))}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-gray-500 mt-1">You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
