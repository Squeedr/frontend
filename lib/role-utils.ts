import { ShieldAlert, Code2, UserCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type UserRole = "owner" | "expert" | "client"

export interface RoleConfig {
  label: string
  color: {
    bg: string
    text: string
    border: string
    hover: string
    active: {
      bg: string
      text: string
    }
    icon: {
      default: string
      hover: string
      active: string
    }
    button: string
  }
  icon: LucideIcon
  permissions: string[]
}

export const roleConfigs: Record<UserRole, RoleConfig> = {
  owner: {
    label: "Owner",
    color: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
      hover: "hover:bg-blue-50 hover:text-blue-700",
      active: {
        bg: "bg-blue-100",
        text: "text-blue-800",
      },
      icon: {
        default: "text-blue-500",
        hover: "group-hover:text-blue-600",
        active: "text-blue-700",
      },
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    icon: ShieldAlert,
    permissions: [
      "dashboard:view",
      "sessions:view",
      "sessions:create",
      "sessions:edit",
      "sessions:delete",
      "experts:view",
      "experts:create",
      "experts:edit",
      "experts:delete",
      "workspaces:view",
      "workspaces:create",
      "workspaces:edit",
      "workspaces:delete",
      "ratings:view",
      "calendar:view",
      "calendar:edit",
      "messages:view",
      "messages:send",
      "invoices:view",
      "invoices:create",
      "invoices:edit",
      "notifications:view",
      "availability:view",
      "availability:edit",
      "settings:view",
      "settings:edit",
      "profile:view",
      "profile:edit",
      "users:view",
      "users:create",
      "users:edit",
      "users:delete",
      "roles:view",
      "roles:edit",
    ],
  },
  expert: {
    label: "Expert",
    color: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
      hover: "hover:bg-gray-50 hover:text-gray-700",
      active: {
        bg: "bg-gray-100",
        text: "text-gray-800",
      },
      icon: {
        default: "text-gray-500",
        hover: "group-hover:text-gray-600",
        active: "text-gray-700",
      },
      button: "bg-gray-900 hover:bg-gray-800 text-white",
    },
    icon: Code2,
    permissions: [
      "dashboard:view",
      "sessions:view",
      "sessions:create",
      "sessions:edit",
      "calendar:view",
      "calendar:edit",
      "workspaces:view",
      "ratings:view",
      "messages:view",
      "messages:send",
      "invoices:view",
      "invoices:create",
      "notifications:view",
      "availability:view",
      "availability:edit",
      "profile:view",
      "profile:edit",
    ],
  },
  client: {
    label: "Client",
    color: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
      hover: "hover:bg-purple-50 hover:text-purple-700",
      active: {
        bg: "bg-purple-100",
        text: "text-purple-800",
      },
      icon: {
        default: "text-purple-500",
        hover: "group-hover:text-purple-600",
        active: "text-purple-700",
      },
      button: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    icon: UserCircle,
    permissions: [
      "dashboard:view",
      "sessions:view",
      "calendar:view",
      "messages:view",
      "messages:send",
      "invoices:view",
      "notifications:view",
      "profile:view",
      "profile:edit",
    ],
  },
}

export function getRoleConfig(role: UserRole): RoleConfig {
  return roleConfigs[role] || roleConfigs.client
}

export function hasPermission(role: UserRole, permission: string): boolean {
  const config = getRoleConfig(role)
  return config.permissions.includes(permission)
}

export function getRoleStyles(role: UserRole) {
  const config = getRoleConfig(role)

  return {
    activeNavClass: config.color.active.bg + " " + config.color.active.text,
    hoverNavClass: config.color.hover,
    iconActiveClass: config.color.icon.active,
    iconHoverClass: config.color.icon.hover,
    buttonClass: config.color.button,
  }
}
