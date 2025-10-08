import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Fetching all public services')
    
    // Get all public services
    const servicesQuery = query(
      collection(db, 'services'),
      where('visibility', '==', 'public')
    )
    
    const servicesSnapshot = await getDocs(servicesQuery)
    console.log('📊 API: Found', servicesSnapshot.size, 'public services')
    
    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log('✅ API: Returning services:', services.length)
    return NextResponse.json(services, { status: 200 })
    
  } catch (error) {
    console.error('❌ API: Error fetching services:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
