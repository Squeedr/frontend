import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Video, FileText, LinkIcon, Plus, ExternalLink, Clock, ThumbsUp, BookmarkPlus } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">Access learning materials, guides, and helpful resources.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((r) => r.type === "guide")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((r) => r.type === "video")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((r) => r.type === "document")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="links" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((r) => r.type === "link")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface Resource {
  id: string
  title: string
  description: string
  type: "guide" | "video" | "document" | "link"
  tags: string[]
  addedAt: string
  author: string
  likes: number
}

function ResourceCard({ resource }: { resource: Resource }) {
  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "guide":
        return <BookOpen className="h-5 w-5 text-blue-500" />
      case "video":
        return <Video className="h-5 w-5 text-red-500" />
      case "document":
        return <FileText className="h-5 w-5 text-gray-500" />
      case "link":
        return <LinkIcon className="h-5 w-5 text-purple-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          {getIcon(resource.type)}
          <div>
            <CardTitle className="text-base font-medium">{resource.title}</CardTitle>
            <CardDescription className="line-clamp-2 h-10 text-xs mt-1">{resource.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {resource.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>Added {resource.addedAt}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="mr-1 h-3 w-3" />
            <span>{resource.likes}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <span className="text-xs text-gray-500">By {resource.author}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <BookmarkPlus className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <span>Open</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Getting Started Guide",
    description: "A comprehensive guide to help you get started with the platform and its features.",
    type: "guide",
    tags: ["Beginner", "Onboarding"],
    addedAt: "2 weeks ago",
    author: "Admin",
    likes: 42,
  },
  {
    id: "2",
    title: "Project Management Tutorial",
    description: "Learn how to effectively manage projects using our workspace tools and features.",
    type: "video",
    tags: ["Tutorial", "Project Management"],
    addedAt: "1 month ago",
    author: "Sarah Johnson",
    likes: 28,
  },
  {
    id: "3",
    title: "Team Collaboration Best Practices",
    description: "Discover the best practices for effective team collaboration and communication.",
    type: "document",
    tags: ["Collaboration", "Teams"],
    addedAt: "3 weeks ago",
    author: "Michael Chen",
    likes: 35,
  },
  {
    id: "4",
    title: "API Documentation",
    description: "Technical documentation for integrating with our platform's API endpoints.",
    type: "link",
    tags: ["Technical", "API", "Development"],
    addedAt: "1 week ago",
    author: "Alex Rodriguez",
    likes: 19,
  },
  {
    id: "5",
    title: "Advanced Reporting Features",
    description: "Learn how to use advanced reporting features to gain insights from your data.",
    type: "video",
    tags: ["Advanced", "Reporting", "Analytics"],
    addedAt: "2 days ago",
    author: "Emma Wilson",
    likes: 12,
  },
  {
    id: "6",
    title: "Security Guidelines",
    description: "Important security guidelines and best practices for keeping your workspace secure.",
    type: "document",
    tags: ["Security", "Guidelines"],
    addedAt: "1 month ago",
    author: "Admin",
    likes: 56,
  },
]
