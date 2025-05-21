"use client"

import type React from "react"

import { useDrop } from "react-dnd"
import { cn } from "@/lib/utils"

interface DroppableTimeSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date
  hour?: number
  onDrop: (event: any, date: Date, hour?: number) => void
  onDoubleClick?: () => void
}

export function DroppableTimeSlot({
  date,
  hour,
  onDrop,
  onDoubleClick,
  className,
  children,
  ...props
}: DroppableTimeSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "EVENT",
    drop: (item: { event: any }) => {
      onDrop(item.event, date, hour)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div ref={drop} className={cn(isOver && "bg-blue-50", className)} onDoubleClick={onDoubleClick} {...props}>
      {children}
    </div>
  )
}
