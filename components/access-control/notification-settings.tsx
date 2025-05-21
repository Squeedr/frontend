"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    newRequests: true,
    approvedRequests: true,
    deniedRequests: true,
    weeklyDigest: false,
    browserNotifications: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    })
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure how you receive permission-related notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-requests">New Permission Requests</Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when someone submits a new permission request
                </p>
              </div>
              <Switch
                id="new-requests"
                checked={settings.newRequests}
                onCheckedChange={() => handleToggle("newRequests")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="approved-requests">Approved Requests</Label>
                <p className="text-sm text-muted-foreground">
                  Receive an email when your permission request is approved
                </p>
              </div>
              <Switch
                id="approved-requests"
                checked={settings.approvedRequests}
                onCheckedChange={() => handleToggle("approvedRequests")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="denied-requests">Denied Requests</Label>
                <p className="text-sm text-muted-foreground">Receive an email when your permission request is denied</p>
              </div>
              <Switch
                id="denied-requests"
                checked={settings.deniedRequests}
                onCheckedChange={() => handleToggle("deniedRequests")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a weekly summary of all permission activity</p>
              </div>
              <Switch
                id="weekly-digest"
                checked={settings.weeklyDigest}
                onCheckedChange={() => handleToggle("weeklyDigest")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Browser Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">In-app Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications for permission-related activities
                </p>
              </div>
              <Switch
                id="browser-notifications"
                checked={settings.browserNotifications}
                onCheckedChange={() => handleToggle("browserNotifications")}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  )
}
