"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  Home,
  MessageSquare,
  Settings,
  Star,
  Users,
  Bell,
  Briefcase,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ChevronDown,
  UserCircle,
  FolderKanban,
  Users2,
  FileText,
  Layers,
  PanelLeft,
  Building,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NotificationAlert } from "@/components/notification-alert"
import { Logo } from "@/components/ui/logo" // Properly import the Logo component
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getRoleStyles } from "@/lib/role-utils"
import { PageLoader } from "@/components/ui/loading-states"
import { UserAvatar, UserAvatarWithDetails } from "@/components/ui/user-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RoleSwitcher } from "@/components/role-switcher"
import { useProfileReminders } from "@/hooks/use-profile-reminders" // Import the profile reminders hook
import { ProfileReminderNotification } from "@/components/profile/profile-reminder-notification" // Import the notification component
import { getAvatarImage } from "@/lib/image-utils"
import { ProfileMenu } from "@/components/profile-menu"
import { useUser } from "@/lib/user-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRole } from "@/hooks/use-role" // Add this import

// Dynamically import heavy components
const UpcomingSessionsDropdown = dynamic(
  () => import("@/components/upcoming-sessions-dropdown").then(mod => mod.UpcomingSessionsDropdown),
  { 
    ssr: false,
    loading: () => <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
  }
)

// Define breakpoints for responsive design
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  roles: Array<"owner" | "expert" | "client">
}

// Main navigation items
const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Sessions",
    href: "/dashboard/sessions",
    icon: BarChart3,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Experts",
    href: "/dashboard/experts",
    icon: Users,
    roles: ["owner"],
  },
  {
    title: "Workspaces",
    href: "/dashboard/workspaces",
    icon: Briefcase,
    roles: ["owner"],
  },
  {
    title: "Ratings",
    href: "/dashboard/ratings",
    icon: Star,
    roles: ["owner", "expert"],
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: CreditCard,
    roles: ["owner", "expert"],
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Availability",
    href: "/dashboard/availability",
    icon: Clock,
    roles: ["owner", "expert"],
  },
  {
    title: "Permissions",
    href: "/dashboard/permissions",
    icon: KeyRound,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Access Control",
    href: "/dashboard/access-control",
    icon: ShieldCheck,
    roles: ["owner"],
  },
]

// Workspace section navigation items
const workspaceItems: NavItem[] = [
  {
    title: "Projects",
    href: "/dashboard/workspace/projects",
    icon: FolderKanban,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Teams",
    href: "/dashboard/workspace/teams",
    icon: Users2,
    roles: ["owner", "expert"],
  },
  {
    title: "Book Space",
    href: "/dashboard/workspace/book-space",
    icon: Calendar,
    roles: ["owner", "expert"],
  },
  {
    title: "Documents",
    href: "/dashboard/workspace/documents",
    icon: FileText,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Resources",
    href: "/dashboard/workspace/resources",
    icon: Layers,
    roles: ["owner", "expert", "client"],
  },
  {
    title: "Management",
    href: "/dashboard/workspace/management",
    icon: Building,
    roles: ["owner"],
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser } = useUser() // Remove setRole from useUser
  const { role, logout, switchRole } = useRole() // Add switchRole to the destructuring
  const { toast } = useToast()
  const { shouldShowReminder, dismissReminder, snoozeReminder } = useProfileReminders()
  const [mounted, setMounted] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  // Filter navigation items based on user role (use role from useRole hook)
  const filteredNavItems = navItems.filter((item) => role && item.roles.includes(role))
  const filteredWorkspaceItems = workspaceItems.filter((item) => role && item.roles.includes(role))

  // Handle window resize for auto-collapse
  const shouldAutoCollapse = (width: number): boolean => {
    return width < BREAKPOINTS.lg
  }

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      if (shouldAutoCollapse(window.innerWidth)) {
        setSidebarExpanded(true)
      }
    }

    // Initial check
    handleResize()

    // Add event listeners
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  const handleLogout = () => {
    logout() // Use logout from useRole hook
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  if (!mounted) {
    return <PageLoader />
  }

  // Get role-specific styles (use role from useRole hook)
  const roleStyles = getRoleStyles(role || 'client')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Profile Reminder Notification */}
      {shouldShowReminder && pathname !== "/dashboard/profile" && (
        <ProfileReminderNotification 
          onDismiss={dismissReminder} 
          onSnooze={snoozeReminder} 
        />
      )}

      {/* Sidebar (desktop) */}
      <aside
        data-role={role}
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 z-20 transition-all duration-200 ease-in-out",
          sidebarExpanded ? "md:w-64" : "md:w-16",
        )}
        onMouseEnter={() => !sidebarExpanded && setShowScrollIndicator(true)}
        onMouseLeave={() => setShowScrollIndicator(false)}
      >
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          {/* Logo section */}
          <div
            className={cn(
              "flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200",
              !sidebarExpanded && "justify-center px-2",
            )}
          >
            <Link href="/dashboard" className="flex items-center">
              <Logo
                size="responsive"
                collapsed={!sidebarExpanded && !showScrollIndicator}
                responsiveSize={{
                  default: "sm",
                  sm: "sm",
                  md: "md",
                  lg: "lg",
                  xl: "lg",
                }}
              />
              <span className="sr-only">Squeedr</span>
            </Link>
          </div>

          {/* User profile section with role switcher */}
          <div className={cn("px-4 py-3 border-b border-gray-200", !sidebarExpanded && "px-2 text-center")}>
            <div className={cn("flex items-center", !sidebarExpanded && "justify-center flex-col")}>
              <UserAvatarWithDetails
                user={{
                  name: user.name,
                  email: user.email,
                  image: user.avatar,
                }}
                showDetails={sidebarExpanded}
                size="md"
              />

              {sidebarExpanded && (
                <div className="ml-2 mt-1">
                  <span className="text-xs text-gray-500">{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Loading...'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation section */}
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-3 space-y-1 bg-white">
              {/* Main navigation items */}
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors relative",
                      !sidebarExpanded ? "px-2 justify-center" : "px-3",
                      isActive ? roleStyles.activeNavClass : `text-gray-700 ${roleStyles.hoverNavClass}`,
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        isActive ? roleStyles.iconActiveClass : `text-gray-500 ${roleStyles.iconHoverClass}`,
                      )}
                      aria-hidden="true"
                    />
                    {sidebarExpanded && <span>{item.title}</span>}
                    {item.href === "/dashboard/notifications" && sidebarExpanded && (
                      <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 text-xs font-medium rounded-full">
                        3
                      </span>
                    )}
                  </Link>
                )
              })}

              {/* Workspace section */}
              {filteredWorkspaceItems.length > 0 && (
                <>
                  <div className="mt-8 mb-2">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspace</h3>
                    <div className="mt-1 h-px bg-gray-200 mx-3" />
                  </div>

                  {filteredWorkspaceItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center py-2.5 text-sm font-medium rounded-md transition-colors",
                          !sidebarExpanded ? "px-2 justify-center" : "px-3",
                          isActive ? roleStyles.activeNavClass : `text-gray-700 ${roleStyles.hoverNavClass}`,
                        )}
                      >
                        <Icon
                          className={cn(
                            "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                            isActive ? roleStyles.iconActiveClass : `text-gray-500 ${roleStyles.iconHoverClass}`,
                          )}
                          aria-hidden="true"
                        />
                        {sidebarExpanded && <span>{item.title}</span>}
                      </Link>
                    )
                  })}
                </>
              )}
            </nav>

            {/* Sidebar footer */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                type="button"
                className="flex-shrink-0 w-full group block"
                onClick={toggleSidebar}
              >
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-md",
                      roleStyles.buttonClass,
                    )}
                  >
                    {sidebarExpanded ? (
                      <ChevronLeft className="h-5 w-5 text-white" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
                    )}
                  </div>
                  {sidebarExpanded && (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {sidebarExpanded ? "Collapse" : "Expand"}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          mobileNavOpen ? "block" : "hidden",
        )}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileNavOpen(false)} />

        {/* Mobile menu */}
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="flex flex-shrink-0 items-center px-4 py-4">
              <Logo size="md" />
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-colors",
                        isActive ? roleStyles.activeNavClass : `text-gray-700 ${roleStyles.hoverNavClass}`,
                      )}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                          isActive ? roleStyles.iconActiveClass : `text-gray-500 ${roleStyles.iconHoverClass}`,
                        )}
                        aria-hidden="true"
                      />
                      {item.title}
                      {item.href === "/dashboard/notifications" && (
                        <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 text-xs font-medium rounded-full">
                          3
                        </span>
                      )}
                    </Link>
                  )
                })}

                {/* Mobile Workspace section */}
                {filteredWorkspaceItems.length > 0 && (
                  <>
                    <div className="mt-8 mb-2">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspace</h3>
                      <div className="mt-1 h-px bg-gray-200 mx-3" />
                    </div>

                    {filteredWorkspaceItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "group flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-colors",
                            isActive ? roleStyles.activeNavClass : `text-gray-700 ${roleStyles.hoverNavClass}`,
                          )}
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <Icon
                            className={cn(
                              "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                              isActive ? roleStyles.iconActiveClass : `text-gray-500 ${roleStyles.iconHoverClass}`,
                            )}
                            aria-hidden="true"
                          />
                          {item.title}
                        </Link>
                      )
                    })}
                  </>
                )}
              </nav>

              {/* Mobile user controls */}
              <div className="py-6">
                <div className="flex items-center mb-4">
                  <UserAvatar 
                    user={{
                      name: user.name,
                      email: user.email,
                      image: user.avatar,
                    }}
                    size="md"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Loading...'}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                          <UserCircle className="h-3 w-3" />
                          {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Loading...'}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-32">
                        <DropdownMenuItem
                          onClick={() => switchRole("owner")}
                          className={role === "owner" ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                        >
                          Owner
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => switchRole("expert")}
                          className={role === "expert" ? "bg-gray-50 dark:bg-gray-900/20" : ""}
                        >
                          Expert
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => switchRole("client")}
                          className={role === "client" ? "bg-purple-50 dark:bg-purple-900/20" : ""}
                        >
                          Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full justify-start text-white"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-200 ease-in-out",
          !sidebarExpanded ? "md:pl-16" : "md:pl-64",
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 md:block hidden" aria-hidden="true" />

          {/* Header content */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {navItems.find((item) => item.href === pathname)?.title ||
                workspaceItems.find((item) => item.href === pathname)?.title ||
                "Dashboard"}
            </h1>

            {/* Header right section */}
            <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
              {/* Upcoming Sessions Dropdown */}
              <UpcomingSessionsDropdown />

              {/* Notification Alert */}
              <NotificationAlert />

              <Separator orientation="vertical" className="h-6" />

              {/* Role Switcher - always visible in header */}
              <RoleSwitcher className="hidden md:flex" />

              <Separator orientation="vertical" className="h-6" />

              {/* User dropdown */}
              <ProfileMenu />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50")}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

