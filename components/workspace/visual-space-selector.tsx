"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mock data for workspace layout
const mockSpaces = [
  { id: "ws1", name: "Conference Room A", type: "Conference Room", capacity: 12, x: 0, y: 0, width: 2, height: 2 },
  { id: "ws2", name: "Meeting Room B", type: "Meeting Room", capacity: 6, x: 2, y: 0, width: 1, height: 1 },
  { id: "ws3", name: "Quiet Office", type: "Office", capacity: 2, x: 3, y: 0, width: 1, height: 1 },
  { id: "ws4", name: "Collaboration Space", type: "Collaboration Space", capacity: 8, x: 0, y: 2, width: 2, height: 1 },
  { id: "ws5", name: "Meeting Room C", type: "Meeting Room", capacity: 4, x: 2, y: 1, width: 1, height: 1 },
  { id: "ws6", name: "Phone Booth 1", type: "Phone Booth", capacity: 1, x: 3, y: 1, width: 1, height: 0.5 },
  { id: "ws7", name: "Phone Booth 2", type: "Phone Booth", capacity: 1, x: 3, y: 1.5, width: 1, height: 0.5 },
  { id: "ws8", name: "Open Desk Area", type: "Open Space", capacity: 20, x: 2, y: 2, width: 2, height: 1 },
]

// Mock function to check availability
const checkAvailability = (spaceId: string, date: string, startTime: string, endTime: string): boolean => {
  // For demo purposes, let's say some spaces are unavailable
  if (spaceId === "ws1" && date === new Date().toISOString().split("T")[0] && startTime === "10:00") {
    return false
  }
  if (spaceId === "ws5") {
    return false // Always unavailable for maintenance
  }
  if (spaceId === "ws6" && startTime > "12:00") {
    return false
  }
  return true
}

interface VisualSpaceSelectorProps {
  selectedDate?: Date
  startTime?: string
  endTime?: string
  selectedSpace: string
  onSpaceSelect: (spaceId: string) => void
}

export function VisualSpaceSelector({
  selectedDate,
  startTime,
  endTime,
  selectedSpace,
  onSpaceSelect,
}: VisualSpaceSelectorProps) {
  const [availableSpaces, setAvailableSpaces] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual")

  // Check availability when date or time changes
  useEffect(() => {
    if (selectedDate && startTime && endTime) {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const newAvailability: Record<string, boolean> = {}

      mockSpaces.forEach((space) => {
        newAvailability[space.id] = checkAvailability(space.id, dateStr, startTime, endTime)
      })

      setAvailableSpaces(newAvailability)
    }
  }, [selectedDate, startTime, endTime])

  const getSpaceColor = (spaceId: string) => {
    if (!availableSpaces[spaceId]) {
      return "bg-gray-200 border-gray-300 text-gray-500"
    }
    if (spaceId === selectedSpace) {
      return "bg-primary/10 border-primary text-primary"
    }
    return "bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select a Space</h3>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "visual" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("visual")}
          >
            Visual
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List
          </Button>
        </div>
      </div>

      {viewMode === "visual" ? (
        <div className="relative border rounded-md p-4 bg-gray-50" style={{ height: "300px" }}>
          <div className="absolute top-2 left-2 text-xs text-gray-500">Floor Plan</div>

          {mockSpaces.map((space) => {
            const isAvailable = availableSpaces[space.id] !== false
            const isSelected = space.id === selectedSpace

            return (
              <TooltipProvider key={space.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "absolute border-2 rounded-md flex items-center justify-center cursor-pointer transition-colors",
                        getSpaceColor(space.id),
                        isAvailable ? "hover:shadow-md" : "cursor-not-allowed",
                      )}
                      style={{
                        left: `${space.x * 20}%`,
                        top: `${space.y * 20}%`,
                        width: `${space.width * 20}%`,
                        height: `${space.height * 20}%`,
                      }}
                      onClick={() => isAvailable && onSpaceSelect(space.id)}
                    >
                      <div className="text-center p-1">
                        <div className="text-xs font-medium truncate">{space.name}</div>
                        {isSelected && <Check className="h-4 w-4 mx-auto mt-1" />}
                        {!isAvailable && <AlertCircle className="h-4 w-4 mx-auto mt-1 text-gray-400" />}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{space.name}</p>
                      <p className="text-xs">Type: {space.type}</p>
                      <p className="text-xs">Capacity: {space.capacity} people</p>
                      {!isAvailable && <p className="text-xs text-red-500">Unavailable</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
          {mockSpaces.map((space) => {
            const isAvailable = availableSpaces[space.id] !== false
            const isSelected = space.id === selectedSpace

            return (
              <Card
                key={space.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected ? "border-primary" : "border-gray-200",
                  isAvailable ? "hover:border-primary/50" : "opacity-60 cursor-not-allowed",
                )}
                onClick={() => isAvailable && onSpaceSelect(space.id)}
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium flex items-center">
                      {space.name}
                      {isSelected && <Check className="h-4 w-4 ml-2 text-primary" />}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{space.type}</span>
                      <span>•</span>
                      <span>{space.capacity} people</span>
                    </div>
                  </div>
                  <div>
                    {!isAvailable ? (
                      <Badge variant="outline" className="bg-gray-100">
                        Unavailable
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
