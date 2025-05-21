import { formatDistanceToNow, parseISO, format, isValid } from "date-fns"

/**
 * Formats a date string to a relative time (e.g., "2 hours ago")
 * @param dateString ISO date string
 * @param fallback Fallback text if date is invalid
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string, fallback = "Unknown date"): string {
  try {
    const date = parseISO(dateString)

    if (!isValid(date)) {
      return fallback
    }

    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    console.error("Error formatting date:", error)
    return fallback
  }
}

/**
 * Formats a date string to a specific format
 * @param dateString ISO date string or Date object
 * @param formatString Format string (default: "MMM d, yyyy")
 * @param fallback Fallback text if date is invalid
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, formatString = "MMM d, yyyy", fallback = "Invalid date"): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString

    if (!isValid(date)) {
      return fallback
    }

    return format(date, formatString)
  } catch (error) {
    console.error("Error formatting date:", error)
    return fallback
  }
}

/**
 * Formats a time string (HH:MM) to a more readable format
 * @param timeString Time string in HH:MM format
 * @param formatString Format string (default: "h:mm a")
 * @returns Formatted time string
 */
export function formatTime(timeString: string, formatString = "h:mm a"): string {
  try {
    // Create a date object with the time string
    const [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    if (!isValid(date)) {
      return timeString
    }

    return format(date, formatString)
  } catch (error) {
    console.error("Error formatting time:", error)
    return timeString
  }
}

/**
 * Combines a date string and time string into a single Date object
 * @param dateString Date string in YYYY-MM-DD format
 * @param timeString Time string in HH:MM format
 * @returns Combined Date object
 */
export function combineDateAndTime(dateString: string, timeString: string): Date {
  try {
    const [year, month, day] = dateString.split("-").map(Number)
    const [hours, minutes] = timeString.split(":").map(Number)

    return new Date(year, month - 1, day, hours, minutes, 0, 0)
  } catch (error) {
    console.error("Error combining date and time:", error)
    return new Date()
  }
}
