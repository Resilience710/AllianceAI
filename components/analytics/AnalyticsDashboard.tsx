'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageCircle, 
  DollarSign, 
  Eye,
  Calendar,
  Star,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  totalViews: number
  totalMessages: number
  totalBookings: number
  totalRevenue: number
  averageRating: number
  responseTime: number
  conversionRate: number
  activeProjects: number
}

interface ChartData {
  name: string
  value: number
  change?: number
}

export function AnalyticsDashboard({ userRole }: { userRole: 'provider' | 'client' | 'admin' }) {
  const [timeRange, setTimeRange] = React.useState('7d')
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData>({
    totalViews: 1247,
    totalMessages: 89,
    totalBookings: 23,
    totalRevenue: 45600,
    averageRating: 4.8,
    responseTime: 2.4,
    conversionRate: 18.5,
    activeProjects: 7
  })

  const [chartData, setChartData] = React.useState<ChartData[]>([
    { name: 'Mon', value: 120, change: 5 },
    { name: 'Tue', value: 98, change: -2 },
    { name: 'Wed', value: 156, change: 12 },
    { name: 'Thu', value: 134, change: 8 },
    { name: 'Fri', value: 189, change: 15 },
    { name: 'Sat', value: 167, change: 10 },
    { name: 'Sun', value: 145, change: 7 }
  ])

  const getMetricCards = () => {
    if (userRole === 'provider') {
      return [
        {
          title: 'Profile Views',
          value: analyticsData.totalViews.toLocaleString(),
          change: '+12.5%',
          icon: Eye,
          trend: 'up' as const
        },
        {
          title: 'Messages Received',
          value: analyticsData.totalMessages.toString(),
          change: '+8.2%',
          icon: MessageCircle,
          trend: 'up' as const
        },
        {
          title: 'Total Bookings',
          value: analyticsData.totalBookings.toString(),
          change: '+23.1%',
          icon: Calendar,
          trend: 'up' as const
        },
        {
          title: 'Revenue',
          value: `$${analyticsData.totalRevenue.toLocaleString()}`,
          change: '+15.8%',
          icon: DollarSign,
          trend: 'up' as const
        },
        {
          title: 'Average Rating',
          value: analyticsData.averageRating.toFixed(1),
          change: '+0.2',
          icon: Star,
          trend: 'up' as const
        },
        {
          title: 'Response Time',
          value: `${analyticsData.responseTime}h`,
          change: '-0.5h',
          icon: Clock,
          trend: 'down' as const
        },
        {
          title: 'Conversion Rate',
          value: `${analyticsData.conversionRate}%`,
          change: '+2.3%',
          icon: Target,
          trend: 'up' as const
        },
        {
          title: 'Active Projects',
          value: analyticsData.activeProjects.toString(),
          change: '+3',
          icon: Activity,
          trend: 'up' as const
        }
      ]
    } else if (userRole === 'client') {
      return [
        {
          title: 'Active Projects',
          value: '5',
          change: '+2',
          icon: Activity,
          trend: 'up' as const
        },
        {
          title: 'Messages Sent',
          value: '34',
          change: '+12',
          icon: MessageCircle,
          trend: 'up' as const
        },
        {
          title: 'Total Spent',
          value: '$12,450',
          change: '+$2,300',
          icon: DollarSign,
          trend: 'up' as const
        },
        {
          title: 'Providers Contacted',
          value: '18',
          change: '+5',
          icon: Users,
          trend: 'up' as const
        }
      ]
    } else {
      return [
        {
          title: 'Total Users',
          value: '2,847',
          change: '+156',
          icon: Users,
          trend: 'up' as const
        },
        {
          title: 'Active Providers',
          value: '342',
          change: '+23',
          icon: Activity,
          trend: 'up' as const
        },
        {
          title: 'Platform Revenue',
          value: '$89,340',
          change: '+$12,450',
          icon: DollarSign,
          trend: 'up' as const
        },
        {
          title: 'Total Bookings',
          value: '1,234',
          change: '+89',
          icon: Calendar,
          trend: 'up' as const
        }
      ]
    }
  }

  const metricCards = getMetricCards()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">
            {userRole === 'provider' && 'Track your performance and grow your business'}
            {userRole === 'client' && 'Monitor your project activities and spending'}
            {userRole === 'admin' && 'Platform overview and key metrics'}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={cn(
                  "font-medium",
                  metric.trend === 'up' ? "text-green-600" : "text-red-600"
                )}>
                  {metric.change}
                </span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Views/Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {userRole === 'provider' ? 'Profile Views' : userRole === 'client' ? 'Activity' : 'Platform Activity'}
            </CardTitle>
            <CardDescription>Daily activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{day.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(day.value / 200) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{day.value}</span>
                    {day.change && (
                      <Badge variant={day.change > 0 ? "default" : "destructive"} className="text-xs">
                        {day.change > 0 ? '+' : ''}{day.change}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Performance Insights
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userRole === 'provider' && (
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">High Conversion Rate</p>
                    <p className="text-xs text-green-600">18.5% above average</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Fast Response Time</p>
                    <p className="text-xs text-blue-600">2.4h average response</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Profile Optimization</p>
                    <p className="text-xs text-yellow-600">Add more portfolio items</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Improve</Badge>
                </div>
              </>
            )}
            
            {userRole === 'client' && (
              <>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Active Projects</p>
                    <p className="text-xs text-blue-600">5 ongoing collaborations</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Budget Utilization</p>
                    <p className="text-xs text-green-600">68% of monthly budget used</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">On Track</Badge>
                </div>
              </>
            )}

            {userRole === 'admin' && (
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-green-800">Platform Growth</p>
                    <p className="text-xs text-green-600">23% increase in new users</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Growing</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Revenue Trend</p>
                    <p className="text-xs text-blue-600">$89K total platform revenue</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Strong</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Suggestions to improve your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userRole === 'provider' && (
              <>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Update your portfolio</p>
                    <p className="text-sm text-gray-600">Add 2-3 recent projects to increase bookings by 25%</p>
                  </div>
                  <Button size="sm">Update</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Respond to messages faster</p>
                    <p className="text-sm text-gray-600">Aim for under 2 hours to improve client satisfaction</p>
                  </div>
                  <Button size="sm" variant="outline">Learn More</Button>
                </div>
              </>
            )}
            
            {userRole === 'client' && (
              <>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Leave reviews for completed projects</p>
                    <p className="text-sm text-gray-600">Help other clients and improve provider relationships</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
