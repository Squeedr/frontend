"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus } from "lucide-react"
import { useRole } from "@/hooks/use-role"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { workspacesApi } from "@/lib/api/workspaces"
import { getWorkspaceImage } from "@/lib/image-utils"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { CreateWorkspaceModal } from "@/components/create-workspace-modal"
import { useToast } from "@/hooks/use-toast"
import type { Workspace } from "@/lib/types"

export default function WorkspacesPage() {
  const { role } = useRole()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [workspacesList, setWorkspacesList] = useState<Workspace[]>([])
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false)

  // Fetch workspaces from the backend on page load
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await workspacesApi.getAll()
        // Strapi returns data in a specific format, we need to extract the actual workspaces
        const workspaces = response.data || []
        setWorkspacesList(workspaces)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
        toast({
          title: "Error fetching workspaces",
          description: "There was a problem loading workspaces. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaces()
  }, [toast])

  // Filter workspaces based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // If search is empty, fetch all workspaces again
      const fetchWorkspaces = async () => {
        try {
          const response = await workspacesApi.getAll()
          const workspaces = response.data || []
          setWorkspacesList(workspaces)
        } catch (error) {
          console.error("Error fetching workspaces:", error)
        }
      }
      
      fetchWorkspaces()
    } else {
      // If search has a value, filter on the client side
      const query = searchQuery.toLowerCase()
      const filtered = workspacesList.filter(
        (workspace) =>
          workspace.name.toLowerCase().includes(query) ||
          workspace.description.toLowerCase().includes(query) ||
          workspace.location.toLowerCase().includes(query),
      )
      setWorkspacesList(filtered)
    }
  }, [searchQuery])

  // Only owners can create/edit/delete workspaces
  const canManageWorkspaces = role === "owner"

  const handleWorkspaceCreated = (newWorkspace: Workspace) => {
    setWorkspacesList(prev => [newWorkspace, ...prev])
    toast({
      title: "Workspace Created",
      description: `${newWorkspace.name} has been created successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground">Manage and book workspaces for your team and clients.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workspaces..."
              className="pl-8 w-[200px] md:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>

          {canManageWorkspaces && (
            <Button onClick={() => setIsCreateWorkspaceModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Workspace
            </Button>
          )}
        </div>
      </div>

      <CreateWorkspaceModal 
        isOpen={isCreateWorkspaceModalOpen}
        onOpenChange={setIsCreateWorkspaceModalOpen}
        onWorkspaceCreated={handleWorkspaceCreated}
        hideButton={true}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Workspaces</TabsTrigger>
          <TabsTrigger value="available">Available Now</TabsTrigger>
          <TabsTrigger value="booked">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 rounded-b-none" />
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : workspacesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspacesList.map((workspace) => (
                <Card key={workspace.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <OptimizedImage
                      src={getWorkspaceImage(workspace.image || "abstract-geometric-shapes.png")}
                      alt={workspace.name}
                      width={400}
                      height={200}
                      objectFit="cover"
                      className="w-full h-full"
                    />
                    <Badge
                      variant={workspace.availability === "Available" ? "default" : "destructive"}
                      className="absolute top-2 right-2"
                    >
                      {workspace.availability}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{workspace.name}</CardTitle>
                    <CardDescription>{workspace.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-2">{workspace.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline">Capacity: {workspace.capacity}</Badge>
                      <Badge variant="outline">WiFi</Badge>
                      <Badge variant="outline">Projector</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">Book Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No workspaces found matching your search.</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">This tab will show workspaces that are currently available.</p>
          </div>
        </TabsContent>

        <TabsContent value="booked" className="mt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">This tab will show your upcoming workspace bookings.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
