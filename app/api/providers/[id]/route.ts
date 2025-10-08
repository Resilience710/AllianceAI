import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('🔍 API: Fetching provider with ID:', id)

    if (!id) {
      console.log('❌ API: No ID provided')
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      )
    }

    // First, try to get the user profile by UID (Firebase Auth ID)
    const userDocRef = doc(db, 'users', id)
    console.log('📡 API: Querying Firestore for user:', id)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      console.log('❌ API: User document not found in Firestore')
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    console.log('✅ API: User document found')

    const userData = userDocSnap.data()
    console.log('👤 API: User data:', {
      email: userData.email,
      role: userData.role,
      displayName: userData.displayName
    })

    // Check if this user is a provider/freelancer
    if (userData.role !== 'provider' && userData.role !== 'freelancer') {
      console.log('❌ API: User is not a provider, role is:', userData.role)
      return NextResponse.json(
        { error: 'User is not a provider' },
        { status: 404 }
      )
    }

    console.log('✅ API: User is a valid provider')

    // Get provider's services
    const servicesQuery = query(
      collection(db, 'services'),
      where('ownerUid', '==', id),
      where('visibility', '==', 'public')
    )
    const servicesSnapshot = await getDocs(servicesQuery)
    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Get provider's reviews (if any)
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('providerId', '==', id)
    )
    const reviewsSnapshot = await getDocs(reviewsQuery)
    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + ((review as any).rating || 0), 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    // Construct provider profile
    const provider = {
      id: userDocSnap.id,
      uid: userDocSnap.id,
      displayName: userData.displayName || userData.name || 'Anonymous Provider',
      email: userData.email,
      role: userData.role,
      bio: userData.bio || '',
      skills: userData.skills || [],
      location: userData.location || '',
      profilePicture: userData.profilePicture || '',
      verified: userData.verified || false,
      memberSince: userData.createdAt,
      services: services,
      reviews: reviews,
      rating: averageRating,
      reviewCount: reviews.length,
      totalProjects: services.length, // Simplified - could be more sophisticated
      responseTime: userData.responseTime || '< 24 hours',
      hourlyRate: userData.hourlyRate || null,
      availability: userData.availability || null,
      portfolio: userData.portfolio || [],
      certifications: userData.certifications || [],
      languages: userData.languages || ['English'],
      timezone: userData.timezone || 'UTC',
      experience: userData.experience || 'Intermediate',
      specializations: userData.specializations || [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }

    return NextResponse.json(provider, { status: 200 })

  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
