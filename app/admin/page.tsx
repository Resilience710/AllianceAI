'use client'

import { AdminPanel } from '@/components/admin/AdminPanel'
import { useAuth } from '@/components/auth/AuthProvider'
import RequireAuth from '@/components/auth/RequireAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function AdminPage() {
  const { profile } = useAuth()
  
  // Check if user has admin privileges
  const isAdmin = profile?.role === 'admin' || profile?.email === 'admin@allianceai.com'

  if (!isAdmin) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                This area is restricted to platform administrators only.
              </p>
            </CardContent>
          </Card>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AdminPanel />
        </div>
      </div>
    </RequireAuth>
  )
}
