import type { User } from "./mock-access"

// Convert users array to CSV string
export function usersToCSV(users: User[]): string {
  // CSV header
  const header = ["Name", "Email", "Role", "Status"]

  // Convert users to CSV rows
  const rows = users.map((user) => [user.name, user.email, user.role, user.status])

  // Combine header and rows
  const csvContent = [header.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

// Parse CSV string to users array
export function csvToUsers(csv: string): Partial<User>[] {
  try {
    // Split CSV into rows
    const rows = csv.split("\n")

    // Get header row and find column indices
    const header = rows[0].split(",")
    const nameIndex = header.findIndex((col) => col.toLowerCase().includes("name"))
    const emailIndex = header.findIndex((col) => col.toLowerCase().includes("email"))
    const roleIndex = header.findIndex((col) => col.toLowerCase().includes("role"))
    const statusIndex = header.findIndex((col) => col.toLowerCase().includes("status"))

    // Parse data rows
    const users: Partial<User>[] = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue

      const columns = rows[i].split(",")

      // Create user object
      const user: Partial<User> = {
        name: nameIndex >= 0 ? columns[nameIndex].trim() : undefined,
        email: emailIndex >= 0 ? columns[emailIndex].trim() : "",
        role: roleIndex >= 0 ? validateRole(columns[roleIndex].trim()) : "client",
        status: statusIndex >= 0 ? validateStatus(columns[statusIndex].trim()) : "invited",
      }

      // Only add user if email is provided
      if (user.email) {
        users.push(user)
      }
    }

    return users
  } catch (error) {
    console.error("Error parsing CSV:", error)
    return []
  }
}

// Validate role value
function validateRole(role: string): "owner" | "expert" | "client" | string {
  const validRoles = ["owner", "expert", "client", "custom"]
  const normalizedRole = role.toLowerCase()

  return validRoles.includes(normalizedRole) ? normalizedRole : "client"
}

// Validate status value
function validateStatus(status: string): "active" | "invited" | "suspended" {
  const validStatuses = ["active", "invited", "suspended"]
  const normalizedStatus = status.toLowerCase()

  return validStatuses.includes(normalizedStatus) ? (normalizedStatus as "active" | "invited" | "suspended") : "invited"
}

// Download CSV file
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
