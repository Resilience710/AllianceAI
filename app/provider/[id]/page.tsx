'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bot, Star, MessageCircle, Calendar, Clock, CheckCircle, Users, Award, Globe, MapPin, Mail, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock provider data
const mockProvider = {
  id: 1,
  name: "AI Solutions Pro",
  tagline: "Enterprise AI Automation Specialists",
  category: "AI Agents",
  rating: 4.9,
  reviewCount: 127,
  totalProjects: 340,
  responseTime: "< 2 hours",
  location: "San Francisco, CA",
  memberSince: "2022",
  verified: true,
  description: "We specialize in creating enterprise-grade AI automation solutions that transform business processes. Our team of expert AI engineers and data scientists work with Fortune 500 companies to implement cutting-edge artificial intelligence systems.",
  skills: ["Machine Learning", "Process Automation", "Custom AI Development", "Natural Language Processing", "Computer Vision", "Deep Learning", "AI Strategy", "Data Analytics"],
  services: [
    {
      id: 1,
      title: "Custom AI Agent Development",
      description: "Tailored AI agents for your specific business needs",
      price: "From $5,000",
      duration: "2-4 weeks",
      features: ["Custom AI model", "Integration support", "Training & documentation", "3 months support"]
    },
    {
      id: 2,
      title: "Process Automation Suite",
      description: "Complete automation of repetitive business processes",
      price: "From $8,000",
      duration: "3-6 weeks",
      features: ["Process analysis", "Custom automation", "Dashboard & analytics", "6 months support"]
    },
    {
      id: 3,
      title: "AI Strategy Consulting",
      description: "Strategic planning for AI implementation in your organization",
      price: "From $2,500",
      duration: "1-2 weeks",
      features: ["AI readiness assessment", "Implementation roadmap", "ROI analysis", "Executive presentation"]
    }
  ],
  portfolio: [
    {
      title: "E-commerce Recommendation Engine",
      description: "Increased sales by 35% through personalized product recommendations",
      industry: "Retail",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Customer Service Chatbot",
      description: "Reduced support tickets by 60% with intelligent automation",
      industry: "SaaS",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Predictive Maintenance System",
      description: "Prevented $2M in equipment failures through AI predictions",
      industry: "Manufacturing",
      image: "/api/placeholder/300/200"
    }
  ],
  reviews: [
    {
      id: 1,
      author: "Sarah Johnson",
      company: "TechCorp Inc.",
      rating: 5,
      date: "2 weeks ago",
      content: "Exceptional work on our AI automation project. The team delivered beyond expectations and provided excellent ongoing support."
    },
    {
      id: 2,
      author: "Michael Chen",
      company: "DataFlow Systems",
      rating: 5,
      date: "1 month ago",
      content: "Professional, knowledgeable, and delivered on time. The AI solution has transformed our operations."
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      company: "InnovateLabs",
      rating: 4,
      date: "2 months ago",
      content: "Great communication throughout the project. The final product exceeded our requirements."
    }
  ],
  contact: {
    email: "contact@aisolutionspro.com",
    phone: "+1 (555) 123-4567",
    website: "www.aisolutionspro.com"
  }
}

export default function ProviderProfilePage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">AI Marketplace</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Provider
              </Button>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/api/placeholder/96/96" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{mockProvider.name}</h1>
                  {mockProvider.verified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-gray-600 mb-4">{mockProvider.tagline}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{mockProvider.rating}</span>
                    <span className="ml-1">({mockProvider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{mockProvider.totalProjects} projects completed</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Responds {mockProvider.responseTime}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{mockProvider.location}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockProvider.skills.slice(0, 6).map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                  {mockProvider.skills.length > 6 && (
                    <Badge variant="secondary">+{mockProvider.skills.length - 6} more</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{mockProvider.description}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member since</span>
                      <span className="font-medium">{mockProvider.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response time</span>
                      <span className="font-medium">{mockProvider.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects completed</span>
                      <span className="font-medium">{mockProvider.totalProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client satisfaction</span>
                      <span className="font-medium">98%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{mockProvider.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{mockProvider.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{mockProvider.contact.website}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProvider.services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                        <Badge variant="outline">{service.duration}</Badge>
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full">
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProvider.portfolio.map((project, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">Project Image</span>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <Badge variant="outline">{project.industry}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-6">
              {mockProvider.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.author}</h4>
                            <p className="text-sm text-gray-500">{review.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


