'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the proper sign-in page
    router.replace('/sign-in')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  )
}

