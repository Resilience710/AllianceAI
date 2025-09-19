'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface BrowseErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BrowseError({ error, reset }: BrowseErrorProps) {
  useEffect(() => {
    console.error('Browse page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-lg space-y-6 rounded-3xl border border-destructive/30 bg-white/90 p-10 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">We could not load the marketplace</h1>
          <p className="text-sm text-gray-600">
            Please refresh the page or try again shortly. If the issue continues, contact support@aimarketplace.com.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="h-11 rounded-xl px-6">
            Try again
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl px-6">
            <a href="mailto:support@aimarketplace.com">Contact support</a>
          </Button>
        </div>
      </div>
    </div>
  )
}