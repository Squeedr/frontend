import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: {
    name?: string
    email?: string
    image?: string
  }
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({ user, size = "md", className, fallbackClassName }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  // Generate initials from name or email
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    if (user.email) {
      return user.email.substring(0, 2).toUpperCase()
    }

    return "U"
  }

  // Generate a consistent color based on the user's name or email
  const getColorClass = () => {
    const colorOptions = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-rose-100 text-rose-800",
      "bg-indigo-100 text-indigo-800",
      "bg-cyan-100 text-cyan-800",
    ]

    const str = user.name || user.email || ""
    const charSum = str.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const colorIndex = charSum % colorOptions.length

    return colorOptions[colorIndex]
  }

  return (
    <Avatar className={cn(sizeClasses[size], "transition-opacity hover:opacity-80", className)}>
      <AvatarImage
        src={user.image || `/placeholder.svg?height=80&width=80&query=${user.name || "User"}`}
        alt={user.name || "User"}
      />
      <AvatarFallback className={cn(getColorClass(), fallbackClassName)}>{getInitials()}</AvatarFallback>
    </Avatar>
  )
}

interface UserAvatarWithDetailsProps extends UserAvatarProps {
  showDetails?: boolean
  detailsPosition?: "right" | "below"
  secondaryText?: string
}

export function UserAvatarWithDetails({
  user,
  size = "md",
  className,
  fallbackClassName,
  showDetails = true,
  detailsPosition = "right",
  secondaryText,
}: UserAvatarWithDetailsProps) {
  if (!showDetails) {
    return <UserAvatar user={user} size={size} className={className} fallbackClassName={fallbackClassName} />
  }

  const secondaryTextToShow = secondaryText || user.email

  return (
    <div
      className={cn(
        "flex items-center",
        detailsPosition === "below" && "flex-col items-center gap-1",
        detailsPosition === "right" && "flex-row items-center gap-3",
        className,
      )}
    >
      <UserAvatar user={user} size={size} fallbackClassName={fallbackClassName} />

      {showDetails && (
        <div className={cn(detailsPosition === "below" && "text-center mt-1", detailsPosition === "right" && "flex-1")}>
          {user.name && <p className="text-sm font-medium text-gray-900 line-clamp-1">{user.name}</p>}
          {secondaryTextToShow && (
            <p className="text-xs font-medium text-gray-500 line-clamp-1">{secondaryTextToShow}</p>
          )}
        </div>
      )}
    </div>
  )
}
