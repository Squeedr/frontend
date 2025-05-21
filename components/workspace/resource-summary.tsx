import { availableResources } from "@/lib/mock-resources-data"
import type { ResourceReservation } from "@/lib/types/resources"
import { Badge } from "@/components/ui/badge"

interface ResourceSummaryProps {
  resources: ResourceReservation[]
  showCost?: boolean
}

export function ResourceSummary({ resources, showCost = true }: ResourceSummaryProps) {
  if (!resources || resources.length === 0) {
    return <p className="text-sm text-muted-foreground">No additional resources</p>
  }

  // Group resources by category
  const resourcesByCategory = resources.reduce(
    (acc, reservation) => {
      const resource = availableResources.find((r) => r.id === reservation.resourceId)
      if (!resource) return acc

      if (!acc[resource.category]) {
        acc[resource.category] = []
      }

      acc[resource.category].push({
        ...resource,
        reservedQuantity: reservation.quantity,
      })

      return acc
    },
    {} as Record<string, any[]>,
  )

  // Calculate total cost
  const totalCost = resources.reduce((total, reservation) => {
    const resource = availableResources.find((r) => r.id === reservation.resourceId)
    if (resource && resource.chargeable && resource.cost) {
      return total + resource.cost * reservation.quantity
    }
    return total
  }, 0)

  // Category display names
  const categoryNames: Record<string, string> = {
    technology: "Technology",
    furniture: "Furniture",
    catering: "Catering",
    stationery: "Stationery",
    services: "Services",
  }

  return (
    <div className="space-y-3">
      {Object.entries(resourcesByCategory).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-sm font-medium mb-1">{categoryNames[category] || category}</h4>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id} className="text-sm flex justify-between">
                <span>
                  {item.name} × {item.reservedQuantity}
                </span>
                {showCost && item.chargeable && item.cost && (
                  <span className="text-muted-foreground">${(item.cost * item.reservedQuantity).toFixed(2)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {showCost && totalCost > 0 && (
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Resources Cost</span>
            <Badge variant="outline">${totalCost.toFixed(2)}</Badge>
          </div>
        </div>
      )}
    </div>
  )
}
