/**
 * Formats a date string to a human-readable format
 */
export function formatDate(dateStr: string, format: "short" | "medium" | "long" = "medium"): string {
  try {
    const date = new Date(dateStr)

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date")
    }

    switch (format) {
      case "short":
        return date.toLocaleDateString()
      case "long":
        return date.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      case "medium":
      default:
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateStr
  }
}

/**
 * Formats a time string (HH:MM) to a human-readable format
 */
export function formatTime(timeStr: string, format: "12h" | "24h" = "12h"): string {
  try {
    // Create a date object with the time
    const [hours, minutes] = timeStr.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0)

    if (format === "12h") {
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } else {
      return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }
  } catch (error) {
    console.error("Error formatting time:", error)
    return timeStr
  }
}

/**
 * Gets the relative time (e.g., "2 hours ago", "yesterday")
 */
export function getRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) {
      return "just now"
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`
    } else {
      return formatDate(dateStr, "short")
    }
  } catch (error) {
    console.error("Error calculating relative time:", error)
    return dateStr
  }
}

/**
 * Checks if a date is in the past
 */
export function isDateInPast(dateStr: string): boolean {
  try {
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  } catch (error) {
    console.error("Error checking if date is in past:", error)
    return false
  }
}

/**
 * Checks if a date is today
 */
export function isToday(dateStr: string): boolean {
  try {
    const date = new Date(dateStr)
    const today = new Date()

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  } catch (error) {
    console.error("Error checking if date is today:", error)
    return false
  }
}

/**
 * Gets the day of the week from a date string
 */
export function getDayOfWeek(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { weekday: "long" })
  } catch (error) {
    console.error("Error getting day of week:", error)
    return ""
  }
}
