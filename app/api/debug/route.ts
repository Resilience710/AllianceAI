import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG API: Starting database check')
    
    const results: any = {
      users: { count: 0, error: null, sample: null },
      services: { count: 0, error: null, sample: null },
      config: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      }
    }
    
    // Try to get users
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      results.users.count = usersSnapshot.size
      if (usersSnapshot.size > 0) {
        const firstUser = usersSnapshot.docs[0]
        results.users.sample = {
          id: firstUser.id,
          data: firstUser.data()
        }
      }
      console.log('✅ Users collection:', results.users.count, 'documents')
    } catch (error) {
      results.users.error = error instanceof Error ? error.message : 'Unknown error'
      console.log('❌ Users collection error:', results.users.error)
    }
    
    // Try to get services
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'))
      results.services.count = servicesSnapshot.size
      if (servicesSnapshot.size > 0) {
        const firstService = servicesSnapshot.docs[0]
        results.services.sample = {
          id: firstService.id,
          data: firstService.data()
        }
      }
      console.log('✅ Services collection:', results.services.count, 'documents')
    } catch (error) {
      results.services.error = error instanceof Error ? error.message : 'Unknown error'
      console.log('❌ Services collection error:', results.services.error)
    }
    
    console.log('📊 DEBUG API: Results:', results)
    return NextResponse.json(results, { status: 200 })
    
  } catch (error) {
    console.error('❌ DEBUG API: Fatal error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
