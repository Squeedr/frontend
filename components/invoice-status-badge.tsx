import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type InvoiceStatus = "paid" | "pending" | "overdue" | "draft"

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2 py-1 text-xs font-medium capitalize",
        status === "paid" && "bg-green-100 text-green-800 border-green-200",
        status === "pending" && "bg-blue-100 text-blue-800 border-blue-200",
        status === "overdue" && "bg-red-100 text-red-800 border-red-200",
        status === "draft" && "bg-gray-100 text-gray-800 border-gray-200",
      )}
    >
      {status}
    </Badge>
  )
}
