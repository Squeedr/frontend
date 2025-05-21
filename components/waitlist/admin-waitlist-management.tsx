"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Users, Search, Filter, CheckCircle, X, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { mockWaitlistRequests } from "@/lib/mock-waitlist-data"
import type { WaitlistRequest } from "@/lib/types/waitlist"
import { PermissionGuard } from "@/components/guards/permission-guard"

export function AdminWaitlistManagement() {
  const { toast } = useToast()
  const [waitlistRequests, setWaitlistRequests] = useState<WaitlistRequest[]>(mockWaitlistRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [workspaceFilter, setWorkspaceFilter] = useState("all")

  // Get unique workspace IDs and names for the filter
  const workspaces = Array.from(new Set(waitlistRequests.map((request) => request.workspaceId))).map((id) => {
    const request = waitlistRequests.find((r) => r.workspaceId === id)
    return {
      id,
      name: request?.workspaceName || "Unknown Workspace",
    }
  })

  // Filter waitlist requests based on search query and filters
  const filteredRequests = waitlistRequests.filter((request) => {
    const matchesSearch =
      request.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.workspaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesWorkspace = workspaceFilter === "all" || request.workspaceId === workspaceFilter

    return matchesSearch && matchesStatus && matchesWorkspace
  })

  // Separate requests by status
  const pendingRequests = filteredRequests.filter((request) => request.status === "pending")
  const notifiedRequests = filteredRequests.filter((request) => request.status === "notified")
  const otherRequests = filteredRequests.filter((request) => !["pending", "notified"].includes(request.status))

  const handleNotifyUser = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

      setWaitlistRequests(
        waitlistRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "notified",
                notifiedAt: now.toISOString(),
                expiresAt: expiresAt.toISOString(),
              }
            : request,
        ),
      )

      // Show success toast
      toast({
        title: "User notified",
        description: "The user has been notified about the available space.",
      })
    } catch (error) {
      toast({
        title: "Failed to notify user",
        description: "There was an error notifying the user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      setWaitlistRequests(
        waitlistRequests.map((request) => (request.id === requestId ? { ...request, status: "cancelled" } : request)),
      )

      // Show success toast
      toast({
        title: "Request cancelled",
        description: "The waitlist request has been cancelled.",
      })
    } catch (error) {
      toast({
        title: "Failed to cancel request",
        description: "There was an error cancelling the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Pending
          </Badge>
        )
      case "notified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Notified
          </Badge>
        )
      case "fulfilled":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fulfilled
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Expired
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <PermissionGuard allowedRoles={["owner"]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Waitlist Management</h2>
          <p className="text-muted-foreground">Manage workspace waitlist requests</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by user, workspace, or purpose..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="notified">Notified</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workspaceFilter} onValueChange={setWorkspaceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workspaces</SelectItem>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="notified">Notified ({notifiedRequests.length})</TabsTrigger>
            <TabsTrigger value="other">Other ({otherRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{request.workspaceName}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <MapPin className="mr-1 h-3 w-3" />
                        {request.workspaceName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="text-sm font-medium">Requested by: {request.userName}</div>
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(parseISO(request.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {request.startTime} - {request.endTime}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{request.attendees} attendees</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Purpose:</span> {request.purpose}
                      </div>
                      {request.notes && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Notes:</span> {request.notes}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        Requested on {format(parseISO(request.requestedAt), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleNotifyUser(request.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Notify User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No pending waitlist requests.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notified" className="space-y-4">
            {notifiedRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notifiedRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{request.workspaceName}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <MapPin className="mr-1 h-3 w-3" />
                        {request.workspaceName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="text-sm font-medium">Requested by: {request.userName}</div>
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(parseISO(request.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {request.startTime} - {request.endTime}
                          </span>
                        </div>
                      </div>

                      <Alert className="mt-3 bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">User Notified</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          User was notified on{" "}
                          {request.notifiedAt && format(parseISO(request.notifiedAt), "MMM d 'at' h:mm a")}.
                          {request.expiresAt && (
                            <span className="block mt-1">
                              Expires at {format(parseISO(request.expiresAt), "h:mm a")}
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No notified waitlist requests.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            {otherRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {otherRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden opacity-80">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{request.workspaceName}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription className="flex items-center text-xs">
                        <MapPin className="mr-1 h-3 w-3" />
                        {request.workspaceName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="text-sm font-medium">Requested by: {request.userName}</div>
                      <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(parseISO(request.date), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {request.startTime} - {request.endTime}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{request.attendees} attendees</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Purpose:</span> {request.purpose}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Requested on {format(parseISO(request.requestedAt), "MMM d, yyyy")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No other waitlist requests.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}
