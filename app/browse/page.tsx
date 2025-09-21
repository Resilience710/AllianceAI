"use client"

import * as React from "react"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
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
]

export default function BrowsePage() {
  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [priceFilter, setPriceFilter] = React.useState("all")
  const [sort, setSort] = React.useState("recent")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const servicesQuery = query(
      collection(db, "services"),
      where("visibility", "==", "public"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(servicesQuery, (snapshot) => {
      const next: Service[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ownerUid: data.ownerUid,
          providerName: data.providerName ?? "Alliance AI Provider",
          title: data.title,
          shortDescription: data.shortDescription,
          category: data.category,
          price: data.price,
          tags: Array.isArray(data.tags) ? data.tags : [],
          visibility: data.visibility,
          coverImageUrl: data.coverImageUrl ?? "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      setServices(next)
      setLoading(false)
    })

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
          if (priceFilter === "under-1000") return service.price < 1000
          if (priceFilter === "1000-5000") return service.price >= 1000 && service.price <= 5000
          if (priceFilter === "over-5000") return service.price > 5000
          return true
        })()

        return matchesSearch && matchesCategory && matchesPrice
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price
        if (sort === "price-desc") return b.price - a.price
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
                      <span>${service.price.toLocaleString()}</span>
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
