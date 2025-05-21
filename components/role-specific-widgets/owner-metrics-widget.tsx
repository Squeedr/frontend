import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Calendar, Clock, CheckCircle } from "lucide-react"

interface OwnerMetricsWidgetProps {
  stats: {
    totalSessions: number
    completedSessions: number
    totalExperts: number
    totalRevenue: number
    upcomingSessions: number
    averageRating: number
    pendingInvoices: number
    completionRate: number
    clientSatisfaction: number
    expertUtilization: number
    revenueGrowth: number
    newClients: number
  }
  isLoading?: boolean
}

export function OwnerMetricsWidget({ stats, isLoading = false }: OwnerMetricsWidgetProps) {
  return (
    <div className="space-y-6 animate-scale-in">
      <h2 className="text-lg font-semibold role-accent-text">Organization Performance</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expert Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.expertUtilization}%</div>
                <div className="mt-2">
                  <Progress value={stats.expertUtilization} className="h-2" />
                </div>
                <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                  <span>Target: 85%</span>
                  {stats.expertUtilization >= 85 ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> On Target
                    </span>
                  ) : (
                    <span className="text-amber-500">Below Target</span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.revenueGrowth}%</div>
                <div className="mt-2">
                  <Progress value={stats.revenueGrowth} className="h-2" />
                </div>
                <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                  <span>Target: 20%</span>
                  {stats.revenueGrowth >= 20 ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> On Target
                    </span>
                  ) : (
                    <span className="text-amber-500">Below Target</span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.clientSatisfaction}%</div>
                <div className="mt-2">
                  <Progress value={stats.clientSatisfaction} className="h-2" />
                </div>
                <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                  <span>Target: 95%</span>
                  {stats.clientSatisfaction >= 95 ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> On Target
                    </span>
                  ) : (
                    <span className="text-amber-500">Below Target</span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Completion</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <div className="mt-2">
                  <Progress value={stats.completionRate} className="h-2" />
                </div>
                <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                  <span>Target: 90%</span>
                  {stats.completionRate >= 90 ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> On Target
                    </span>
                  ) : (
                    <span className="text-amber-500">Below Target</span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Web Development</span>
                  <span className="text-sm font-medium">$2,450</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">UX/UI Design</span>
                  <span className="text-sm font-medium">$1,890</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Data Science</span>
                  <span className="text-sm font-medium">$1,060</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Introduction to React</p>
                  <p className="text-xs text-gray-500">Today, 10:00 AM - Jane Smith</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Data Science Fundamentals</p>
                  <p className="text-xs text-gray-500">Tomorrow, 11:00 AM - Michael Wilson</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Advanced JavaScript</p>
                  <p className="text-xs text-gray-500">May 15, 2:00 PM - John Doe</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
