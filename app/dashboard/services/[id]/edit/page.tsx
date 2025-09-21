"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { useParams, useRouter } from "next/navigation"

import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { ServiceForm, type ServicePayload } from "@/components/services/ServiceForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"

export default function EditServicePage() {
  return (
    <RequireAuth>
      <EditServiceView />
    </RequireAuth>
  )
}

function EditServiceView() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [initialValues, setInitialValues] = useState<ServicePayload | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [docError, setDocError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        const ref = doc(db, "services", params.id)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setDocError("Service not found.")
          return
        }
        const data = snap.data()
        if (data.ownerUid !== user.uid) {
          setDocError("You do not have permission to edit this service.")
          return
        }
        setInitialValues({
          title: data.title,
          shortDescription: data.shortDescription,
          category: data.category,
          price: data.price,
          tags: Array.isArray(data.tags) ? data.tags : [],
          visibility: data.visibility ?? "public",
          coverImageUrl: data.coverImageUrl ?? undefined,
        })
      } catch (error) {
        console.error("Failed to load service", error)
        setDocError("Unable to load the service. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user && profile?.role === "provider") {
      void load()
    } else if (!loading && profile?.role !== "provider") {
      setDocError("Only providers can edit services.")
      setIsLoading(false)
    }
  }, [user, profile, loading, params.id])

  const handleSubmit = async (payload: ServicePayload) => {
    if (!user) return
    setFormError(null)

    try {
      const ref = doc(db, "services", params.id)
      await updateDoc(ref, {
        title: payload.title,
        shortDescription: payload.shortDescription,
        category: payload.category,
        price: payload.price,
        tags: payload.tags,
        visibility: payload.visibility,
        coverImageUrl: payload.coverImageUrl ?? null,
        updatedAt: serverTimestamp(),
      })
      router.replace("/dashboard/services")
      router.refresh()
    } catch (error: any) {
      console.error("Failed to update service", error)
      const message = typeof error?.code === "string" ? error.code : "Could not update the service."
      setFormError(message)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (docError || !initialValues) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl border border-amber-400/70 bg-amber-50/80">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">Service unavailable</CardTitle>
            <CardDescription className="text-amber-800">{docError ?? "Service could not be loaded."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/services")}>Back to services</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Edit service</h1>
          <p className="text-sm text-gray-600">Update details and visibility for your Alliance AI offering.</p>
        </div>
        <ServiceForm initialValues={initialValues} onSubmit={handleSubmit} error={formError} submitLabel="Save changes" />
      </div>
    </div>
  )
}
