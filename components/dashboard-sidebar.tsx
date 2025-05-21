"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  MessageSquare,
  Settings,
  Star,
  Users,
  UserCircle,
  Lock,
  Bell,
  Briefcase,
  Shield,
  BookOpen,
  FileText,
  FolderKanban,
  Database,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRole } from "@/hooks/use-role"
import { Logo } from "@/components/ui/logo"
import { useToast } from "@/hooks/use-toast"

// Define breakpoints for responsive design
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { role } = useRole()
  const { toast } = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined)
  const [userCollapsedPreference, setUserCollapsedPreference] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState(false)

  // Function to check if sidebar should be auto-collapsed based on screen width
  const shouldAutoCollapse = useCallback((width: number) => {
    return width < BREAKPOINTS.lg
  }, [])

  // Handle window resize and update sidebar state
  const handleResize = useCallback(() => {
    const width = window.innerWidth
    setScreenWidth(width)

    // Only auto-collapse if user hasn't explicitly set a preference
    // or if we're on a very small screen (force collapse on mobile)
    if (width < BREAKPOINTS.md || userCollapsedPreference === null) {
      setCollapsed(shouldAutoCollapse(width))
    }
  }, [shouldAutoCollapse, userCollapsedPreference])

  // Initialize collapsed state from localStorage, but only after component mounts
  useEffect(() => {
    setMounted(true)
    try {
      const savedState = localStorage.getItem("squeedr-sidebar-collapsed")
      if (savedState !== null) {
        const savedCollapsed = savedState === "true"
        setCollapsed(savedCollapsed)
        setUserCollapsedPreference(savedCollapsed)
      } else {
        // If no saved preference, initialize based on screen size
        const width = window.innerWidth
        setCollapsed(shouldAutoCollapse(width))
        setUserCollapsedPreference(null)
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [handleResize, shouldAutoCollapse])

  const toggleSidebar = () => {
    // Only allow toggling if we're on a large enough screen
    if (screenWidth && screenWidth >= BREAKPOINTS.md) {
      const next = !collapsed
      setCollapsed(next)
      setUserCollapsedPreference(next)
      try {
        localStorage.setItem("squeedr-sidebar-collapsed", String(next))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    } else if (screenWidth && screenWidth < BREAKPOINTS.md) {
      // On mobile, show a toast explaining why the sidebar can't be expanded
      toast({
        title: "Screen too small",
        description: "The sidebar cannot be expanded on smaller screens.",
        variant: "default",
      })
    }
  }

  // Define navigation items with sections
  const navSections = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: BarChart3,
          roles: ["owner", "expert", "client"],
        },
        {
          title: "Calendar",
          href: "/dashboard/calendar",
          icon: Calendar,
          roles: ["owner", "expert", "client"],
        },
        {
          title: "Availability",
          href: "/dashboard/availability",
          icon: Clock,
          roles: ["owner", "expert"],
        },
        {
          title: "Sessions",
          href: "/dashboard/sessions",
          icon: Users,
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
          roles: ["owner", "expert", "client"],
        },
        {
          title: "Ratings",
          href: "/dashboard/ratings",
          icon: Star,
          roles: ["owner", "expert"],
        },
        {
          title: "Experts",
          href: "/dashboard/experts",
          icon: Users,
          roles: ["owner", "client"],
        },
      ],
    },
    {
      title: "Workspace",
      items: [
        {
          title: "Workspaces",
          href: "/dashboard/workspaces",
          icon: Briefcase,
          roles: ["owner", "expert", "client"],
        },
        {
          title: "Projects",
          href: "/dashboard/workspace/projects",
          icon: FolderKanban,
          roles: ["owner", "expert"],
        },
        {
          title: "Teams",
          href: "/dashboard/workspace/teams",
          icon: Users,
          roles: ["owner", "expert"],
        },
        {
          title: "Book Space",
          href: "/dashboard/workspace/book-space",
          icon: Briefcase,
          roles: ["owner", "expert"],
        },
        {
          title: "Documents",
          href: "/dashboard/workspace/documents",
          icon: FileText,
          roles: ["owner", "expert"],
        },
        {
          title: "Resources",
          href: "/dashboard/workspace/resources",
          icon: Database,
          roles: ["owner", "expert"],
        },
        {
          title: "My Bookings",
          href: "/dashboard/expert/bookings",
          icon: BookOpen,
          roles: ["expert"],
        },
        {
          title: "Book Workspace",
          href: "/dashboard/workspace/enhanced-booking",
          icon: Briefcase,
          roles: ["expert"],
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Access Control",
          href: "/dashboard/access-control",
          icon: Lock,
          roles: ["owner"],
        },
        {
          title: "Permissions",
          href: "/dashboard/permissions",
          icon: Shield,
          roles: ["owner", "expert"],
        },
        {
          title: "Notifications",
          href: "/dashboard/notifications",
          icon: Bell,
          roles: ["owner", "expert", "client"],
        },
        {
          title: "Profile",
          href: "/dashboard/profile",
          icon: UserCircle,
          roles: ["owner", "expert", "client"],
        },
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
          roles: ["owner", "expert", "client"],
        },
      ],
    },
  ]

  // Determine if sidebar should appear expanded
  const sidebarExpanded = !collapsed || isHovering

  if (!mounted) {
    return null
  }

  // Filter sections and items based on user role
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div
      className={cn(
        "group fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
      onMouseEnter={() => collapsed && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center">
          <Logo collapsed={!sidebarExpanded} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          disabled={screenWidth ? screenWidth < BREAKPOINTS.md : false}
          title={
            screenWidth && screenWidth < BREAKPOINTS.md ? "Sidebar cannot be expanded on smaller screens" : undefined
          }
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 pt-3">
        {visibleSections.map((section) => (
          <div key={section.title} className="px-3 py-2">
            <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight", !sidebarExpanded && "sr-only")}>
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href ? "bg-accent" : "",
                    collapsed ? "px-2" : "",
                  )}
                >
                  <Link href={item.href} title={!sidebarExpanded ? item.title : undefined}>
                    <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                    {sidebarExpanded && item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
