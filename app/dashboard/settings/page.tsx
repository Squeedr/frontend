"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RoleSpecificSettings } from "@/components/role-specific-settings"
import { useRole } from "@/hooks/use-role"
import { Bell, Info, Shield, User, Zap } from "lucide-react"
import { getAvatarImage } from "@/lib/image-utils"

export default function SettingsPage() {
  const { role } = useRole()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [sessionReminders, setSessionReminders] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [language, setLanguage] = useState("english")
  const [timezone, setTimezone] = useState("utc")
  const [dateFormat, setDateFormat] = useState("mm/dd/yyyy")
  const [timeFormat, setTimeFormat] = useState("12h")

  const handleSaveNotifications = () => {
    // Simulate saving notification settings
    console.log("Saving notification settings:", {
      emailNotifications,
      marketingEmails,
      securityAlerts,
      sessionReminders,
    })
    // In a real app, you would call an API here
  }

  const handleSaveAppearance = () => {
    // Simulate saving appearance settings
    console.log("Saving appearance settings:", {
      darkMode,
      compactMode,
      highContrastMode,
      animationsEnabled,
    })
    // In a real app, you would call an API here
  }

  const handleSaveSecurity = () => {
    // Simulate saving security settings
    console.log("Saving security settings:", {
      twoFactorEnabled,
      sessionTimeout,
    })
    // In a real app, you would call an API here
  }

  const handleSavePreferences = () => {
    // Simulate saving preferences
    console.log("Saving preferences:", {
      language,
      timezone,
      dateFormat,
      timeFormat,
    })
    // In a real app, you would call an API here
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={getAvatarImage("diverse-avatars.png")} alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">john.doe@example.com</span>
            </div>
          </div>
        </div>
        <Button>Change Avatar</Button>
      </div>

      <Tabs defaultValue="notifications" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline-block">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline-block">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline-block">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline-block">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Notification Settings</AlertTitle>
            <AlertDescription>Configure how you want to receive notifications and alerts.</AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage your email notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>All email notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">Receive emails for all activity</span>
                </Label>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                  <span>Marketing emails</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </span>
                </Label>
                <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="security-alerts" className="flex flex-col space-y-1">
                  <span>Security alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive emails for suspicious activity and security concerns
                  </span>
                </Label>
                <Switch id="security-alerts" checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="session-reminders" className="flex flex-col space-y-1">
                  <span>Session reminders</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive email reminders for upcoming sessions
                  </span>
                </Label>
                <Switch id="session-reminders" checked={sessionReminders} onCheckedChange={setSessionReminders} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
            </CardFooter>
          </Card>

          <RoleSpecificSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span>Dark mode</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </span>
                </Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="compact-mode" className="flex flex-col space-y-1">
                  <span>Compact mode</span>
                  <span className="font-normal text-sm text-muted-foreground">Reduce spacing and size of elements</span>
                </Label>
                <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="high-contrast" className="flex flex-col space-y-1">
                  <span>High contrast mode</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </span>
                </Label>
                <Switch id="high-contrast" checked={highContrastMode} onCheckedChange={setHighContrastMode} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="animations" className="flex flex-col space-y-1">
                  <span>Enable animations</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Show animations throughout the interface
                  </span>
                </Label>
                <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAppearance}>Save Appearance Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                  <span>Two-factor authentication</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </span>
                </Label>
                <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session timeout (minutes)</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset Password</Button>
              <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>Customize your regional and display preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                    <SelectItem value="cst">Central Time (GMT-6)</SelectItem>
                    <SelectItem value="mst">Mountain Time (GMT-7)</SelectItem>
                    <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="time-format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself" className="min-h-[100px]" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
