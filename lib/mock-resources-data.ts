import type { Resource } from "./types/resources"

export const availableResources: Resource[] = [
  // Technology
  {
    id: "res-001",
    name: "Projector",
    category: "technology",
    description: "HD projector with HDMI and VGA connections",
    image: "/home-theater-projector.png",
    available: true,
    quantity: 5,
    chargeable: false,
  },
  {
    id: "res-002",
    name: "Video Conferencing System",
    category: "technology",
    description: "Professional video conferencing setup with camera and microphone",
    image: "/video-conference-setup.png",
    available: true,
    quantity: 3,
    chargeable: false,
  },
  {
    id: "res-003",
    name: "Wireless Presenter",
    category: "technology",
    description: "Wireless presenter with laser pointer",
    image: "/placeholder.svg?key=0sox3",
    available: true,
    quantity: 8,
    chargeable: false,
  },
  {
    id: "res-004",
    name: "Laptop",
    category: "technology",
    description: "Windows laptop with standard office software",
    image: "/modern-laptop-workspace.png",
    available: true,
    quantity: 4,
    chargeable: true,
    cost: 25,
  },

  // Furniture
  {
    id: "res-005",
    name: "Whiteboard",
    category: "furniture",
    description: "Mobile whiteboard with markers",
    image: "/blank-whiteboard.png",
    available: true,
    quantity: 6,
    chargeable: false,
  },
  {
    id: "res-006",
    name: "Flipchart Stand",
    category: "furniture",
    description: "Flipchart stand with paper",
    image: "/placeholder.svg?key=64gfc",
    available: true,
    quantity: 4,
    chargeable: false,
  },
  {
    id: "res-007",
    name: "Additional Chairs",
    category: "furniture",
    description: "Extra chairs for larger meetings",
    image: "/ergonomic-office-chair.png",
    available: true,
    quantity: 20,
    chargeable: false,
  },

  // Catering
  {
    id: "res-008",
    name: "Coffee & Tea Service",
    category: "catering",
    description: "Coffee and tea service for up to 10 people",
    image: "/elegant-coffee-service.png",
    available: true,
    quantity: 5,
    chargeable: true,
    cost: 15,
  },
  {
    id: "res-009",
    name: "Water Service",
    category: "catering",
    description: "Bottled water service for up to 10 people",
    image: "/placeholder.svg?height=100&width=100&query=bottled water",
    available: true,
    quantity: 10,
    chargeable: true,
    cost: 8,
  },
  {
    id: "res-010",
    name: "Lunch Catering",
    category: "catering",
    description: "Basic lunch catering (sandwiches, salads) per person",
    image: "/placeholder.svg?height=100&width=100&query=lunch catering",
    available: true,
    quantity: 50,
    chargeable: true,
    cost: 12,
  },

  // Stationery
  {
    id: "res-011",
    name: "Stationery Kit",
    category: "stationery",
    description: "Pens, notepads, sticky notes, and markers",
    image: "/placeholder.svg?height=100&width=100&query=stationery",
    available: true,
    quantity: 15,
    chargeable: false,
  },
  {
    id: "res-012",
    name: "Whiteboard Markers",
    category: "stationery",
    description: "Set of whiteboard markers (4 colors)",
    image: "/placeholder.svg?height=100&width=100&query=whiteboard markers",
    available: true,
    quantity: 20,
    chargeable: false,
  },

  // Services
  {
    id: "res-013",
    name: "IT Support",
    category: "services",
    description: "On-call IT support during your meeting",
    image: "/placeholder.svg?height=100&width=100&query=IT support",
    available: true,
    quantity: 2,
    chargeable: true,
    cost: 35,
  },
  {
    id: "res-014",
    name: "Room Setup",
    category: "services",
    description: "Custom room setup according to your specifications",
    image: "/placeholder.svg?height=100&width=100&query=room setup",
    available: true,
    quantity: 5,
    chargeable: true,
    cost: 20,
  },
  {
    id: "res-015",
    name: "Recording Service",
    category: "services",
    description: "Professional recording of your meeting or presentation",
    image: "/placeholder.svg?height=100&width=100&query=recording service",
    available: true,
    quantity: 2,
    chargeable: true,
    cost: 50,
  },
]

// Helper function to get resources by category
export function getResourcesByCategory(category: string) {
  return availableResources.filter((resource) => resource.category === category)
}

// Helper function to get a resource by ID
export function getResourceById(id: string) {
  return availableResources.find((resource) => resource.id === id)
}

// Helper function to calculate total cost of resources
export function calculateResourcesCost(reservations: { resourceId: string; quantity: number }[]) {
  return reservations.reduce((total, reservation) => {
    const resource = getResourceById(reservation.resourceId)
    if (resource && resource.chargeable && resource.cost) {
      return total + resource.cost * reservation.quantity
    }
    return total
  }, 0)
}
