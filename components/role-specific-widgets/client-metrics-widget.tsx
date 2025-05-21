import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Users, CreditCard, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ClientMetricsWidgetProps {
  stats: {
    totalSessions: number
    completedSessions: number
    upcomingSessions: number
    completionRate: number
    pendingInvoices: number
  }
  isLoading?: boolean
}

export function ClientMetricsWidget({ stats, isLoading = false }: ClientMetricsWidgetProps) {
  return (
    <div className="space-y-6 animate-scale-in">
      <h2 className="text-lg font-semibold role-accent-text">Your Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                <p className="text-xs text-gray-500">
                  {stats.upcomingSessions > 0 ? "Next session in 2 days" : "No upcoming sessions"}
                </p>
                {stats.upcomingSessions === 0 && (
                  <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                    <Link href="/dashboard/experts">Book a Session</Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-gray-500">{stats.completedSessions} completed</p>
                <div className="mt-2">
                  <Progress value={(stats.completedSessions / (stats.totalSessions || 1)) * 100} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
                <p className="text-xs text-gray-500">
                  {stats.pendingInvoices > 0 ? "$420 outstanding" : "No pending payments"}
                </p>
                {stats.pendingInvoices > 0 && (
                  <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                    <Link href="/dashboard/invoices">View Invoices</Link>
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcomingSessions > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-purple-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">JavaScript Fundamentals</p>
                    <p className="text-xs text-gray-500">Today, 2:00 PM - John Doe</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-purple-100 text-purple-800">
                      Upcoming
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-purple-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">UX Design Workshop</p>
                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM - Emily Davis</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-purple-100 text-purple-800">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="mb-2 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">No upcoming sessions</p>
                <p className="text-xs text-gray-500 mt-1">Book a session with one of our experts to get started</p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/dashboard/experts">Find an Expert</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Experts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-purple-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">JavaScript • 2 sessions</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-purple-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Emily Davis</p>
                  <p className="text-xs text-gray-500">UX Design • 1 session</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Link
                href="/dashboard/experts"
                className="text-sm font-medium text-purple-600 flex items-center justify-end"
              >
                Find more experts
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
