'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/auth/AuthProvider'

export default function DebugPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [apiServices, setApiServices] = useState<any[]>([])
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        
        // Fetch debug info from server-side API
        try {
          const debugResponse = await fetch('/api/debug')
          if (debugResponse.ok) {
            const debugData = await debugResponse.json()
            setDebugInfo(debugData)
            console.log('Debug info:', debugData)
          }
        } catch (debugError) {
          console.log('Debug API fetch failed:', debugError)
        }

        // Try to fetch services via API (this should work)
        try {
          const apiResponse = await fetch('/api/services')
          if (apiResponse.ok) {
            const apiServicesData = await apiResponse.json()
            setApiServices(apiServicesData)
          }
        } catch (apiError) {
          console.log('API services fetch failed:', apiError)
        }

        // Try direct Firestore access (might fail due to security rules)
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'))
          const usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setUsers(usersData)
        } catch (userError) {
          console.log('Direct user fetch failed (expected due to security rules):', userError)
        }

        try {
          const servicesSnapshot = await getDocs(collection(db, 'services'))
          const servicesData = servicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setServices(servicesData)
        } catch (serviceError) {
          console.log('Direct service fetch failed:', serviceError)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSeedDatabase = async () => {
    setSeeding(true)
    setSeedResult(null)
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      setSeedResult(result)
      
      if (result.success) {
        // Refresh the debug data
        window.location.reload()
      }
    } catch (error) {
      setSeedResult({
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading debug data...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug: Database Contents</h1>
      
      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Authentication Status</h2>
        {user ? (
          <div>
            <div><strong>✅ Logged in as:</strong> {user.email}</div>
            <div><strong>UID:</strong> {user.uid}</div>
            <div><strong>Display Name:</strong> {user.displayName || 'Not set'}</div>
          </div>
        ) : (
          <div className="text-red-600">❌ Not logged in</div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Server-side Debug Info */}
      {debugInfo && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="font-semibold mb-2">Server-side Database Check</h2>
          <div className="space-y-2">
            <div>
              <strong>Users:</strong> {debugInfo.users.count} documents
              {debugInfo.users.error && <span className="text-red-600 ml-2">Error: {debugInfo.users.error}</span>}
              {debugInfo.users.sample && (
                <div className="ml-4 mt-1 text-sm">
                  Sample: {debugInfo.users.sample.data.email} ({debugInfo.users.sample.data.role})
                </div>
              )}
            </div>
            <div>
              <strong>Services:</strong> {debugInfo.services.count} documents
              {debugInfo.services.error && <span className="text-red-600 ml-2">Error: {debugInfo.services.error}</span>}
              {debugInfo.services.sample && (
                <div className="ml-4 mt-1 text-sm">
                  Sample: {debugInfo.services.sample.data.title} by {debugInfo.services.sample.data.providerName}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seed Database Section */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="font-semibold mb-2">🌱 Seed Test Data</h2>
        <p className="text-sm text-gray-600 mb-4">
          If your database is empty, click this button to create test providers and services.
        </p>
        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {seeding ? 'Seeding...' : 'Seed Database'}
        </button>
        
        {seedResult && (
          <div className={`mt-4 p-3 rounded ${seedResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {seedResult.success ? (
              <div>
                ✅ Success! Created {seedResult.results?.users || 0} users and {seedResult.results?.services || 0} services.
              </div>
            ) : (
              <div>
                ❌ Error: {seedResult.error}
                {seedResult.details && <div className="text-sm mt-1">{seedResult.details}</div>}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="border p-4 rounded">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>Display Name:</strong> {user.displayName}</div>
                <div><strong>Created:</strong> {user.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}</div>
                {user.role === 'provider' || user.role === 'freelancer' ? (
                  <div className="mt-2 p-2 bg-green-100 rounded">
                    <strong>✅ PROVIDER</strong>
                    <br />
                    <a 
                      href={`/provider/${user.id}`} 
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      View Profile →
                    </a>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-gray-100 rounded">
                    <strong>👤 {user.role?.toUpperCase() || 'NO ROLE'}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">API Services ({apiServices.length})</h2>
          <div className="space-y-4">
            {apiServices.map(service => (
              <div key={service.id} className="border p-4 rounded">
                <div><strong>Title:</strong> {service.title}</div>
                <div><strong>Owner UID:</strong> {service.ownerUid}</div>
                <div><strong>Provider Name:</strong> {service.providerName}</div>
                <div><strong>Category:</strong> {service.category}</div>
                <div><strong>Price:</strong> ${service.price}</div>
                <div><strong>Visibility:</strong> {service.visibility}</div>
                {service.ownerUid && (
                  <div className="mt-2">
                    <a 
                      href={`/provider/${service.ownerUid}`} 
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      View Provider Profile →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Direct Services ({services.length})</h2>
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.id} className="border p-4 rounded">
                <div><strong>Title:</strong> {service.title}</div>
                <div><strong>Owner UID:</strong> {service.ownerUid}</div>
                <div><strong>Provider Name:</strong> {service.providerName}</div>
                <div><strong>Category:</strong> {service.category}</div>
                <div><strong>Price:</strong> ${service.price}</div>
                <div><strong>Visibility:</strong> {service.visibility}</div>
                {service.ownerUid && (
                  <div className="mt-2">
                    <a 
                      href={`/provider/${service.ownerUid}`} 
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      View Provider Profile →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
