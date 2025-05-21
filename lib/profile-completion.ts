import type { UserRole } from "./types"

// Define the profile fields for each role
export interface ProfileFields {
  base: {
    [key: string]: {
      label: string
      weight: number
    }
  }
  roleSpecific: {
    [role in UserRole]: {
      [key: string]: {
        label: string
        weight: number
      }
    }
  }
}

// Define the profile fields and their weights
export const profileFields: ProfileFields = {
  base: {
    avatar: { label: "Profile Photo", weight: 10 },
    name: { label: "Full Name", weight: 10 },
    email: { label: "Email Address", weight: 10 },
    phone: { label: "Phone Number", weight: 10 },
    location: { label: "Location", weight: 10 },
    bio: { label: "Bio/About", weight: 15 },
  },
  roleSpecific: {
    owner: {
      company: { label: "Company Information", weight: 15 },
      businessCategory: { label: "Business Category", weight: 10 },
      paymentInfo: { label: "Payment Information", weight: 10 },
    },
    expert: {
      skills: { label: "Skills/Expertise", weight: 15 },
      hourlyRate: { label: "Hourly Rate", weight: 10 },
      availability: { label: "Availability Schedule", weight: 10 },
      education: { label: "Education/Certifications", weight: 10 },
    },
    client: {
      communicationPreference: { label: "Preferred Communication", weight: 15 },
      projectInterests: { label: "Project Interests", weight: 15 },
      budgetRange: { label: "Budget Range", weight: 10 },
    },
  },
}

// Define the user profile data structure
export interface UserProfileData {
  name?: string
  email?: string
  phone?: string
  location?: string
  bio?: string
  avatar?: string
  role: UserRole
  // Owner specific
  company?: string
  businessCategory?: string
  paymentInfo?: boolean
  // Expert specific
  skills?: string[]
  hourlyRate?: number
  availability?: boolean
  education?: string[]
  // Client specific
  communicationPreference?: string
  projectInterests?: string[]
  budgetRange?: [number, number]
  // Additional fields
  [key: string]: any
}

// Calculate profile completion percentage
export function calculateProfileCompletion(profile: UserProfileData): {
  percentage: number
  incompleteFields: { field: string; label: string }[]
} {
  const { role } = profile
  const baseFields = profileFields.base
  const roleFields = profileFields.roleSpecific[role]

  const allFields = { ...baseFields, ...roleFields }
  let totalWeight = 0
  let completedWeight = 0
  const incompleteFields: { field: string; label: string }[] = []

  // Calculate total weight
  Object.values(allFields).forEach((field) => {
    totalWeight += field.weight
  })

  // Calculate completed weight
  Object.entries(allFields).forEach(([field, { label, weight }]) => {
    const value = profile[field]
    const isComplete =
      (value !== undefined && value !== null && value !== "") ||
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "boolean" && value === true)

    if (isComplete) {
      completedWeight += weight
    } else {
      incompleteFields.push({ field, label })
    }
  })

  const percentage = Math.round((completedWeight / totalWeight) * 100)

  return {
    percentage,
    incompleteFields,
  }
}

// Get completion status color
export function getCompletionColor(percentage: number): string {
  if (percentage >= 67) return "text-green-500"
  if (percentage >= 34) return "text-amber-500"
  return "text-red-500"
}

// Get completion status background color
export function getCompletionBgColor(percentage: number): string {
  if (percentage >= 67) return "bg-green-500"
  if (percentage >= 34) return "bg-amber-500"
  return "bg-red-500"
}

// Get completion status message
export function getCompletionMessage(percentage: number): string {
  if (percentage >= 90) return "Excellent! Your profile is almost complete."
  if (percentage >= 67) return "Good progress! Keep going to complete your profile."
  if (percentage >= 34) return "You're making progress. Continue completing your profile."
  return "Let's get started on completing your profile."
}
