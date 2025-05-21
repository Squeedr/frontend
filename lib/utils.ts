import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface AvailabilitySlot {
  start: Date
  end: Date
  title?: string
  description?: string
  location?: string
}

function generateICalendarData(slots: AvailabilitySlot[], calendarName: string): string {
  let icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Squeedr//NONSGML Squeedr Availability//EN
NAME:${calendarName}
X-WR-CALNAME:${calendarName}
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:UTC
BEGIN:STANDARD
TZOFFSETFROM:+0000
TZOFFSETTO:+0000
END:STANDARD
END:VTIMEZONE
`

  slots.forEach((slot) => {
    const start = slot.start
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z/, "Z")
    const end = slot.end
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z/, "Z")

    icalData += `BEGIN:VEVENT
UID:${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}@squeedr
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${slot.title || "Available"}
DESCRIPTION:${slot.description || ""}
LOCATION:${slot.location || ""}
END:VEVENT
`
  })

  icalData += "END:VCALENDAR"
  return icalData
}

export function downloadICalendarFile(
  slots: AvailabilitySlot[],
  calendarName = "Squeedr Availability",
  filename = "availability.ics",
): void {
  const icalData = generateICalendarData(slots, calendarName)

  // Create a Blob with the iCalendar data
  const blob = new Blob([icalData], { type: "text/calendar;charset=utf-8" })

  // Create a download link and trigger it
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
