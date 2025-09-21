"use client"

import { useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"

import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { ServiceForm, type ServicePayload } from "@/components/services/ServiceForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"

export default function NewServicePage() {
  return (
    <RequireAuth>
      <NewServiceView />
    </RequireAuth>
  )
}

function NewServiceView() {
  const router = useRouter()
  const { profile, user, loading } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  if (!loading && profile?.role !== "provider") {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl border border-amber-400/70 bg-amber-50/80">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">Provider access required</CardTitle>
            <CardDescription className="text-amber-800">
              Only provider accounts can publish Alliance AI services. Switch to a provider account or contact support if you
              should have access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (payload: ServicePayload) => {
    if (!user || !profile) return
    setFormError(null)

    try {
      await addDoc(collection(db, "services"), {
        ownerUid: user.uid,
        providerName: profile.displayName ?? profile.email,
        title: payload.title,
        shortDescription: payload.shortDescription,
        category: payload.category,
        price: payload.price,
        tags: payload.tags,
        visibility: payload.visibility,
        coverImageUrl: payload.coverImageUrl ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      router.replace("/dashboard/services")
      router.refresh()
    } catch (error: any) {
      console.error("Failed to create service", error)
      const message = typeof error?.code === "string" ? error.code : "We could not create the service."
      setFormError(message)
    }
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Create a new service</h1>
          <p className="text-sm text-gray-600">
            Describe the outcome, price, and visibility for clients browsing Alliance AI.
          </p>
        </div>
        <ServiceForm onSubmit={handleSubmit} error={formError} submitLabel="Create service" />
      </div>
    </div>
  )
}