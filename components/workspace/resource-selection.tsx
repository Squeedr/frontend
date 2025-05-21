"use client"

import { useState } from "react"
import { Plus, Minus, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { availableResources, getResourcesByCategory, calculateResourcesCost } from "@/lib/mock-resources-data"
import type { ResourceReservation } from "@/lib/types/resources"

// Group resources by category
const resourceCategories = [
  { id: "technology", name: "Technology" },
  { id: "furniture", name: "Furniture" },
  { id: "catering", name: "Catering" },
  { id: "stationery", name: "Stationery" },
  { id: "services", name: "Services" },
]

interface ResourceSelectionProps {
  selectedResources: ResourceReservation[]
  onChange: (resources: ResourceReservation[]) => void
}

export function ResourceSelection({ selectedResources, onChange }: ResourceSelectionProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["technology"])

  const handleResourceChange = (resourceId: string, quantity: number) => {
    const newResources = [...selectedResources]
    const existingIndex = newResources.findIndex((r) => r.resourceId === resourceId)

    if (existingIndex >= 0) {
      if (quantity <= 0) {
        // Remove the resource if quantity is 0 or negative
        newResources.splice(existingIndex, 1)
      } else {
        // Update the quantity
        newResources[existingIndex].quantity = quantity
      }
    } else if (quantity > 0) {
      // Add new resource
      newResources.push({ resourceId, quantity })
    }

    onChange(newResources)
  }

  const getResourceQuantity = (resourceId: string): number => {
    const resource = selectedResources.find((r) => r.resourceId === resourceId)
    return resource ? resource.quantity : 0
  }

  const totalCost = calculateResourcesCost(selectedResources)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Additional Resources</h3>
        {totalCost > 0 && (
          <Badge variant="outline" className="ml-2">
            Total: ${totalCost.toFixed(2)}
          </Badge>
        )}
      </div>

      <Accordion type="multiple" value={expandedCategories} onValueChange={setExpandedCategories} className="w-full">
        {resourceCategories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="hover:no-underline">
              <span className="text-sm font-medium">{category.name}</span>
              {selectedResources.some(
                (r) => availableResources.find((ar) => ar.id === r.resourceId)?.category === category.id,
              ) && (
                <Badge variant="secondary" className="ml-2">
                  {
                    selectedResources.filter(
                      (r) => availableResources.find((ar) => ar.id === r.resourceId)?.category === category.id,
                    ).length
                  }{" "}
                  selected
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-3 pt-2">
                {getResourcesByCategory(category.id).map((resource) => {
                  const quantity = getResourceQuantity(resource.id)

                  return (
                    <Card
                      key={resource.id}
                      className={`border ${quantity > 0 ? "border-primary/20 bg-primary/5" : ""}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                              {resource.image ? (
                                <img
                                  src={resource.image || "/placeholder.svg"}
                                  alt={resource.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="text-xs text-center text-muted-foreground p-1">
                                  {resource.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="text-sm font-medium">{resource.name}</p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                        <Info className="h-3 w-3" />
                                        <span className="sr-only">Info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{resource.description}</p>
                                      {resource.chargeable && resource.cost && (
                                        <p className="font-medium mt-1">${resource.cost.toFixed(2)} per unit</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{resource.available ? `${resource.quantity} available` : "Unavailable"}</span>
                                {resource.chargeable && resource.cost && (
                                  <Badge variant="outline" className="ml-2">
                                    ${resource.cost.toFixed(2)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              disabled={quantity <= 0}
                              onClick={() => handleResourceChange(resource.id, quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>

                            <span className="w-6 text-center text-sm">{quantity}</span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              disabled={!resource.available || quantity >= resource.quantity}
                              onClick={() => handleResourceChange(resource.id, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {selectedResources.length > 0 && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <h4 className="text-sm font-medium mb-2">Selected Resources:</h4>
          <ul className="space-y-1">
            {selectedResources.map((reservation) => {
              const resource = availableResources.find((r) => r.id === reservation.resourceId)
              if (!resource) return null

              return (
                <li key={resource.id} className="text-sm flex justify-between">
                  <span>
                    {resource.name} × {reservation.quantity}
                  </span>
                  {resource.chargeable && resource.cost && (
                    <span>${(resource.cost * reservation.quantity).toFixed(2)}</span>
                  )}
                </li>
              )
            })}
            {totalCost > 0 && (
              <li className="text-sm font-medium border-t pt-1 mt-1 flex justify-between">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
