"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangeSelector } from "@/components/date-range-selector"
import { ExportDataButton } from "@/components/export-data-button"
import { useRole } from "@/hooks/use-role"
import { OwnerMetricsWidget } from "@/components/role-specific-widgets/owner-metrics-widget"
import { ExpertMetricsWidget } from "@/components/role-specific-widgets/expert-metrics-widget"
import { ClientMetricsWidget } from "@/components/role-specific-widgets/client-metrics-widget"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileText, Users } from "lucide-react"
import { UpcomingBookings } from "@/components/workspace/upcoming-bookings"
import { useSessionStore } from "@/stores/sessionStore"
import { v4 as uuidv4 } from "uuid"
import type { Session } from "@/lib/mock-data"

export default function DashboardPage() {
  const { role, isLoading } = useRole()
  const [activeTab, setActiveTab] = useState("overview")

  // Show loading state while role is being determined
  if (isLoading || role === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your personalized dashboard.</p>
        </div>
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    console.log("Date range changed:", range)
    // In a real app, you would fetch data for this date range
  }

  const handleExport = async (format: string) => {
    console.log(`Exporting ${activeTab} data as ${format}`)
    // In a real app, you would generate and download the export file
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate export delay
  }

  const addSession = useSessionStore((state) => state.addSession)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your {role} dashboard.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DateRangeSelector onChange={handleDateRangeChange} />
          <ExportDataButton
            onExport={handleExport}
            exportFormats={[
              { id: "csv", label: "CSV", description: "Export as CSV file" },
              { id: "excel", label: "Excel", description: "Export as Excel spreadsheet" },
              { id: "pdf", label: "PDF", description: "Export as PDF document" },
              { id: "json", label: "JSON", description: "Export as JSON data" },
            ]}
          />
        </div>
      </div>

      {/* Role-specific metrics widget */}
      {role === "owner" && (
        <OwnerMetricsWidget
          stats={{
            totalSessions: 245,
            completedSessions: 210,
            totalExperts: 18,
            totalRevenue: 45231,
            upcomingSessions: 35,
            averageRating: 4.7,
            pendingInvoices: 12,
            completionRate: 92,
            clientSatisfaction: 96,
            expertUtilization: 78,
            revenueGrowth: 23,
            newClients: 15,
          }}
        />
      )}
      {role === "expert" && (
        <ExpertMetricsWidget
          stats={{
            totalSessions: 142,
            completedSessions: 128,
            totalRevenue: 24500,
            upcomingSessions: 14,
            averageRating: 4.8,
            pendingInvoices: 3,
            completionRate: 95,
            clientSatisfaction: 98,
            expertUtilization: 82,
            revenueGrowth: 18,
          }}
        />
      )}
      {role === "client" && (
        <ClientMetricsWidget
          stats={{
            totalSessions: 24,
            completedSessions: 18,
            upcomingSessions: 6,
            pendingInvoices: 2,
            completionRate: 90,
          }}
        />
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+22% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,853</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">93%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Session Activity</CardTitle>
                <CardDescription>Session activity over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Week 1", value: 400 },
                    { name: "Week 2", value: 300 },
                    { name: "Week 3", value: 500 },
                    { name: "Week 4", value: 350 },
                    { name: "Week 5", value: 450 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Distribution of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                                  data={[
                                      { name: "Experts", value: 35, color: "var(--expert-primary)" },
                                      { name: "Clients", value: 55, color: "var(--client-primary)" },
                                      { name: "Admins", value: 10, color: "var(--owner-primary)" },
                                  ]}
                                  nameKey="name"
                                  valueKey="value"
                                  colorKey="color"
                                  height={300} xAxisKey={""}                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <ExportDataButton
              onExport={handleExport}
              exportFormats={[
                { id: "csv", label: "CSV", description: "Export performance data as CSV" },
                { id: "excel", label: "Excel", description: "Export performance data as Excel" },
                { id: "pdf", label: "PDF Report", description: "Generate PDF performance report" },
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Session Completion Rate</CardTitle>
                <CardDescription>Percentage of sessions completed successfully</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center my-4">93%</div>
                <BarChart
                  data={[
                    { name: "Jan", value: 88 },
                    { name: "Feb", value: 90 },
                    { name: "Mar", value: 87 },
                    { name: "Apr", value: 91 },
                    { name: "May", value: 93 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Session Rating</CardTitle>
                <CardDescription>Average rating across all sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center my-4">4.7/5</div>
                <BarChart
                  data={[
                    { name: "Jan", value: 4.5 },
                    { name: "Feb", value: 4.6 },
                    { name: "Mar", value: 4.5 },
                    { name: "Apr", value: 4.8 },
                    { name: "May", value: 4.7 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average response time to client inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center my-4">2.3h</div>
                <BarChart
                  data={[
                    { name: "Jan", value: 3.2 },
                    { name: "Feb", value: 2.8 },
                    { name: "Mar", value: 2.5 },
                    { name: "Apr", value: 2.4 },
                    { name: "May", value: 2.3 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={200}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key performance indicators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={[
                  { name: "Jan", completion: 88, rating: 4.5, response: 3.2 },
                  { name: "Feb", completion: 90, rating: 4.6, response: 2.8 },
                  { name: "Mar", completion: 87, rating: 4.5, response: 2.5 },
                  { name: "Apr", completion: 91, rating: 4.8, response: 2.4 },
                  { name: "May", completion: 93, rating: 4.7, response: 2.3 },
                ]}
                series={[
                  { name: "Completion Rate", key: "completion", color: "var(--chart-1)" },
                  { name: "Average Rating", key: "rating", color: "var(--chart-2)" },
                  { name: "Response Time", key: "response", color: "var(--chart-3)" },
                ]}
                xAxisKey="name"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Session Analytics</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Session
              </Button>
              <ExportDataButton
                onExport={handleExport}
                exportFormats={[
                  { id: "csv", label: "CSV", description: "Export session data as CSV" },
                  { id: "ical", label: "iCal", description: "Export sessions as iCal file" },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sessions by Type</CardTitle>
                <CardDescription>Distribution of sessions by type</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "One-on-One", value: 45, color: "var(--chart-1)" },
                    { name: "Group", value: 30, color: "var(--chart-2)" },
                    { name: "Workshop", value: 15, color: "var(--chart-3)" },
                    { name: "Webinar", value: 10, color: "var(--chart-4)" },
                  ]}
                  nameKey="name"
                  valueKey="value"
                  colorKey="color"
                  height={300} xAxisKey={""}                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions by Status</CardTitle>
                <CardDescription>Current status of all sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Completed", value: 65, color: "var(--chart-2)" },
                    { name: "Scheduled", value: 20, color: "var(--chart-1)" },
                    { name: "Cancelled", value: 10, color: "var(--chart-3)" },
                    { name: "Pending", value: 5, color: "var(--chart-4)" },
                  ]}
                  nameKey="name"
                  valueKey="value"
                  colorKey="color"
                  height={300} xAxisKey={""}                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Session Timeline</CardTitle>
              <CardDescription>Number of sessions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "Jan", completed: 42, scheduled: 12, cancelled: 5 },
                  { name: "Feb", completed: 38, scheduled: 10, cancelled: 4 },
                  { name: "Mar", completed: 45, scheduled: 15, cancelled: 6 },
                  { name: "Apr", completed: 40, scheduled: 18, cancelled: 3 },
                  { name: "May", completed: 50, scheduled: 20, cancelled: 7 },
                ]}
                series={[
                  { name: "Completed", key: "completed", color: "var(--chart-2)" },
                  { name: "Scheduled", key: "scheduled", color: "var(--chart-1)" },
                  { name: "Cancelled", key: "cancelled", color: "var(--chart-3)" },
                ]}
                xAxisKey="name"
                height={400}
                stacked
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Financial Overview</h2>
            <ExportDataButton
              onExport={handleExport}
              exportFormats={[
                { id: "csv", label: "CSV", description: "Export financial data as CSV" },
                { id: "excel", label: "Excel", description: "Export financial data as Excel" },
                { id: "pdf", label: "PDF Report", description: "Generate PDF financial report" },
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Badge variant="outline">YTD</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$245,679</div>
                <p className="text-xs text-muted-foreground">+18% from last year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Session Value</CardTitle>
                <Badge variant="outline">YTD</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$175</div>
                <p className="text-xs text-muted-foreground">+5% from last year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
                <Badge variant="outline">Current</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">8 invoices pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <Badge variant="outline">YTD</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-muted-foreground">+2% from last year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by session type and month</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "Jan", oneOnOne: 12500, group: 8500, workshop: 4500 },
                  { name: "Feb", oneOnOne: 14000, group: 7800, workshop: 5200 },
                  { name: "Mar", oneOnOne: 15500, group: 9200, workshop: 6100 },
                  { name: "Apr", oneOnOne: 13800, group: 8900, workshop: 5800 },
                  { name: "May", oneOnOne: 16200, group: 9500, workshop: 6500 },
                ]}
                series={[
                  { name: "One-on-One", key: "oneOnOne", color: "var(--chart-1)" },
                  { name: "Group", key: "group", color: "var(--chart-2)" },
                  { name: "Workshop", key: "workshop", color: "var(--chart-3)" },
                ]}
                xAxisKey="name"
                height={400}
                stacked
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue trend over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Jun", value: 18500 },
                    { name: "Jul", value: 20100 },
                    { name: "Aug", value: 19800 },
                    { name: "Sep", value: 21500 },
                    { name: "Oct", value: 22800 },
                    { name: "Nov", value: 23500 },
                    { name: "Dec", value: 25000 },
                    { name: "Jan", value: 21000 },
                    { name: "Feb", value: 22000 },
                    { name: "Mar", value: 24500 },
                    { name: "Apr", value: 23500 },
                    { name: "May", value: 26000 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Client Type</CardTitle>
                <CardDescription>Distribution of revenue by client type</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Corporate", value: 45, color: "var(--chart-1)" },
                    { name: "Individual", value: 30, color: "var(--chart-2)" },
                    { name: "Non-profit", value: 15, color: "var(--chart-3)" },
                    { name: "Educational", value: 10, color: "var(--chart-4)" },
                  ]}
                  nameKey="name"
                  valueKey="value"
                  colorKey="color"
                  height={300} xAxisKey={""}                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Workspace Bookings</CardTitle>
          <CardDescription>Your upcoming workspace reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingBookings limit={2} showTitle={false} />
        </CardContent>
      </Card>
    </div>
  )
}
