import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react"

interface ExpertMetricsWidgetProps {
  stats: {
    totalSessions: number
    completedSessions: number
    totalRevenue: number
    upcomingSessions: number
    averageRating: number
    pendingInvoices: number
    completionRate: number
    clientSatisfaction: number
    expertUtilization: number
    revenueGrowth: number
  }
  isLoading?: boolean
}

export function ExpertMetricsWidget({
  stats = {
    totalSessions: 0,
    completedSessions: 0,
    totalRevenue: 0,
    upcomingSessions: 0,
    averageRating: 0,
    pendingInvoices: 0,
    completionRate: 0,
    clientSatisfaction: 0,
    expertUtilization: 0,
    revenueGrowth: 0,
  },
  isLoading = false,
}: ExpertMetricsWidgetProps) {
  return (
    <div className="space-y-6 animate-scale-in">
      <h2 className="text-lg font-semibold role-accent-text">Your Performance</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.clientSatisfaction}%</div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(stats.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">{stats.averageRating.toFixed(1)}/5.0</span>
                </div>
                <div className="mt-2">
                  <Progress value={stats.clientSatisfaction} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
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
                  <span>Of available hours</span>
                  {stats.expertUtilization >= 80 ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Excellent
                    </span>
                  ) : (
                    <span className="text-amber-500">Room to improve</span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="role-card-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
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
                  <span>Target: 95%</span>
                  {stats.completionRate >= 95 ? (
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
            <DollarSign className="h-4 w-4 text-green-500" />
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
                  <span>Month over month</span>
                  <span className="text-green-500">↑ {stats.revenueGrowth}%</span>
                </div>
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
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Advanced JavaScript Patterns</p>
                  <p className="text-xs text-gray-500">Today, 2:00 PM - Alice Williams</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">React Hooks Deep Dive</p>
                  <p className="text-xs text-gray-500">Tomorrow, 10:00 AM - Bob Johnson</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">TypeScript Workshop</p>
                  <p className="text-xs text-gray-500">May 15, 3:00 PM - David Wilson</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">JavaScript</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">React</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Node.js</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">TypeScript</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
