'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Plus, Edit, Trash2, Eye, MessageCircle, TrendingUp, DollarSign, Users, Star } from 'lucide-react'
import Link from 'next/link'

// Mock data for provider's services
const mockServices = [
  {
    id: 1,
    title: "Custom AI Agent Development",
    category: "AI Agents",
    price: "From $5,000",
    status: "active",
    views: 234,
    inquiries: 12,
    bookings: 3,
    rating: 4.9,
    description: "Tailored AI agents for your specific business needs"
  },
  {
    id: 2,
    title: "Process Automation Suite",
    category: "AI Solutions",
    price: "From $8,000",
    status: "active",
    views: 189,
    inquiries: 8,
    bookings: 2,
    rating: 5.0,
    description: "Complete automation of repetitive business processes"
  },
  {
    id: 3,
    title: "AI Strategy Consulting",
    category: "AI Education",
    price: "From $2,500",
    status: "draft",
    views: 0,
    inquiries: 0,
    bookings: 0,
    rating: 0,
    description: "Strategic planning for AI implementation"
  }
]

export default function ProviderDashboardPage() {
  const [services, setServices] = useState(mockServices)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newService, setNewService] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    features: ['']
  })

  const handleCreateService = () => {
    const service = {
      id: Date.now(),
      ...newService,
      status: 'draft',
      views: 0,
      inquiries: 0,
      bookings: 0,
      rating: 0
    }
    setServices([...services, service])
    setNewService({ title: '', category: '', price: '', description: '', features: [''] })
    setShowCreateForm(false)
  }

  const addFeature = () => {
    setNewService({ ...newService, features: [...newService.features, ''] })
  }

  const updateFeature = (index: number, value: string) => {
    const features = [...newService.features]
    features[index] = value
    setNewService({ ...newService, features })
  }

  const removeFeature = (index: number) => {
    const features = newService.features.filter((_, i) => i !== index)
    setNewService({ ...newService, features })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Alliance AI</span>
              <Badge variant="secondary" className="ml-2">Provider</Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/provider-dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link href="/messages" className="text-gray-600 hover:text-gray-900">Messages</Link>
              <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your AI services and track your performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">423</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">20</p>
                  <p className="text-xs text-blue-600">+5 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-xs text-purple-600">$25,000 value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-xs text-yellow-600">127 reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">My Services</TabsTrigger>
            <TabsTrigger value="create">Create Service</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Services</CardTitle>
                    <CardDescription>Manage your AI service listings</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold">{service.title}</h3>
                              <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                                {service.status}
                              </Badge>
                              <Badge variant="outline">{service.category}</Badge>
                            </div>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Views</p>
                                <p className="font-semibold">{service.views}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Inquiries</p>
                                <p className="font-semibold">{service.inquiries}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Bookings</p>
                                <p className="font-semibold">{service.bookings}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Rating</p>
                                <p className="font-semibold">{service.rating || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-lg font-bold text-blue-600">{service.price}</span>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Service</CardTitle>
                <CardDescription>Add a new AI service to your marketplace profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      value={newService.title}
                      onChange={(e) => setNewService({...newService, title: e.target.value})}
                      placeholder="e.g. Custom AI Chatbot Development"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setNewService({...newService, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AI Agents">AI Agents</SelectItem>
                        <SelectItem value="AI Education">AI Education</SelectItem>
                        <SelectItem value="AI Solutions">AI Solutions</SelectItem>
                        <SelectItem value="AI Strategy">AI Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Pricing</Label>
                  <Input
                    id="price"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                    placeholder="e.g. From $2,500 or $500/hour"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    placeholder="Describe your service and what clients can expect..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Service Features</Label>
                  {newService.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="e.g. Custom AI model development"
                      />
                      {newService.features.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleCreateService} className="flex-1">
                    Create Service
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Profile Views</span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Service Inquiries</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-semibold">11.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Response Time</span>
                      <span className="font-semibold">2.3 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">New inquiry for Custom AI Agent</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Service viewed 12 times today</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">New 5-star review received</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Project milestone completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

