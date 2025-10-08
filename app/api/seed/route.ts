import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 SEED API: Starting database seeding')
    
    const results = {
      users: 0,
      services: 0,
      errors: []
    }
    
    // Create test provider users
    const testProviders = [
      {
        uid: 'test-provider-1',
        displayName: 'AI Solutions Expert',
        email: 'ai.expert@example.com',
        role: 'provider',
        bio: 'Experienced AI consultant specializing in machine learning and automation solutions.',
        skills: ['Machine Learning', 'Python', 'TensorFlow', 'AI Consulting'],
        location: 'San Francisco, CA',
        verified: true,
        hourlyRate: 150,
        experience: 'Expert',
        timezone: 'America/Los_Angeles',
        languages: ['English'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'test-provider-2',
        displayName: 'Data Science Pro',
        email: 'data.pro@example.com',
        role: 'provider',
        bio: 'Data scientist with 5+ years experience in analytics and machine learning.',
        skills: ['Data Science', 'Python', 'R', 'SQL', 'Analytics'],
        location: 'New York, NY',
        verified: true,
        hourlyRate: 120,
        experience: 'Senior',
        timezone: 'America/New_York',
        languages: ['English', 'Spanish'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    // Create users
    for (const provider of testProviders) {
      try {
        await setDoc(doc(db, 'users', provider.uid), provider)
        results.users++
        console.log('✅ Created user:', provider.displayName)
      } catch (error) {
        console.error('❌ Error creating user:', error)
        results.errors.push(`User ${provider.displayName}: ${error}`)
      }
    }
    
    // Create test services
    const testServices = [
      {
        title: 'AI Chatbot Development',
        shortDescription: 'Custom AI chatbot for customer service automation',
        category: 'Chatbots',
        price: 2500,
        visibility: 'public',
        ownerUid: 'test-provider-1',
        providerName: 'AI Solutions Expert',
        tags: ['AI', 'Chatbot', 'Automation'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Data Analytics Dashboard',
        shortDescription: 'Interactive dashboard for business intelligence',
        category: 'Analytics',
        price: 1800,
        visibility: 'public',
        ownerUid: 'test-provider-2',
        providerName: 'Data Science Pro',
        tags: ['Analytics', 'Dashboard', 'BI'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Machine Learning Model',
        shortDescription: 'Custom ML model for predictive analytics',
        category: 'Machine Learning',
        price: 3500,
        visibility: 'public',
        ownerUid: 'test-provider-1',
        providerName: 'AI Solutions Expert',
        tags: ['ML', 'Prediction', 'Analytics'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    // Create services
    for (const service of testServices) {
      try {
        await addDoc(collection(db, 'services'), service)
        results.services++
        console.log('✅ Created service:', service.title)
      } catch (error) {
        console.error('❌ Error creating service:', error)
        results.errors.push(`Service ${service.title}: ${error}`)
      }
    }
    
    console.log('🎉 SEED API: Seeding complete!', results)
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      results
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ SEED API: Fatal error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Seeding failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
