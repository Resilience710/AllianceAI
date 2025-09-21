"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore"

import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { formatPrice, normalizePrice } from "@/lib/pricing"
import type { Service, ServiceVisibility } from "@/types/service"

export default function ServicesDashboardPage() {
  return (
    <RequireAuth>
      <ProviderServicesView />
    </RequireAuth>
  )
}

function ProviderServicesView() {
  const router = useRouter()
  const { profile, user, loading } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && profile?.role !== "provider") {
      setMessage("Only providers can manage services. If this is unexpected, contact support.")
      setIsLoading(false)
    }
  }, [loading, profile])

  useEffect(() => {
    if (!user || profile?.role !== "provider") {
      return
    }

    const servicesQuery = query(collection(db, "services"), where("ownerUid", "==", user.uid))

    const unsubscribe = onSnapshot(
      servicesQuery,
      (snapshot) => {
        const fallbackProviderName = profile?.displayName ?? profile?.email ?? user.email ?? "Alliance AI Provider"

        const next: Service[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>
          const ownerUid = typeof data.ownerUid === "string" && data.ownerUid.length > 0 ? data.ownerUid : user.uid
          const providerName =
            typeof data.providerName === "string" && data.providerName.length > 0
              ? data.providerName
              : fallbackProviderName
          const title = typeof data.title === "string" && data.title.length > 0 ? data.title : "Untitled service"
          const shortDescription =
            typeof data.shortDescription === "string" ? data.shortDescription : ""
          const category =
            typeof data.category === "string" && data.category.length > 0 ? data.category : "General"
          const tags = Array.isArray(data.tags)
            ? data.tags.filter((tag): tag is string => typeof tag === "string")
            : []
          const visibility: ServiceVisibility =
            data.visibility === "public" || data.visibility === "draft" ? (data.visibility as ServiceVisibility) : "draft"
          const coverImageUrl =
            typeof data.coverImageUrl === "string" && data.coverImageUrl.length > 0 ? data.coverImageUrl : null

          return {
            id: docSnap.id,
            ownerUid,
            providerName,
            title,
            shortDescription,
            category,
            price: normalizePrice(data.price),
            tags,
            visibility,
            coverImageUrl,
            createdAt: data.createdAt as Service["createdAt"],
            updatedAt: data.updatedAt as Service["updatedAt"],
          }
        })

        next.sort((a, b) => {
          const timeA = a.updatedAt && "toDate" in a.updatedAt ? a.updatedAt.toDate().getTime() : 0
          const timeB = b.updatedAt && "toDate" in b.updatedAt ? b.updatedAt.toDate().getTime() : 0
          return timeB - timeA
        })

        setServices(next)
        setMessage(null)
        setIsLoading(false)
      },
      (error) => {
        console.error("Failed to load provider services", error)
        setMessage("We couldn't load your services. Please refresh or try again later.")
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, profile])

  const handleToggleVisibility = async (service: Service) => {
    const nextVisibility: ServiceVisibility = service.visibility === "public" ? "draft" : "public"
    try {
      await updateDoc(doc(db, "services", service.id), {
        visibility: nextVisibility,
        updatedAt: serverTimestamp(),
      })
      setMessage(`Visibility updated to ${nextVisibility}.`)
    } catch (error) {
      console.error("Failed to toggle visibility", error)
      setMessage("Failed to update visibility. Please try again.")
    }
  }

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(`Delete ${service.title}? This action cannot be undone.`)
    if (!confirmed) return
    try {
      await deleteDoc(doc(db, "services", service.id))
      setMessage("Service deleted.")
    } catch (error) {
      console.error("Failed to delete service", error)
      setMessage("Could not delete the service. Please try again.")
    }
  }

  const lastUpdatedLabel = (service: Service) => {
    const timestamp = service.updatedAt ?? service.createdAt
    if (!timestamp) return ""
    const date = "toDate" in timestamp ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString()
  }

  const cta = useMemo(() => {
    if (profile?.role !== "provider") {
      return (
        <Card className="border border-amber-400/60 bg-amber-50/80 text-amber-900">
          <CardHeader>
            <CardTitle>Provider tools unavailable</CardTitle>
            <CardDescription>
              Only providers can publish services. Switch to a provider account or contact support for access.
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }
    return null
  }, [profile?.role])

  if (isLoading) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (cta) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        {cta}
      </div>
    )
  }

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My services</h1>
          <p className="text-sm text-gray-600">Create offerings for Alliance AI clients to discover.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/services/new")}>Create service</Button>
      </div>

      {message ? (
        <div className="mx-auto mt-6 max-w-6xl rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
          {message}
        </div>
      ) : null}

      <div className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2">
        {services.length === 0 ? (
          <Card className="col-span-full border border-dashed border-primary/40 bg-white/80 p-10 text-center shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">No services yet</CardTitle>
              <CardDescription>Add your first service to make it visible to clients browsing the marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/dashboard/services/new")}>Create your first service</Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="border border-white/60 bg-white/85 shadow-sm transition hover:shadow-md">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  <Badge variant={service.visibility === "public" ? "secondary" : "outline"}>
                    {service.visibility}
                  </Badge>
                </div>
                <CardDescription>{service.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{service.category}</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
                {service.tags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <p className="text-xs text-muted-foreground">Last updated: {lastUpdatedLabel(service)}</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => router.push(`/dashboard/services/${service.id}/edit`)}>
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleToggleVisibility(service)}>
                    Set {service.visibility === "public" ? "draft" : "public"}
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(service)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
