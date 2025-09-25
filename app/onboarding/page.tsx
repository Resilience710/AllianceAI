'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Bot, Users, Building, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type UserRole = 'provider' | 'client' | null
type Step = 'role' | 'profile' | 'preferences' | 'complete'

interface ProfileData {
  name: string
  email: string
  company: string
  role: string
  industry: string
  skills: string[]
  needs: string[]
  bio: string
  budget?: string
  projectTimeline?: string
  teamSize?: string
  experience?: string
  pricing?: {
    hourlyRate?: number
    projectMin?: number
    projectMax?: number
  }
  portfolio?: string[]
  certifications?: string[]
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('role')
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    company: '',
    role: '',
    industry: '',
    skills: [],
    needs: [],
    bio: '',
    budget: '',
    projectTimeline: '',
    teamSize: '',
    experience: '',
    pricing: {
      hourlyRate: 0,
      projectMin: 0,
      projectMax: 0
    },
    portfolio: [],
    certifications: []
  })
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
    setCurrentStep('profile')
  }

  const handleProfileSubmit = () => {
    setCurrentStep('preferences')
  }

  const handleComplete = async () => {
    if (!user) {
      console.error('No user found')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Save user profile to Firestore
      const userProfile = {
        email: user.email || profileData.email,
        displayName: profileData.name,
        role: userRole,
        company: profileData.company,
        jobTitle: profileData.role,
        industry: profileData.industry,
        bio: profileData.bio,
        skills: userRole === 'provider' ? profileData.skills : [],
        needs: userRole === 'client' ? profileData.needs : [],
        ...(userRole === 'client' && {
          budget: profileData.budget,
          projectTimeline: profileData.projectTimeline,
          teamSize: profileData.teamSize
        }),
        ...(userRole === 'provider' && {
          experience: profileData.experience,
          pricing: profileData.pricing,
          portfolio: profileData.portfolio,
          certifications: profileData.certifications
        }),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileComplete: true
      }

      await setDoc(doc(db, 'users', user.uid), userProfile)
      
      setCurrentStep('complete')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error saving profile:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false)
    }
  }

  const providerSkills = [
    'Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Deep Learning',
    'AI Strategy', 'Data Science', 'Automation', 'Chatbot Development', 'AI Training',
    'Consulting', 'Custom AI Solutions', 'AI Integration'
  ]

  const clientNeeds = [
    'Customer Service Automation', 'Data Analysis', 'Process Automation', 'AI Training',
    'Predictive Analytics', 'Chatbots', 'Document Processing', 'AI Strategy',
    'Custom AI Development', 'AI Integration', 'Team Training', 'Consulting'
  ]

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education',
    'Real Estate', 'Marketing', 'Legal', 'Consulting', 'E-commerce', 'Other'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStep === 'role' && 'Step 1 of 3'}
              {currentStep === 'profile' && 'Step 2 of 3'}
              {currentStep === 'preferences' && 'Step 3 of 3'}
              {currentStep === 'complete' && 'Complete!'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: currentStep === 'role' ? '33%' : 
                       currentStep === 'profile' ? '66%' : 
                       currentStep === 'preferences' ? '100%' : '100%'
              }}
            />
          </div>
        </div>

        {/* Role Selection Step */}
        {currentStep === 'role' && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Alliance AI</CardTitle>
              <CardDescription>
                Let's get started by understanding how you'd like to use our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary hover:scale-105"
                  onClick={() => handleRoleSelect('provider')}
                >
                  <CardHeader className="text-center">
                    <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">AI Provider</CardTitle>
                    <CardDescription>
                      I create AI solutions, offer training, or provide consulting services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• List your AI agents and services</li>
                      <li>• Connect with businesses</li>
                      <li>• Earn from your expertise</li>
                      <li>• Build your reputation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary hover:scale-105"
                  onClick={() => handleRoleSelect('client')}
                >
                  <CardHeader className="text-center">
                    <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">Business Client</CardTitle>
                    <CardDescription>
                      I'm looking for AI solutions, training, or consulting for my business
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Browse AI solutions</li>
                      <li>• Find expert providers</li>
                      <li>• Get custom quotes</li>
                      <li>• Transform your business</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Setup Step */}
        {currentStep === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Profile</CardTitle>
              <CardDescription>
                Tell us about yourself and your {userRole === 'provider' ? 'expertise' : 'business needs'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    value={profileData.role}
                    onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                    placeholder="e.g. CEO, CTO, AI Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setProfileData({...profileData, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {userRole === 'provider' ? 'Professional Bio' : 'Company Description'}
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder={userRole === 'provider' 
                    ? "Tell potential clients about your expertise and experience..."
                    : "Describe your company and what you're looking to achieve with AI..."
                  }
                  rows={4}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('role')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleProfileSubmit}
                  disabled={!profileData.name || !profileData.email || !profileData.company}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preferences Step */}
        {currentStep === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {userRole === 'provider' ? 'Your Expertise & Pricing' : 'Your Project Requirements'}
              </CardTitle>
              <CardDescription>
                {userRole === 'provider' 
                  ? 'Tell us about your skills, experience, and pricing structure'
                  : 'Help us understand your project needs and budget'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>
                  {userRole === 'provider' ? 'Your Skills & Services' : 'Areas of Interest'}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(userRole === 'provider' ? providerSkills : clientNeeds).map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={userRole === 'provider' 
                          ? profileData.skills.includes(item)
                          : profileData.needs.includes(item)
                        }
                        onCheckedChange={(checked) => {
                          if (userRole === 'provider') {
                            setProfileData({
                              ...profileData,
                              skills: checked 
                                ? [...profileData.skills, item]
                                : profileData.skills.filter(s => s !== item)
                            })
                          } else {
                            setProfileData({
                              ...profileData,
                              needs: checked 
                                ? [...profileData.needs, item]
                                : profileData.needs.filter(n => n !== item)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={item} className="text-sm">{item}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider-specific fields */}
              {userRole === 'provider' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select onValueChange={(value) => setProfileData({...profileData, experience: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={profileData.pricing?.hourlyRate || ''}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          pricing: {
                            ...profileData.pricing,
                            hourlyRate: parseInt(e.target.value) || 0
                          }
                        })}
                        placeholder="150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectMin">Project Min ($)</Label>
                      <Input
                        id="projectMin"
                        type="number"
                        value={profileData.pricing?.projectMin || ''}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          pricing: {
                            ...profileData.pricing,
                            projectMin: parseInt(e.target.value) || 0
                          }
                        })}
                        placeholder="5000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectMax">Project Max ($)</Label>
                      <Input
                        id="projectMax"
                        type="number"
                        value={profileData.pricing?.projectMax || ''}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          pricing: {
                            ...profileData.pricing,
                            projectMax: parseInt(e.target.value) || 0
                          }
                        })}
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Client-specific fields */}
              {userRole === 'client' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Project Budget Range</Label>
                      <Select onValueChange={(value) => setProfileData({...profileData, budget: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10k">Under $10,000</SelectItem>
                          <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                          <SelectItem value="500k+">$500,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Project Timeline</Label>
                      <Select onValueChange={(value) => setProfileData({...profileData, projectTimeline: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP (1-2 weeks)</SelectItem>
                          <SelectItem value="1-3months">1-3 months</SelectItem>
                          <SelectItem value="3-6months">3-6 months</SelectItem>
                          <SelectItem value="6months+">6+ months</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Select onValueChange={(value) => setProfileData({...profileData, teamSize: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('profile')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={isSubmitting || (userRole === 'provider' 
                    ? profileData.skills.length === 0 
                    : profileData.needs.length === 0
                  )}
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Setup'}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Step */}
        {currentStep === 'complete' && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Welcome to Alliance AI!</CardTitle>
              <CardDescription>
                Your profile has been created successfully. Redirecting to your dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Profile Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Role:</strong> {userRole === 'provider' ? 'AI Provider' : 'Business Client'}</p>
                    <p><strong>Company:</strong> {profileData.company}</p>
                    <p><strong>Industry:</strong> {profileData.industry}</p>
                    <p><strong>{userRole === 'provider' ? 'Skills' : 'Interests'}:</strong> {
                      (userRole === 'provider' ? profileData.skills : profileData.needs).slice(0, 3).join(', ')
                    }{(userRole === 'provider' ? profileData.skills : profileData.needs).length > 3 ? '...' : ''}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  You'll be redirected to your dashboard in a moment...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

