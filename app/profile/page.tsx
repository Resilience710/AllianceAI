"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Building, Mail, MapPin, Calendar, DollarSign, Clock, Users, Award, Save, ArrowLeft, Upload, FileText } from 'lucide-react'
import RequireAuth from '@/components/auth/RequireAuth'
import { useAuth } from '@/components/auth/AuthProvider'
import { db } from '@/lib/firebase'
import { FileUpload } from '@/components/ui/file-upload'

interface ExtendedProfile {
  uid: string
  email: string
  role: "client" | "provider"
  displayName?: string | null
  company?: string
  jobTitle?: string
  industry?: string
  bio?: string
  skills?: string[]
  needs?: string[]
  budget?: string
  projectTimeline?: string
  teamSize?: string
  experience?: string
  pricing?: {
    hourlyRate?: number
    projectMin?: number
    projectMax?: number
  }
  portfolio?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: Date
  }>
  certifications?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
    uploadedAt: Date
  }>
  location?: string
  website?: string
  phone?: string
  profileComplete?: boolean
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

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ExtendedProfile | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (profile && user) {
      setProfileData({
        uid: user.uid,
        email: profile.email,
        role: profile.role,
        displayName: profile.displayName,
        company: (profile as any).company || '',
        jobTitle: (profile as any).jobTitle || '',
        industry: (profile as any).industry || '',
        bio: (profile as any).bio || '',
        skills: (profile as any).skills || [],
        needs: (profile as any).needs || [],
        budget: (profile as any).budget || '',
        projectTimeline: (profile as any).projectTimeline || '',
        teamSize: (profile as any).teamSize || '',
        experience: (profile as any).experience || '',
        pricing: (profile as any).pricing || { hourlyRate: 0, projectMin: 0, projectMax: 0 },
        portfolio: (profile as any).portfolio || [],
        certifications: (profile as any).certifications || [],
        location: (profile as any).location || '',
        website: (profile as any).website || '',
        phone: (profile as any).phone || '',
        profileComplete: (profile as any).profileComplete || false
      })
    }
  }, [profile, user])

  const handleSave = async () => {
    if (!user || !profileData) return

    setIsSaving(true)
    try {
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      }
      delete (updateData as any).uid

      await updateDoc(doc(db, 'users', user.uid), updateData)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    if (!profileData) return
    
    const currentSkills = profileData.skills || []
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill]
    
    setProfileData({ ...profileData, skills: updatedSkills })
  }

  const handleNeedToggle = (need: string) => {
    if (!profileData) return
    
    const currentNeeds = profileData.needs || []
    const updatedNeeds = currentNeeds.includes(need)
      ? currentNeeds.filter(n => n !== need)
      : [...currentNeeds, need]
    
    setProfileData({ ...profileData, needs: updatedNeeds })
  }

  if (loading || !profileData) {
    return (
      <RequireAuth>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your {profileData.role} profile information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={profileData.role === 'provider' ? 'default' : 'secondary'}>
                {profileData.role === 'provider' ? 'AI Provider' : 'Business Client'}
              </Badge>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="displayName"
                      value={profileData.displayName || ''}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.displayName || 'Not provided'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  {isEditing ? (
                    <Input
                      id="company"
                      value={profileData.company || ''}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Building className="mr-2 h-4 w-4 text-gray-400" />
                      {profileData.company || 'Not provided'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  {isEditing ? (
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle || ''}
                      onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.jobTitle || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  {isEditing ? (
                    <Select value={profileData.industry || ''} onValueChange={(value) => setProfileData({...profileData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900">{profileData.industry || 'Not provided'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={profileData.location || ''}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      {profileData.location || 'Not provided'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={profileData.website || ''}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.website || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profileData.bio || ''}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    placeholder={profileData.role === 'provider' 
                      ? "Tell potential clients about your expertise and experience..."
                      : "Describe your company and what you're looking to achieve with AI..."
                    }
                  />
                ) : (
                  <p className="text-gray-900">{profileData.bio || 'No bio provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role-specific sections */}
          {profileData.role === 'provider' && (
            <>
              {/* Provider Skills & Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Skills & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Your Skills & Services</Label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {providerSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill}
                              checked={profileData.skills?.includes(skill) || false}
                              onCheckedChange={() => handleSkillToggle(skill)}
                            />
                            <Label htmlFor={skill} className="text-sm">{skill}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills?.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        )) || <p className="text-gray-500">No skills selected</p>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    {isEditing ? (
                      <Select value={profileData.experience || ''} onValueChange={(value) => setProfileData({...profileData, experience: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">{profileData.experience || 'Not specified'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Provider Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Pricing Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      {isEditing ? (
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
                        />
                      ) : (
                        <p className="text-gray-900">${profileData.pricing?.hourlyRate || 0}/hour</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectMin">Project Minimum ($)</Label>
                      {isEditing ? (
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
                        />
                      ) : (
                        <p className="text-gray-900">${profileData.pricing?.projectMin?.toLocaleString() || 0}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectMax">Project Maximum ($)</Label>
                      {isEditing ? (
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
                        />
                      ) : (
                        <p className="text-gray-900">${profileData.pricing?.projectMax?.toLocaleString() || 0}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio & Certifications for Providers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Portfolio & Certifications
                  </CardTitle>
                  <CardDescription>
                    Upload your work samples, case studies, and certifications to showcase your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FileUpload
                      files={profileData.portfolio || []}
                      onFilesChange={(files) => setProfileData({...profileData, portfolio: files})}
                      maxFiles={10}
                      acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.ppt', '.pptx']}
                      maxSizeInMB={25}
                      uploadPath={`portfolios/${user?.uid}`}
                      label="Portfolio Files"
                      description="Upload work samples, case studies, presentations, and project documentation"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <FileUpload
                      files={profileData.certifications || []}
                      onFilesChange={(files) => setProfileData({...profileData, certifications: files})}
                      maxFiles={5}
                      acceptedTypes={['image/*', 'application/pdf']}
                      maxSizeInMB={10}
                      uploadPath={`certifications/${user?.uid}`}
                      label="Certifications"
                      description="Upload certificates, diplomas, and professional credentials"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {profileData.role === 'client' && (
            <>
              {/* Client Needs & Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Project Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Areas of Interest</Label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {clientNeeds.map((need) => (
                          <div key={need} className="flex items-center space-x-2">
                            <Checkbox
                              id={need}
                              checked={profileData.needs?.includes(need) || false}
                              onCheckedChange={() => handleNeedToggle(need)}
                            />
                            <Label htmlFor={need} className="text-sm">{need}</Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.needs?.map((need) => (
                          <Badge key={need} variant="outline">{need}</Badge>
                        )) || <p className="text-gray-500">No areas selected</p>}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      {isEditing ? (
                        <Select value={profileData.budget || ''} onValueChange={(value) => setProfileData({...profileData, budget: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-10k">Under $10,000</SelectItem>
                            <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                            <SelectItem value="500k+">$500,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-900 flex items-center">
                          <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                          {profileData.budget || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Project Timeline</Label>
                      {isEditing ? (
                        <Select value={profileData.projectTimeline || ''} onValueChange={(value) => setProfileData({...profileData, projectTimeline: value})}>
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
                      ) : (
                        <p className="text-gray-900 flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-400" />
                          {profileData.projectTimeline || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      {isEditing ? (
                        <Select value={profileData.teamSize || ''} onValueChange={(value) => setProfileData({...profileData, teamSize: value})}>
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
                      ) : (
                        <p className="text-gray-900 flex items-center">
                          <Users className="mr-2 h-4 w-4 text-gray-400" />
                          {profileData.teamSize || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio & Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Portfolio & Certifications
                  </CardTitle>
                  <CardDescription>
                    Upload your work samples, case studies, and certifications to showcase your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FileUpload
                      files={profileData.portfolio || []}
                      onFilesChange={(files) => setProfileData({...profileData, portfolio: files})}
                      maxFiles={10}
                      acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.ppt', '.pptx']}
                      maxSizeInMB={25}
                      uploadPath={`portfolios/${user?.uid}`}
                      label="Portfolio Files"
                      description="Upload work samples, case studies, presentations, and project documentation"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <FileUpload
                      files={profileData.certifications || []}
                      onFilesChange={(files) => setProfileData({...profileData, certifications: files})}
                      maxFiles={5}
                      acceptedTypes={['image/*', 'application/pdf']}
                      maxSizeInMB={10}
                      uploadPath={`certifications/${user?.uid}`}
                      label="Certifications"
                      description="Upload certificates, diplomas, and professional credentials"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  )
}
