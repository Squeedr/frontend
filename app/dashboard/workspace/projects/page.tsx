import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderKanban, Plus, Users, Calendar } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your workspace projects and team collaboration.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {archivedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...projects, ...archivedProjects].map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "archived"
  members: number
  tasks: number
  dueDate: string
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className={project.status === "archived" ? "opacity-70" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
          <div
            className={`px-2 py-1 text-xs rounded-full ${
              project.status === "active" ? "bg-gray-100 text-gray-800" : "bg-gray-200 text-gray-700"
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </div>
        </div>
        <CardDescription className="line-clamp-2 h-10">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.members}</span>
          </div>
          <div className="flex items-center gap-1">
            <FolderKanban className="h-4 w-4" />
            <span>{project.tasks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{project.dueDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Project
        </Button>
      </CardFooter>
    </Card>
  )
}

const projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign the company website with improved UX and modern design elements.",
    status: "active",
    members: 5,
    tasks: 24,
    dueDate: "Jun 30",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Create a cross-platform mobile application for client management.",
    status: "active",
    members: 8,
    tasks: 36,
    dueDate: "Aug 15",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Plan and execute Q3 marketing campaign across digital channels.",
    status: "active",
    members: 4,
    tasks: 18,
    dueDate: "Jul 22",
  },
]

const archivedProjects: Project[] = [
  {
    id: "4",
    name: "Brand Identity",
    description: "Develop new brand guidelines and visual identity system.",
    status: "archived",
    members: 3,
    tasks: 12,
    dueDate: "May 10",
  },
  {
    id: "5",
    name: "Content Strategy",
    description: "Create content strategy for blog and social media channels.",
    status: "archived",
    members: 2,
    tasks: 8,
    dueDate: "Apr 28",
  },
]
