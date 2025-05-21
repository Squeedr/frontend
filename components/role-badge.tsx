import { cn } from "@/lib/utils"
import { getRoleConfig, type UserRole } from "@/lib/role-utils"

interface RoleBadgeProps {
  role: UserRole
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

export function RoleBadge({ role, size = "md", showIcon = true, showLabel = true, className }: RoleBadgeProps) {
  const config = getRoleConfig(role)
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-2.5 py-1.5 text-sm",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  const roleColors = {
    owner: "bg-blue-100 text-blue-800 border-blue-200",
    expert: "bg-gray-100 text-gray-800 border-gray-200",
    client: "bg-purple-100 text-purple-800 border-purple-200",
  }

  const roleColorClasses = roleColors[role] || ""

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium gap-1",
        roleColorClasses,
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
