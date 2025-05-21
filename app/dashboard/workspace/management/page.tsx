"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { useToast } from "@/hooks/use-toast"
import { Building, Calendar, Clock, Download, Edit, Filter, Plus, Search, Settings, Trash2, Users } from "lucide-react"
import { workspaces } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Mock booking requests data
const bookingRequests = [
  {
    id: "br1",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userAvatar: "/diverse-woman-portrait.png",
    workspaceName: "Conference Room A",
    date: "2024-05-15",
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Client Meeting",
    attendees: 6,
    status: "pending",
  },
  {
    id: "br2",
    userName: "John Doe",
    userEmail: "john@example.com",
    userAvatar: "/stylized-jd-initials.png",
    workspaceName: "Meeting Room B",
    date: "2024-05-16",
    startTime: "14:00",
    endTime: "15:30",
    purpose: "Team Brainstorming",
    attendees: 4,
    status: "pending",
  },
  {
    id: "br3",
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
    userAvatar: "/diverse-avatars.png",
    workspaceName: "Quiet Office",
    date: "2024-05-17",
    startTime: "09:00",
    endTime: "17:00",
    purpose: "Focused Work",
    attendees: 1,
    status: "pending",
  },
]

// Mock upcoming bookings data
const upcomingBookings = [
  {
    id: "ub1",
    userName: "Michael Wilson",
    userEmail: "michael@example.com",
    userAvatar: "/diverse-avatars.png",
    workspaceName: "Conference Room A",
    date: "2024-05-14",
    startTime: "13:00",
    endTime: "15:00",
    purpose: "Client Presentation",
    attendees: 8,
    status: "approved",
  },
  {
    id: "ub2",
    userName: "David Lee",
    userEmail: "david@example.com",
    userAvatar: "/diverse-avatars.png",
    workspaceName: "Collaboration Space",
    date: "2024-05-14",
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Design Sprint",
    attendees: 5,
    status: "approved",
  },
  {
    id: "ub3",
    userName: "Alice Williams",
    userEmail: "alice@example.com",
    userAvatar: "/diverse-woman-portrait.png",
    workspaceName: "Meeting Room B",
    date: "2024-05-15",
    startTime: "09:00",
    endTime: "10:30",
    purpose: "Project Kickoff",
    attendees: 4,
    status: "approved",
  },
  {
    id: "ub4",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    userAvatar: "/diverse-avatars.png",
    workspaceName: "Quiet Office",
    date: "2024-05-15",
    startTime: "13:00",
    endTime: "17:00",
    purpose: "Client Calls",
    attendees: 1,
    status: "approved",
  },
]

export default function WorkspaceManagementPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const handleApproveBooking = (id: string) => {
    toast({
      title: "Booking Approved",
      description: "The workspace booking has been approved.",
    })
  }

  const handleRejectBooking = (id: string) => {
    toast({
      title: "Booking Rejected",
      description: "The workspace booking has been rejected.",
    })
  }

  const handleAddWorkspace = () => {
    toast({
      title: "Add Workspace",
      description: "Opening workspace creation form.",
    })
  }

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const matchesSearch =
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workspace.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || workspace.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <PermissionGuard allowedRoles={["owner"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workspace Management</h1>
            <p className="text-muted-foreground mt-1">Manage workspaces, bookings, and analytics</p>
          </div>
          <Button onClick={handleAddWorkspace}>
            <Plus className="mr-2 h-4 w-4" />
            Add Workspace
          </Button>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Workspaces</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workspaces.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                  <p className="text-xs text-muted-foreground">+8 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookingRequests.length}</div>
                  <p className="text-xs text-muted-foreground">-2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Pending Booking Requests</CardTitle>
                  <CardDescription>Approve or reject workspace booking requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookingRequests.length > 0 ? (
                      bookingRequests.map((request) => (
                        <div key={request.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={request.userAvatar || "/placeholder.svg"} alt={request.userName} />
                            <AvatarFallback>{request.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{request.userName}</p>
                              <Badge variant="outline">{request.workspaceName}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(request.date).toLocaleDateString()} • {request.startTime} - {request.endTime}
                            </p>
                            <p className="text-xs">
                              {request.purpose} • {request.attendees} attendees
                            </p>
                            <div className="flex space-x-2 mt-2">
                              <Button size="sm" variant="default" onClick={() => handleApproveBooking(request.id)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectBooking(request.id)}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No pending booking requests</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Workspace Utilization</CardTitle>
                  <CardDescription>Utilization rate by workspace type</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={[
                      { name: "Conference Room", value: 85, color: "var(--chart-1)" },
                      { name: "Meeting Room", value: 75, color: "var(--chart-2)" },
                      { name: "Office", value: 60, color: "var(--chart-3)" },
                      { name: "Collaboration Space", value: 90, color: "var(--chart-4)" },
                      { name: "Desk", value: 70, color: "var(--chart-5)" },
                    ]}
                    nameKey="name"
                    valueKey="value"
                    colorKey="color"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Next 7 days of workspace bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={booking.userAvatar || "/placeholder.svg"} alt={booking.userName} />
                        <AvatarFallback>{booking.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{booking.userName}</p>
                          <Badge variant="outline">{booking.workspaceName}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                        </p>
                        <p className="text-xs">
                          {booking.purpose} • {booking.attendees} attendees
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>Manage all workspace bookings</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...bookingRequests, ...upcomingBookings].map((booking) => (
                    <div key={booking.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={booking.userAvatar || "/placeholder.svg"} alt={booking.userName} />
                        <AvatarFallback>{booking.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{booking.userName}</p>
                          <Badge variant={booking.status === "pending" ? "secondary" : "outline"}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs">
                            {booking.purpose} • {booking.attendees} attendees
                          </p>
                          <Badge variant="outline">{booking.workspaceName}</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {booking.status === "pending" ? (
                          <>
                            <Button size="sm" variant="default" onClick={() => handleApproveBooking(booking.id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectBooking(booking.id)}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workspaces" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search workspaces..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Conference Room">Conference Room</SelectItem>
                    <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Collaboration Space">Collaboration Space</SelectItem>
                    <SelectItem value="Desk">Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddWorkspace}>
                <Plus className="mr-2 h-4 w-4" />
                Add Workspace
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWorkspaces.map((workspace) => (
                <Card key={workspace.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={workspace.image || "/placeholder.svg"}
                      alt={workspace.name}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      <Badge variant={workspace.availability === "Available" ? "outline" : "secondary"}>
                        {workspace.availability}
                      </Badge>
                    </div>
                    <CardDescription>{workspace.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{workspace.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{workspace.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{workspace.capacity} people</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Utilization:</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Monthly booking trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={[
                      { name: "Jan", value: 45 },
                      { name: "Feb", value: 52 },
                      { name: "Mar", value: 48 },
                      { name: "Apr", value: 61 },
                      { name: "May", value: 67 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workspace Popularity</CardTitle>
                  <CardDescription>Most frequently booked workspaces</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Conference Room A", value: 32 },
                      { name: "Meeting Room B", value: 28 },
                      { name: "Collaboration Space", value: 24 },
                      { name: "Quiet Office", value: 18 },
                      { name: "Open Workspace", value: 15 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Purpose</CardTitle>
                  <CardDescription>Distribution of booking purposes</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={[
                      { name: "Client Meetings", value: 35, color: "var(--chart-1)" },
                      { name: "Team Collaboration", value: 25, color: "var(--chart-2)" },
                      { name: "Presentations", value: 20, color: "var(--chart-3)" },
                      { name: "Focused Work", value: 15, color: "var(--chart-4)" },
                      { name: "Other", value: 5, color: "var(--chart-5)" },
                    ]}
                    nameKey="name"
                    valueKey="value"
                    colorKey="color"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Utilization by Time of Day</CardTitle>
                    <CardDescription>Workspace usage patterns throughout the day</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { time: "8:00", conference: 20, meeting: 15, office: 30, collaboration: 10 },
                    { time: "9:00", conference: 40, meeting: 30, office: 50, collaboration: 25 },
                    { time: "10:00", conference: 75, meeting: 60, office: 70, collaboration: 45 },
                    { time: "11:00", conference: 90, meeting: 80, office: 75, collaboration: 60 },
                    { time: "12:00", conference: 60, meeting: 50, office: 40, collaboration: 30 },
                    { time: "13:00", conference: 70, meeting: 65, office: 60, collaboration: 40 },
                    { time: "14:00", conference: 85, meeting: 75, office: 70, collaboration: 65 },
                    { time: "15:00", conference: 80, meeting: 70, office: 65, collaboration: 60 },
                    { time: "16:00", conference: 70, meeting: 60, office: 55, collaboration: 50 },
                    { time: "17:00", conference: 50, meeting: 40, office: 35, collaboration: 30 },
                  ]}
                  series={[
                    { name: "Conference Rooms", key: "conference", color: "var(--chart-1)" },
                    { name: "Meeting Rooms", key: "meeting", color: "var(--chart-2)" },
                    { name: "Offices", key: "office", color: "var(--chart-3)" },
                    { name: "Collaboration Spaces", key: "collaboration", color: "var(--chart-4)" },
                  ]}
                  xAxisKey="time"
                  height={400}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Users</CardTitle>
                  <CardDescription>Most frequent workspace bookers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Jane Smith",
                        email: "jane@example.com",
                        bookings: 12,
                        avatar: "/diverse-woman-portrait.png",
                      },
                      {
                        name: "John Doe",
                        email: "john@example.com",
                        bookings: 10,
                        avatar: "/stylized-jd-initials.png",
                      },
                      {
                        name: "Sarah Johnson",
                        email: "sarah@example.com",
                        bookings: 8,
                        avatar: "/diverse-avatars.png",
                      },
                      {
                        name: "Michael Wilson",
                        email: "michael@example.com",
                        bookings: 7,
                        avatar: "/diverse-avatars.png",
                      },
                      { name: "David Lee", email: "david@example.com", bookings: 6, avatar: "/diverse-avatars.png" },
                    ].map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{user.bookings} bookings</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Duration</CardTitle>
                  <CardDescription>Average booking duration by workspace type</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Conference Room", value: 2.5 },
                      { name: "Meeting Room", value: 1.5 },
                      { name: "Office", value: 4.0 },
                      { name: "Collaboration Space", value: 3.0 },
                      { name: "Desk", value: 6.5 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                  <div className="text-center text-sm text-muted-foreground mt-2">Average duration in hours</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}
