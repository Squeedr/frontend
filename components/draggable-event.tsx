"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useDrag } from "react-dnd"
import { Clock, MapPin, MoreHorizontal } from "lucide-react"
import { format, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface CalendarEvent {
  id: string
  title: string
  start: string // ISO string
  end: string // ISO string
  status: "upcoming" | "in-progress" | "completed" | "cancelled" | "recording"
  description?: string
  location?: string
  workspace?: string
}

interface DraggableEventProps {
  event: CalendarEvent
  onDrop: (event: CalendarEvent, date: Date, hour?: number) => void
  onEdit?: (event: CalendarEvent) => void
  onDelete?: (event: CalendarEvent) => void
  isCompact?: boolean
  isDayView?: boolean
  startHour?: number
  endHour?: number
  className?: string
  style?: React.CSSProperties
}

export function DraggableEvent({
  event,
  onDrop,
  onEdit,
  onDelete,
  isCompact = false,
  isDayView = false,
  startHour,
  endHour,
  className,
  style,
  ...props
}: DraggableEventProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EVENT",
    item: { event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // Apply the drag ref to our element ref
  drag(elementRef)

  const statusClasses = {
    upcoming: "bg-blue-100 text-blue-800 border-blue-300",
    "in-progress": "bg-green-100 text-green-800 border-green-300",
    completed: "bg-gray-100 text-gray-800 border-gray-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
    recording: "bg-purple-100 text-purple-800 border-purple-300",
  }

  // Format times for display
  const formatEventTime = (dateString: string) => {
    return format(parseISO(dateString), "h:mm a")
  }

  // Calculate position and height for day view
  const calculateEventStyle = () => {
    if (!isDayView || startHour === undefined || endHour === undefined) return {}

    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)

    const startHourDecimal = eventStart.getHours() + eventStart.getMinutes() / 60
    const endHourDecimal = eventEnd.getHours() + eventEnd.getMinutes() / 60

    // Calculate position relative to the visible time range
    const visibleHours = endHour - startHour
    const top = ((startHourDecimal - startHour) / visibleHours) * 100
    const height = ((endHourDecimal - startHourDecimal) / visibleHours) * 100

    return {
      top: `${top}%`,
      height: `${height}%`,
      width: "calc(100% - 8px)",
      position: "absolute" as const,
      left: "4px",
      right: "4px",
    }
  }

  const eventStyle = isDayView ? calculateEventStyle() : style

  // Handle click to expand/collapse event details
  const handleClick = (e: React.MouseEvent) => {
    if (!isCompact) {
      e.stopPropagation()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        "group relative rounded border text-xs p-1.5 transition-all",
        statusClasses[event.status],
        isDragging && "opacity-50",
        isCompact ? "cursor-move truncate" : "cursor-move",
        isExpanded && "z-50",
        className,
      )}
      style={eventStyle}
      onClick={handleClick}
      {...props}
    >
      {/* Event title and time */}
      <div className="flex items-center justify-between gap-1">
        <div className="font-medium truncate">{event.title}</div>

        {!isCompact && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && <DropdownMenuItem onClick={() => onEdit(event)}>Edit</DropdownMenuItem>}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(event)}>
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Time display for non-compact view */}
      {!isCompact && (
        <div className="flex items-center text-xs opacity-80 mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {formatEventTime(event.start)} - {formatEventTime(event.end)}
          </span>
        </div>
      )}

      {/* Location if available and not compact */}
      {!isCompact && event.location && (
        <div className="flex items-center text-xs opacity-80 mt-1 truncate">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      )}

      {/* Expanded details */}
      {isExpanded && !isCompact && event.description && (
        <div className="mt-2 pt-2 border-t text-xs">
          <p className="whitespace-pre-line">{event.description}</p>
        </div>
      )}

      {/* Hover preview for compact view */}
      {isCompact && (
        <Popover>
          <PopoverTrigger asChild>
            <div className="absolute inset-0 cursor-pointer" onClick={(e) => e.stopPropagation()}></div>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{event.title}</h4>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    event.status === "upcoming" && "bg-blue-100 text-blue-800",
                    event.status === "in-progress" && "bg-green-100 text-green-800",
                    event.status === "completed" && "bg-gray-100 text-gray-800",
                    event.status === "cancelled" && "bg-red-100 text-red-800",
                    event.status === "recording" && "bg-purple-100 text-purple-800",
                  )}
                >
                  {event.status.replace("-", " ")}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  {formatEventTime(event.start)} - {formatEventTime(event.end)}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.workspace && (
                <div className="text-sm">
                  <span className="text-gray-500">Workspace:</span> {event.workspace}
                </div>
              )}

              {event.description && (
                <div className="mt-2 pt-2 border-t text-sm">
                  <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="destructive" onClick={() => onDelete(event)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
