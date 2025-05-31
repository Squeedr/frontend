"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LogOut,
  Settings,
  User,
  UserCircle,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Laptop,
  Shield,
  Key,
  Bookmark,
  Check,
} from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRole } from "@/hooks/use-role"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { UserAvatar } from "@/components/ui/user-avatar"
import { mockUsers } from "@/lib/mock-access"

// Optimize the component with React.memo and useCallback
const ProfileMenu = React.memo(function ProfileMenu() {
  const { toast } = useToast()
  const router = useRouter()
  const { role } = useRole()
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("light")
  const [status, setStatus] = React.useState<"online" | "away" | "busy" | "offline">("online")

  // Get mock user data based on role
  const currentUser = React.useMemo(() => {
    // Find a user with the current role
    const userWithRole = mockUsers.find(user => user.role === role)
    // If no user with the current role, use the first user
    return userWithRole || mockUsers[0]
  }, [role])

  // Memoize event handlers
  const handleLogout = React.useCallback(() => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    // Redirect to auth page
    setTimeout(() => {
      router.push("/auth")
    }, 1000)
  }, [toast, router])

  // Memoize helper functions
  const getStatusColor = React.useCallback(() => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-500"
    }
  }, [status])

  const getStatusLabel = React.useCallback(() => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }, [status])

  const setThemePreference = React.useCallback((newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    toast({
      title: "Theme updated",
      description: `Theme set to ${newTheme}.`,
    })
  }, [toast])

  const setStatusPreference = React.useCallback((newStatus: "online" | "away" | "busy" | "offline") => {
    setStatus(newStatus)
    toast({
      title: "Status updated",
      description: `You are now ${newStatus}.`,
    })
  }, [toast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserAvatar 
            user={{
              name: currentUser.name,
              email: currentUser.email,
              image: currentUser.avatarUrl
            }}
            size="md"
          />
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor()}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <Badge variant="outline" className="text-xs">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
              <p className="text-xs text-muted-foreground">{getStatusLabel()}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Status submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span>Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem onClick={() => setStatusPreference("online")} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Online</span>
                {status === "online" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusPreference("away")} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>Away</span>
                {status === "away" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusPreference("busy")} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>Busy</span>
                {status === "busy" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusPreference("offline")} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-500" />
                <span>Appear offline</span>
                {status === "offline" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="flex items-center gap-2">
            <Link href="/dashboard/profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="flex items-center gap-2">
            <Link href="/dashboard/saved-items">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved Items
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="flex items-center gap-2">
            <Link href="/dashboard/billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="flex items-center gap-2">
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Theme submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            {theme === "light" && <Sun className="h-4 w-4" />}
            {theme === "dark" && <Moon className="h-4 w-4" />}
            {theme === "system" && <Laptop className="h-4 w-4" />}
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem onClick={() => setThemePreference("light")} className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>Light</span>
                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemePreference("dark")} className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setThemePreference("system")} className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <span>System</span>
                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="flex items-center gap-2">
          <Link href="/support">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="flex items-center gap-2">
          <Link href="/dashboard/security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="flex items-center gap-2">
          <Link href="/dashboard/api-keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

export { ProfileMenu }
