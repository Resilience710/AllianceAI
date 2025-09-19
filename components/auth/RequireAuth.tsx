"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    if (!loading && !user) {
      const searchString = search?.toString()
      const next = `${pathname}${searchString ? `?${searchString}` : ""}`
      router.replace(`/sign-in?next=${encodeURIComponent(next)}`)
      router.refresh()
    }
  }, [loading, user, router, pathname, search])

  if (loading || !user) {
    return <div className="p-6 text-sm opacity-70">Loading...</div>
  }

  return <>{children}</>
}

