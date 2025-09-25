'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Bot, Star, MessageCircle, Calendar, Clock, CheckCircle, Users, Award, Globe, MapPin, Mail, Phone, ArrowLeft, Video } from 'lucide-react'
import RequireAuth from '@/components/auth/RequireAuth'
import { useAuth } from '@/components/auth/AuthProvider'
import { ReviewSystem } from '@/components/reviews/ReviewSystem'
import { db } from '@/lib/firebase'
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

interface UploadedFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Date
}

interface ProviderProfile {
  uid: string
  displayName: string
  email: string
  role: string
  company?: string
  jobTitle?: string
  industry?: string
  bio?: string
  skills?: string[]
  experience?: string
  pricing?: {
    hourlyRate?: number
    projectMin?: number
    projectMax?: number
  }
  portfolio?: UploadedFile[]
  certifications?: UploadedFile[]
  location?: string
  website?: string
  phone?: string
}

export default function ProviderProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [provider, setProvider] = useState<ProviderProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProvider = async () => {
      if (!params.id) return

      try {
        const providerDoc = await getDoc(doc(db, 'users', params.id as string))
        if (providerDoc.exists()) {
          const data = providerDoc.data()
          setProvider({
            uid: providerDoc.id,
            displayName: data.displayName || data.email,
            email: data.email,
            role: data.role,
            company: data.company,
            jobTitle: data.jobTitle,
            industry: data.industry,
            bio: data.bio,
            skills: data.skills || [],
            experience: data.experience,
            pricing: data.pricing,
            portfolio: data.portfolio || [],
            certifications: data.certifications || [],
            location: data.location,
            website: data.website,
            phone: data.phone
          })
        }
      } catch (error) {
        console.error('Error fetching provider:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProvider()
  }, [params.id])

  const handleMessageProvider = () => {
    router.push(`/messages?provider=${params.id}`)
  }

  const handleVideoCall = () => {
    const roomId = `${user?.uid}-${params.id}-${Date.now()}`
    router.push(`/video-call/${roomId}`)
  }

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading provider profile...</p>
          </div>
        </div>
      </RequireAuth>
    )
  }

  if (!provider) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
            <p className="text-gray-600 mb-6">The provider you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/browse')}>
              Browse Providers
            </Button>
          </div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.push('/browse')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Browse
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Alliance AI</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={handleMessageProvider}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Provider
                </Button>
                <Button variant="outline" onClick={handleVideoCall}>
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button onClick={handleMessageProvider}>
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
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {provider.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{provider.displayName}</h1>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Provider
                    </Badge>
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{provider.jobTitle || 'AI Specialist'}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">4.8</span>
                      <span className="ml-1">(New Provider)</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{provider.experience || 'Experienced'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Responds quickly</span>
                    </div>
                    {provider.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{provider.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills?.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {(provider.skills?.length || 0) > 6 && (
                      <Badge variant="secondary">+{(provider.skills?.length || 0) - 6} more</Badge>
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
                    <p className="text-gray-600 leading-relaxed">
                      {provider.bio || 'This provider has not added a bio yet.'}
                    </p>
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
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{provider.experience || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium">{provider.industry || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate</span>
                      <span className="font-medium">
                        ${provider.pricing?.hourlyRate || 'Contact for pricing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Range</span>
                      <span className="font-medium">
                        ${provider.pricing?.projectMin || 0} - ${provider.pricing?.projectMax || 'Contact'}
                      </span>
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
                      <span className="text-sm">{provider.email}</span>
                    </div>
                    {provider.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{provider.phone}</span>
                      </div>
                    )}
                    {provider.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{provider.website}</span>
                      </div>
                    )}
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
            <div className="grid md:grid-cols-2 gap-6">
              {provider.portfolio && provider.portfolio.length > 0 ? (
                provider.portfolio.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(item.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No portfolio items uploaded yet.</p>
                </div>
              )}
            </div>
            
            {provider.certifications && provider.certifications.length > 0 && (
              <div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {provider.certifications.map((cert) => (
                      <Card key={cert.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(cert.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(cert.url, '_blank')}
                          >
                            <Award className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewSystem
              providerId={params.id as string}
              reviews={mockProvider.reviews.map(review => ({
                id: review.id.toString(),
                clientId: 'client-' + review.id,
                clientName: review.author,
                providerId: params.id as string,
                projectTitle: 'AI Project',
                rating: review.rating,
                comment: review.content,
                createdAt: new Date(),
                helpful: Math.floor(Math.random() * 10),
                notHelpful: Math.floor(Math.random() * 3),
                isVerified: true
              }))}
              canWriteReview={user?.uid !== params.id}
              onSubmitReview={(review) => console.log('New review:', review)}
              onHelpfulClick={(reviewId) => console.log('Helpful:', reviewId)}
              onNotHelpfulClick={(reviewId) => console.log('Not helpful:', reviewId)}
              onReportReview={(reviewId) => console.log('Report:', reviewId)}
            />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </RequireAuth>
  )
}


