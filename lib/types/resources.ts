export interface Resource {
  id: string
  name: string
  category: ResourceCategory
  description: string
  image?: string
  available: boolean
  quantity: number
  chargeable: boolean
  cost?: number
}

export type ResourceCategory = "technology" | "furniture" | "catering" | "stationery" | "services"

export interface ResourceReservation {
  resourceId: string
  quantity: number
}

// Extended booking type to include resources
export interface BookingWithResources extends Booking {
  resources: ResourceReservation[]
}

// Basic booking interface (simplified for this example)
export interface Booking {
  id: string
  workspaceName: string
  workspaceLocation: string
  workspaceType: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  attendees: number
  notes?: string
}
