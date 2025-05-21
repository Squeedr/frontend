import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, FolderKanban, Calendar } from "lucide-react"

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your workspace teams and collaboration groups.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
  projects: number
  department: string
  created: string
}

function TeamCard({ team }: { team: Team }) {
  // Only show first 5 members, with a +X for additional
  const displayMembers = team.members.slice(0, 5)
  const additionalMembers = team.members.length - 5

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{team.name}</CardTitle>
          <Badge variant="outline" className="bg-gray-100">
            {team.department}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 h-10">{team.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex -space-x-2">
          {displayMembers.map((member) => (
            <Avatar key={member.id} className="border-2 border-white h-8 w-8">
              {member.avatar ? (
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
              ) : (
                <AvatarFallback className="text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
          ))}
          {additionalMembers > 0 && (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium">
              +{additionalMembers}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{team.members.length} members</span>
          </div>
          <div className="flex items-center gap-1">
            <FolderKanban className="h-4 w-4" />
            <span>{team.projects} projects</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created {team.created}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Team
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          Manage
        </Button>
      </CardFooter>
    </Card>
  )
}

const teams: Team[] = [
  {
    id: "1",
    name: "Design Team",
    description: "Responsible for UI/UX design across all products and marketing materials.",
    department: "Design",
    projects: 8,
    created: "Jan 2023",
    members: [
      { id: "m1", name: "Sarah Johnson", role: "Lead Designer" },
      { id: "m2", name: "Michael Chen", role: "UI Designer" },
      { id: "m3", name: "Emma Wilson", role: "UX Researcher" },
      { id: "m4", name: "David Kim", role: "Graphic Designer" },
      { id: "m5", name: "Olivia Martinez", role: "Motion Designer" },
      { id: "m6", name: "James Taylor", role: "UI Designer" },
    ],
  },
  {
    id: "2",
    name: "Development Team",
    description: "Frontend and backend development for all company products and services.",
    department: "Engineering",
    projects: 12,
    created: "Nov 2022",
    members: [
      { id: "m7", name: "Alex Rodriguez", role: "Lead Developer" },
      { id: "m8", name: "Jessica Lee", role: "Frontend Developer" },
      { id: "m9", name: "Ryan Patel", role: "Backend Developer" },
      { id: "m10", name: "Sophia Wang", role: "Full Stack Developer" },
    ],
  },
  {
    id: "3",
    name: "Marketing Team",
    description: "Handles all marketing campaigns, content creation, and brand management.",
    department: "Marketing",
    projects: 6,
    created: "Mar 2023",
    members: [
      { id: "m11", name: "Daniel Brown", role: "Marketing Director" },
      { id: "m12", name: "Natalie Garcia", role: "Content Strategist" },
      { id: "m13", name: "Christopher Davis", role: "Social Media Manager" },
      { id: "m14", name: "Amanda Wilson", role: "SEO Specialist" },
      { id: "m15", name: "Thomas Moore", role: "Brand Manager" },
      { id: "m16", name: "Rebecca Johnson", role: "Marketing Analyst" },
      { id: "m17", name: "Kevin Zhang", role: "Graphic Designer" },
    ],
  },
]
