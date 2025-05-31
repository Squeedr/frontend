"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Star,
  MessageSquare,
  FileText,
  Bell,
  Clock,
  Settings,
  User,
  LogOut,
  Menu,
  Shield,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { RoleSwitcher } from "@/components/role-switcher"
import { useRole } from "@/hooks/use-role"
import { usePermissions } from "@/hooks/permissions-provider"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { UpcomingSessionsDropdown } from "@/components/upcoming-sessions-dropdown"
import { NotificationAlert } from "@/components/notification-alert"
import { getAvatarImage } from "@/lib/image-utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  permission: string | string[]
}

function NavItem({ href, icon, label, active, permission }: NavItemProps) {
  const { checkPermission } = usePermissions()

  if (!checkPermission(permission as any)) {
    return null
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { role } = useRole()
  const { isLoading } = usePermissions()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
      permission: "dashboard:view",
    },
    {
      href: "/dashboard/sessions",
      icon: <Calendar className="h-4 w-4" />,
      label: "Sessions",
      permission: "sessions:view",
    },
    {
      href: "/dashboard/experts",
      icon: <Users className="h-4 w-4" />,
      label: "Experts",
      permission: "experts:view",
    },
    {
      href: "/dashboard/workspaces",
      icon: <Briefcase className="h-4 w-4" />,
      label: "Workspaces",
      permission: "workspaces:view",
    },
    {
      href: "/dashboard/ratings",
      icon: <Star className="h-4 w-4" />,
      label: "Ratings",
      permission: "ratings:view",
    },
    {
      href: "/dashboard/messages",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Messages",
      permission: "messages:view",
    },
    {
      href: "/dashboard/invoices",
      icon: <FileText className="h-4 w-4" />,
      label: "Invoices",
      permission: "invoices:view",
    },
    {
      href: "/dashboard/notifications",
      icon: <Bell className="h-4 w-4" />,
      label: "Notifications",
      permission: "notifications:view",
    },
    {
      href: "/dashboard/availability",
      icon: <Clock className="h-4 w-4" />,
      label: "Availability",
      permission: "availability:view",
    },
    {
      href: "/dashboard/access-control",
      icon: <Shield className="h-4 w-4" />,
      label: "Access Control",
      permission: ["users:view", "roles:view"],
    },
    {
      href: "/dashboard/permissions",
      icon: <Lock className="h-4 w-4" />,
      label: "Permissions",
      permission: "roles:view",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      permission: "settings:view",
    },
    {
      href: "/dashboard/profile",
      icon: <User className="h-4 w-4" />,
      label: "Profile",
      permission: "profile:view",
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-none">
            <div className="flex items-center gap-2 pb-4 pt-2">
              <Logo className="h-6 w-6" />
              <span className="text-lg font-semibold">Squeedr</span>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              {navigation.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                  permission={item.permission}
                />
              ))}
              <Link
                href="/auth/logout"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 md:h-8 md:w-8" />
          <span className="text-lg font-semibold hidden md:inline-block">Squeedr</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <UpcomingSessionsDropdown />
          <NotificationAlert />
          <RoleSwitcher />
          <Avatar>
            <AvatarImage src={getAvatarImage("stylized-jd-initials.png")} alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {navigation.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                permission={item.permission}
              />
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
