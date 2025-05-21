import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SignedStatusBadgeProps {
  signed: boolean
}

export function SignedStatusBadge({ signed }: SignedStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-1 text-xs font-medium",
        signed ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-gray-100 text-gray-800 border-gray-200",
      )}
    >
      {signed ? "Signed" : "Unsigned"}
    </Badge>
  )
}
