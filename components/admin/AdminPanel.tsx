'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Activity, 
  DollarSign, 
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  MessageSquare,
  Star,
  Shield,
  Settings
} from 'lucide-react'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'provider'
  status: 'active' | 'suspended' | 'pending'
  joinDate: Date
  lastActive: Date
  totalSpent?: number
  totalEarned?: number
}

interface Report {
  id: string
  type: 'user' | 'review' | 'service' | 'message'
  reportedBy: string
  targetId: string
  targetName: string
  reason: string
  description: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: Date
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = React.useState('overview')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [userFilter, setUserFilter] = React.useState<'all' | 'clients' | 'providers' | 'suspended'>('all')

  const [users] = React.useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'client',
      status: 'active',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date('2024-01-20'),
      totalSpent: 15000
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@aiexpert.com',
      role: 'provider',
      status: 'active',
      joinDate: new Date('2024-01-10'),
      lastActive: new Date('2024-01-21'),
      totalEarned: 45000
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@startup.com',
      role: 'client',
      status: 'suspended',
      joinDate: new Date('2024-01-05'),
      lastActive: new Date('2024-01-18'),
      totalSpent: 2500
    }
  ])

  const [reports] = React.useState<Report[]>([
    {
      id: '1',
      type: 'user',
      reportedBy: 'client@example.com',
      targetId: '2',
      targetName: 'Sarah Johnson',
      reason: 'Inappropriate behavior',
      description: 'Provider was unprofessional during video call',
      status: 'pending',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '2',
      type: 'review',
      reportedBy: 'provider@example.com',
      targetId: 'review-123',
      targetName: 'Fake Review',
      reason: 'Fake review',
      description: 'This review appears to be fake and malicious',
      status: 'pending',
      createdAt: new Date('2024-01-19')
    }
  ])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = userFilter === 'all' || 
                         (userFilter === 'suspended' && user.status === 'suspended') ||
                         (userFilter !== 'suspended' && (
                           (userFilter === 'providers' && user.role === 'provider') ||
                           (userFilter === 'clients' && user.role === 'client')
                         ))
    return matchesSearch && matchesFilter
  })

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'view') => {
    console.log(`${action} user ${userId}`)
    // Implementation would go here
  }

  const handleReportAction = (reportId: string, action: 'resolve' | 'dismiss') => {
    console.log(`${action} report ${reportId}`)
    // Implementation would go here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, monitor activity, and handle reports</p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Platform Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+156 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">+23 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$89,340</div>
                <p className="text-xs text-muted-foreground">+$12,450 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New provider registration</p>
                    <p className="text-xs text-gray-600">Sarah Johnson joined as AI consultant</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">High-value booking completed</p>
                    <p className="text-xs text-gray-600">$15,000 project between TechCorp and AI Solutions Inc.</p>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Report submitted</p>
                    <p className="text-xs text-gray-600">User reported inappropriate behavior</p>
                  </div>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and their permissions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value as typeof userFilter)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Users</option>
                    <option value="clients">Clients</option>
                    <option value="providers">Providers</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <Badge variant={
                            user.status === 'active' ? 'default' : 
                            user.status === 'suspended' ? 'destructive' : 'secondary'
                          }>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Joined {user.joinDate.toLocaleDateString()} • 
                          Last active {user.lastActive.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        {user.role === 'client' && user.totalSpent && (
                          <p className="font-semibold text-green-600">${user.totalSpent.toLocaleString()} spent</p>
                        )}
                        {user.role === 'provider' && user.totalEarned && (
                          <p className="font-semibold text-blue-600">${user.totalEarned.toLocaleString()} earned</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user.id, 'view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={user.status === 'suspended' ? 'default' : 'destructive'}
                        size="sm"
                        onClick={() => handleUserAction(user.id, user.status === 'suspended' ? 'activate' : 'suspend')}
                      >
                        {user.status === 'suspended' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Management */}
          <Card>
            <CardHeader>
              <CardTitle>Reports & Moderation</CardTitle>
              <CardDescription>Review and handle user reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          report.status === 'pending' ? 'destructive' :
                          report.status === 'resolved' ? 'default' : 'secondary'
                        }>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.type}</Badge>
                        <span className="text-sm text-gray-600">
                          {report.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReportAction(report.id, 'resolve')}
                          >
                            Resolve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReportAction(report.id, 'dismiss')}
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Target: {report.targetName}</p>
                      <p className="text-sm"><strong>Reason:</strong> {report.reason}</p>
                      <p className="text-sm text-gray-600">{report.description}</p>
                      <p className="text-xs text-gray-500">Reported by: {report.reportedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard userRole="admin" />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Platform Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform-wide settings and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Commission Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Platform Commission (%)</label>
                      <Input type="number" defaultValue="15" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Minimum Withdrawal</label>
                      <Input type="number" defaultValue="100" className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Moderation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-approve services</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Require ID verification</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
