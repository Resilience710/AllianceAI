"use client"

import * as React from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { Filter, Search, MessageCircle, ExternalLink, MapPin, DollarSign, Star, Users } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { db } from "@/lib/firebase"
import { formatPrice, normalizePrice } from "@/lib/pricing"
import type { Service } from "@/types/service"

const PAGE_SIZE = 9

const categoryFilters = [
  { label: "All categories", value: "all" },
  { label: "Chatbots", value: "Chatbots" },
  { label: "Automation", value: "Automation" },
  { label: "Consulting", value: "Consulting" },
  { label: "Training", value: "Training" },
  { label: "Design", value: "Design" },
  { label: "Analytics", value: "Analytics" },
  { label: "Marketing", value: "Marketing" },
]

const priceFilters = [
  { label: "All prices", value: "all" },
  { label: "Under $1,000", value: "under-1000" },
  { label: "$1,000 - $5,000", value: "1000-5000" },
  { label: "Over $5,000", value: "over-5000" },
]

const sortOptions = [
  { label: "Most recent", value: "recent" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Experience: Most to Least", value: "experience-desc" },
]

const skillFilters = [
  "Machine Learning", "Natural Language Processing", "Computer Vision", "Deep Learning",
  "AI Strategy", "Data Science", "Automation", "Chatbot Development", "AI Training",
  "Consulting", "Custom AI Solutions", "AI Integration", "Predictive Analytics"
]

const experienceFilters = [
  { label: "All experience levels", value: "all" },
  { label: "1-2 years", value: "1-2" },
  { label: "3-5 years", value: "3-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
]

export default function BrowsePage() {
  const router = useRouter()
  const [services, setServices] = React.useState<Service[]>([])
  const [providers, setProviders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [priceFilter, setPriceFilter] = React.useState("all")
  const [sort, setSort] = React.useState("recent")
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = React.useState("all")
  const [priceRange, setPriceRange] = React.useState([0, 10000])
  const [locationFilter, setLocationFilter] = React.useState("")
  const [showFilters, setShowFilters] = React.useState(false)
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const servicesQuery = query(
      collection(db, "services"),
      where("visibility", "==", "public"),
    )

    const unsubscribe = onSnapshot(
      servicesQuery,
      (snapshot) => {
        const next: Service[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Record<string, unknown>
          const providerName =
            typeof data.providerName === "string" && data.providerName.length > 0
              ? data.providerName
              : "Alliance AI Provider"
          const title = typeof data.title === "string" && data.title.length > 0 ? data.title : "Untitled service"
          const shortDescription =
            typeof data.shortDescription === "string" ? data.shortDescription : ""
          const category =
            typeof data.category === "string" && data.category.length > 0 ? data.category : "General"
          const tags = Array.isArray(data.tags)
            ? data.tags.filter((tag): tag is string => typeof tag === "string")
            : []
          const visibility =
            data.visibility === "public" || data.visibility === "draft" ? (data.visibility as Service["visibility"]) : "draft"
          const coverImageUrl =
            typeof data.coverImageUrl === "string" && data.coverImageUrl.length > 0 ? data.coverImageUrl : null

          return {
            id: docSnap.id,
            ownerUid: typeof data.ownerUid === "string" ? data.ownerUid : "",
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
          const timeA = a.createdAt && "toDate" in a.createdAt ? a.createdAt.toDate().getTime() : 0
          const timeB = b.createdAt && "toDate" in b.createdAt ? b.createdAt.toDate().getTime() : 0
          return timeB - timeA
        })

        setServices(next)
        setError(null)
        setLoading(false)
      },
      (error) => {
        console.error("Failed to load public services", error)
        setError("We couldn't load marketplace services. Please refresh or try again later.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    setPage(1)
  }, [searchTerm, category, priceFilter, sort])

  const filtered = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return services
      .filter((service) => {
        const matchesSearch =
          term.length === 0 ||
          service.title.toLowerCase().includes(term) ||
          service.shortDescription.toLowerCase().includes(term) ||
          service.tags.some((tag) => tag.toLowerCase().includes(term))

        const matchesCategory = category === "all" || service.category === category

        const matchesPrice = (() => {
          if (priceFilter === "all") return true
          if (service.price == null) return false
          if (priceFilter === "under-1000") return service.price < 1000
          if (priceFilter === "1000-5000") return service.price >= 1000 && service.price <= 5000
          if (priceFilter === "over-5000") return service.price > 5000
          return true
        })()

        return matchesSearch && matchesCategory && matchesPrice
      })
      .sort((a, b) => {
        if (sort === "price-asc") {
          const priceA = a.price ?? Number.POSITIVE_INFINITY
          const priceB = b.price ?? Number.POSITIVE_INFINITY
          return priceA - priceB
        }
        if (sort === "price-desc") {
          const priceA = a.price ?? Number.NEGATIVE_INFINITY
          const priceB = b.price ?? Number.NEGATIVE_INFINITY
          return priceB - priceA
        }
        const timeA = a.createdAt && "toDate" in a.createdAt ? a.createdAt.toDate().getTime() : 0
        const timeB = b.createdAt && "toDate" in b.createdAt ? b.createdAt.toDate().getTime() : 0
        return timeB - timeA
      })
  }, [services, searchTerm, category, priceFilter, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = React.useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  return (
    <div className="space-y-12 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/40 bg-white/80 px-6 py-12 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold text-gray-900">Browse AI services</h1>
              <p className="text-sm text-gray-600">
                Discover Alliance AI providers offering automation, analytics, strategy, and education solutions.
              </p>
            </div>
            <form className="flex w-full max-w-md items-center gap-2" onSubmit={(event) => event.preventDefault()}>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search services, providers, or tags"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Narrow your search
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilters.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  {priceFilters.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="hidden lg:block" />
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <Card key={index} className="border border-white/60 bg-white/70 p-6 shadow-sm">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                  <div className="mt-6 flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border border-destructive/40 bg-destructive/10 p-6 text-destructive shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg">Marketplace temporarily unavailable</CardTitle>
                <CardDescription className="text-sm text-destructive">{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="border border-dashed border-primary/40 bg-white/80 p-10 text-center shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">No services found</CardTitle>
                <CardDescription>
                  Adjust your filters or search terms to discover more Alliance AI provider offerings.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginated.map((service) => (
                <Card key={service.id} className="flex h-full flex-col justify-between border border-white/60 bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{service.shortDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{service.category}</span>
                      <span>{formatPrice(service.price)}</span>
                    </div>
                    <p className="text-sm text-gray-500">Provider: {service.providerName}</p>
                    {service.tags.length ? (
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-primary/30 px-2 py-1 text-xs text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => router.push(`/provider/${service.ownerUid}`)}
                        className="flex-1"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => router.push(`/messages?provider=${service.ownerUid}`)}
                        className="flex-1"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE ? (
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="pt-6" />
          ) : null}
        </div>
      </section>
    </div>
  )
}
