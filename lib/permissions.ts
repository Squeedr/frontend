import type { UserRole } from "@/lib/types"

// Define permission categories
export type PermissionCategory =
  | "dashboard"
  | "sessions"
  | "calendar"
  | "experts"
  | "workspaces"
  | "ratings"
  | "messages"
  | "invoices"
  | "notifications"
  | "availability"
  | "settings"
  | "profile"
  | "users"
  | "roles"
  | "reports"
  | "analytics"

// Define permission actions
export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export" | "import"

// Define permission key format: category:action
export type Permission = `${PermissionCategory}:${PermissionAction}`

// Define default role permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    // Dashboard permissions
    "dashboard:view",
    "dashboard:edit",

    // Sessions permissions
    "sessions:view",
    "sessions:create",
    "sessions:edit",
    "sessions:delete",

    // Calendar permissions
    "calendar:view",
    "calendar:create",
    "calendar:edit",
    "calendar:delete",

    // Experts permissions
    "experts:view",
    "experts:create",
    "experts:edit",
    "experts:delete",

    // Workspaces permissions
    "workspaces:view",
    "workspaces:create",
    "workspaces:edit",
    "workspaces:delete",

    // Ratings permissions
    "ratings:view",
    "ratings:create",
    "ratings:edit",
    "ratings:delete",

    // Messages permissions
    "messages:view",
    "messages:create",
    "messages:edit",
    "messages:delete",

    // Invoices permissions
    "invoices:view",
    "invoices:create",
    "invoices:edit",
    "invoices:delete",
    "invoices:approve",
    "invoices:export",

    // Notifications permissions
    "notifications:view",
    "notifications:create",
    "notifications:edit",
    "notifications:delete",

    // Availability permissions
    "availability:view",
    "availability:create",
    "availability:edit",
    "availability:delete",

    // Settings permissions
    "settings:view",
    "settings:edit",

    // Profile permissions
    "profile:view",
    "profile:edit",

    // Users permissions
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "users:import",
    "users:export",

    // Roles permissions
    "roles:view",
    "roles:create",
    "roles:edit",
    "roles:delete",

    // Reports permissions
    "reports:view",
    "reports:create",
    "reports:export",

    // Analytics permissions
    "analytics:view",
  ],

  expert: [
    // Dashboard permissions
    "dashboard:view",

    // Sessions permissions
    "sessions:view",
    "sessions:create",
    "sessions:edit",

    // Calendar permissions
    "calendar:view",
    "calendar:create",
    "calendar:edit",

    // Experts permissions (limited)
    "experts:view",

    // Workspaces permissions (limited)
    "workspaces:view",

    // Ratings permissions (limited)
    "ratings:view",

    // Messages permissions
    "messages:view",
    "messages:create",
    "messages:edit",

    // Invoices permissions (limited)
    "invoices:view",
    "invoices:create",

    // Notifications permissions
    "notifications:view",
    "notifications:edit",

    // Availability permissions
    "availability:view",
    "availability:create",
    "availability:edit",

    // Profile permissions
    "profile:view",
    "profile:edit",

    // Reports permissions (limited)
    "reports:view",
  ],

  client: [
    // Dashboard permissions
    "dashboard:view",

    // Sessions permissions (limited)
    "sessions:view",
    "sessions:create",

    // Calendar permissions (limited)
    "calendar:view",
    "calendar:create",

    // Experts permissions (limited)
    "experts:view",

    // Messages permissions
    "messages:view",
    "messages:create",

    // Invoices permissions (very limited)
    "invoices:view",

    // Notifications permissions
    "notifications:view",
    "notifications:edit",

    // Profile permissions
    "profile:view",
    "profile:edit",

    // Ratings permissions (create only)
    "ratings:create",
  ],
}

// Helper function to check if a user has a specific permission
export function hasPermission(
  userPermissions: Permission[] | undefined,
  requiredPermission: Permission | Permission[],
): boolean {
  if (!userPermissions) return false

  if (Array.isArray(requiredPermission)) {
    // If any of the permissions are required, check if user has at least one
    return requiredPermission.some((permission) => userPermissions.includes(permission))
  }

  // Check for a single permission
  return userPermissions.includes(requiredPermission)
}

// Helper function to get permissions for a role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || []
}

// Helper function to get permissions for a category
export function getPermissionsForCategory(category: PermissionCategory): Permission[] {
  const allPermissions: Permission[] = []
  const actions: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "export", "import"]

  actions.forEach((action) => {
    const permission = `${category}:${action}` as Permission
    allPermissions.push(permission)
  })

  return allPermissions
}

// Helper function to get a human-readable name for a permission
export function getPermissionName(permission: Permission): string {
  const [category, action] = permission.split(":") as [PermissionCategory, PermissionAction]

  const categoryNames: Record<PermissionCategory, string> = {
    dashboard: "Dashboard",
    sessions: "Sessions",
    calendar: "Calendar",
    experts: "Experts",
    workspaces: "Workspaces",
    ratings: "Ratings",
    messages: "Messages",
    invoices: "Invoices",
    notifications: "Notifications",
    availability: "Availability",
    settings: "Settings",
    profile: "Profile",
    users: "Users",
    roles: "Roles",
    reports: "Reports",
    analytics: "Analytics",
  }

  const actionNames: Record<PermissionAction, string> = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    approve: "Approve",
    export: "Export",
    import: "Import",
  }

  return `${actionNames[action]} ${categoryNames[category]}`
}

// Get all available permissions
export function getAllPermissions(): Permission[] {
  const allPermissions: Permission[] = []
  const categories: PermissionCategory[] = [
    "dashboard",
    "sessions",
    "calendar",
    "experts",
    "workspaces",
    "ratings",
    "messages",
    "invoices",
    "notifications",
    "availability",
    "settings",
    "profile",
    "users",
    "roles",
    "reports",
    "analytics",
  ]

  categories.forEach((category) => {
    allPermissions.push(...getPermissionsForCategory(category))
  })

  return allPermissions
}
