/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password (min 8 chars, at least 1 letter and 1 number)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
}

/**
 * Validates a name (non-empty, only letters, spaces, hyphens)
 */
export function isValidName(name: string): boolean {
  return name.trim().length > 0 && /^[A-Za-z\s-]+$/.test(name)
}

/**
 * Validates a date string (YYYY-MM-DD)
 */
export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false

  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Validates a time string (HH:MM)
 */
export function isValidTime(timeStr: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(timeStr)
}

/**
 * Validates a price (positive number with up to 2 decimal places)
 */
export function isValidPrice(price: number): boolean {
  return price >= 0 && /^\d+(\.\d{1,2})?$/.test(price.toString())
}

/**
 * Validates a URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Validates a phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9]{10,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}
