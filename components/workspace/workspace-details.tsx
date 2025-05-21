import { MapPin, Users, Monitor, Wifi, Coffee } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock workspace data with more details
const workspaceDetails = {
  ws1: {
    name: "Conference Room A",
    location: "Floor 1, East Wing",
    type: "Conference Room",
    capacity: 12,
    amenities: ["Projector", "Video Conferencing", "Whiteboard", "Air Conditioning", "Coffee Machine"],
    description: "A large conference room ideal for team meetings, client presentations, and workshops.",
    image: "/modern-conference-room.png",
  },
  ws2: {
    name: "Meeting Room B",
    location: "Floor 2, West Wing",
    type: "Meeting Room",
    capacity: 6,
    amenities: ["TV Screen", "Whiteboard", "Air Conditioning"],
    description: "A medium-sized meeting room suitable for small team discussions and interviews.",
    image: "/modern-meeting-room.png",
  },
  ws3: {
    name: "Quiet Office",
    location: "Floor 3, North Wing",
    type: "Office",
    capacity: 2,
    amenities: ["Desk", "Phone", "Natural Light"],
    description: "A quiet office space for focused work or one-on-one meetings.",
    image: "/quiet-office.png",
  },
  ws4: {
    name: "Collaboration Space",
    location: "Floor 1, Central Area",
    type: "Collaboration Space",
    capacity: 8,
    amenities: ["Whiteboards", "Flexible Furniture", "TV Screen"],
    description: "An open collaboration space designed for creative teamwork and brainstorming sessions.",
    image: "/modern-collaboration-space.png",
  },
  ws5: {
    name: "Meeting Room C",
    location: "Floor 2, East Wing",
    type: "Meeting Room",
    capacity: 4,
    amenities: ["TV Screen", "Whiteboard"],
    description: "A small meeting room for quick discussions and check-ins.",
    image: "/modern-meeting-room.png",
  },
  ws6: {
    name: "Phone Booth 1",
    location: "Floor 2, Central Area",
    type: "Phone Booth",
    capacity: 1,
    amenities: ["Phone", "Desk", "Sound Insulation"],
    description: "A private booth for phone calls and video conferences.",
    image: "/classic-phone-booth.png",
  },
  ws7: {
    name: "Phone Booth 2",
    location: "Floor 2, Central Area",
    type: "Phone Booth",
    capacity: 1,
    amenities: ["Phone", "Desk", "Sound Insulation"],
    description: "A private booth for phone calls and video conferences.",
    image: "/classic-phone-booth.png",
  },
  ws8: {
    name: "Open Desk Area",
    location: "Floor 3, South Wing",
    type: "Open Space",
    capacity: 20,
    amenities: ["Desks", "Power Outlets", "Natural Light", "Coffee Station"],
    description: "An open area with multiple desks for flexible working arrangements.",
    image: "/modern-open-office.png",
  },
}

// Helper function to get amenity icon
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase()
  if (amenityLower.includes("projector") || amenityLower.includes("tv") || amenityLower.includes("screen")) {
    return <Monitor className="h-3 w-3" />
  }
  if (amenityLower.includes("wifi") || amenityLower.includes("internet")) {
    return <Wifi className="h-3 w-3" />
  }
  if (amenityLower.includes("coffee")) {
    return <Coffee className="h-3 w-3" />
  }
  return null
}

interface WorkspaceDetailsProps {
  workspaceId: string
}

export function WorkspaceDetails({ workspaceId }: WorkspaceDetailsProps) {
  const workspace = workspaceDetails[workspaceId as keyof typeof workspaceDetails]

  if (!workspace) {
    return <div className="text-muted-foreground">Please select a workspace to view details.</div>
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <img src={workspace.image || "/placeholder.svg"} alt={workspace.name} className="h-full w-full object-cover" />
      </div>

      <div>
        <h3 className="text-lg font-medium">{workspace.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="mr-1 h-3 w-3" />
          {workspace.location}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline">{workspace.type}</Badge>
        <div className="flex items-center text-sm">
          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
          <span>{workspace.capacity} people</span>
        </div>
      </div>

      <div>
        <p className="text-sm">{workspace.description}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {workspace.amenities.map((amenity, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
