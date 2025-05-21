import type { CalendarEvent } from "@/components/draggable-event"

// Function to reschedule an event to a new date and time
export function rescheduleEvent(
  event: CalendarEvent,
  newDate: Date,
  newHour?: number,
  allEvents: CalendarEvent[],
): CalendarEvent[] {
  // Parse the original event dates
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)

  // Calculate duration in milliseconds
  const duration = endDate.getTime() - startDate.getTime()

  // Create new date objects for the new start time
  const newStartDate = new Date(newDate)
  if (newHour !== undefined) {
    newStartDate.setHours(newHour, 0, 0, 0)
  } else {
    // If no hour is provided, keep the original hour
    newStartDate.setHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      startDate.getMilliseconds(),
    )
  }

  // Calculate the new end time by adding the original duration
  const newEndDate = new Date(newStartDate.getTime() + duration)

  // Create the updated event
  const updatedEvent: CalendarEvent = {
    ...event,
    start: newStartDate.toISOString(),
    end: newEndDate.toISOString(),
  }

  // Return a new array with the updated event
  return allEvents.map((e) => (e.id === event.id ? updatedEvent : e))
}
