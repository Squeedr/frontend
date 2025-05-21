import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

interface RoleBadgeProps {
  role: UserRole
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RoleBadge({ role, size = "md", className }: RoleBadgeProps) {
  const roleStyles = {
    owner: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    expert: "bg-green-100 text-green-800 hover:bg-green-200",
    client: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  }

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "px-2.5 py-1",
  }

  return (
    <Badge variant="outline" className={cn(roleStyles[role], sizeClasses[size], "font-medium capitalize", className)}>
      {role}
    </Badge>
  )
}
