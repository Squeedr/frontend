import { MapPin, Users, Monitor, Wifi, Coffee } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getWorkspaceImage } from "@/lib/image-utils"
import { OptimizedImage } from "@/components/ui/optimized-image"
import type { Workspace } from "@/lib/types"

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

interface WorkspaceDetailsContentProps {
  workspace: Workspace
}

export function WorkspaceDetailsContent({ workspace }: WorkspaceDetailsContentProps) {
  if (!workspace) return null

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <OptimizedImage
          src={getWorkspaceImage(workspace.image || "placeholder.svg")}
          alt={workspace.name}
          width={800}
          height={450}
          objectFit="cover"
          className="h-full w-full"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">{workspace.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="mr-1 h-3 w-3" />
          {workspace.location}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center text-sm">
          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
          <span>{workspace.capacity} people</span>
        </div>
        {workspace.availability && (
          <Badge variant="outline">{workspace.availability}</Badge>
        )}
      </div>

      <div>
        <p className="text-sm">{workspace.description}</p>
      </div>

      {workspace.amenities && workspace.amenities.length > 0 && (
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
      )}
    </div>
  )
} 