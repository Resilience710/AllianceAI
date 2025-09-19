'use client'

import * as React from 'react'
import Link from 'next/link'
import { Filter, Search } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SolutionCard } from '@/components/shared/SolutionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'

type PriceTier = 'free' | 'starter' | 'growth' | 'enterprise'

type MarketplaceSolution = {
  id: string
  name: string
  category: string
  priceTier: PriceTier
  rating: number
  reviews: number
  description: string
  price: string
  tags: string[]
  href: string
  launchedAt: string
}

const ALL_SOLUTIONS: MarketplaceSolution[] = [
  {
    id: 'aurora-assist',
    name: 'Aurora Assist',
    category: 'AI Agents',
    priceTier: 'growth',
    rating: 4.9,
    reviews: 132,
    description: 'Enterprise-ready conversational agents for sales enablement and customer success.',
    price: 'From $2,500',
    tags: ['Automation', 'Sales', 'Customer Success'],
    href: '/provider/aurora-assist',
    launchedAt: '2024-02-14',
  },
  {
    id: 'datamind-academy',
    name: 'DataMind Academy',
    category: 'AI Education',
    priceTier: 'starter',
    rating: 4.8,
    reviews: 89,
    description: 'Full-stack AI training programs for technical teams and business stakeholders.',
    price: 'From $499',
    tags: ['Education', 'Workshops', 'Upskilling'],
    href: '/provider/datamind-academy',
    launchedAt: '2023-11-05',
  },
  {
    id: 'neural-consulting',
    name: 'Neural Consulting',
    category: 'AI Strategy',
    priceTier: 'enterprise',
    rating: 5,
    reviews: 45,
    description: 'Strategic advisory to guide AI transformation and roadmap execution.',
    price: 'From $5,000',
    tags: ['Strategy', 'Enterprise', 'Transformation'],
    href: '/provider/neural-consulting',
    launchedAt: '2024-03-10',
  },
  {
    id: 'visionary-analytics',
    name: 'Visionary Analytics',
    category: 'AI Agents',
    priceTier: 'growth',
    rating: 4.7,
    reviews: 76,
    description: 'Real-time analytics copilots for operations, finance, and data teams.',
    price: 'From $1,800',
    tags: ['Analytics', 'Dashboards', 'Insights'],
    href: '/provider/visionary-analytics',
    launchedAt: '2024-01-20',
  },
  {
    id: 'quantum-labs',
    name: 'Quantum Labs',
    category: 'AI Solutions',
    priceTier: 'enterprise',
    rating: 4.95,
    reviews: 61,
    description: 'Custom AI solutions with full lifecycle support for regulated industries.',
    price: 'Custom pricing',
    tags: ['Healthcare', 'Finance', 'Compliance'],
    href: '/provider/quantum-labs',
    launchedAt: '2023-12-01',
  },
  {
    id: 'atlas-automation',
    name: 'Atlas Automation',
    category: 'AI Agents',
    priceTier: 'starter',
    rating: 4.6,
    reviews: 104,
    description: 'Workflow automation bots for revenue operations and support teams.',
    price: 'From $1,200',
    tags: ['Automation', 'RevOps', 'Support'],
    href: '/provider/atlas-automation',
    launchedAt: '2024-04-08',
  },
  {
    id: 'insight-forge',
    name: 'Insight Forge',
    category: 'AI Education',
    priceTier: 'free',
    rating: 4.4,
    reviews: 210,
    description: 'Free AI literacy fundamentals paired with pro-level certification modules.',
    price: 'Free tier available',
    tags: ['Certification', 'AI Literacy', 'Learning'],
    href: '/provider/insight-forge',
    launchedAt: '2023-09-18',
  },
  {
    id: 'signal-optim',
    name: 'Signal Optim',
    category: 'AI Solutions',
    priceTier: 'growth',
    rating: 4.85,
    reviews: 58,
    description: 'Predictive maintenance modeling for industrial and manufacturing operators.',
    price: 'From $3,200',
    tags: ['Manufacturing', 'Predictive', 'Maintenance'],
    href: '/provider/signal-optim',
    launchedAt: '2024-02-02',
  },
  {
    id: 'clarity-assist',
    name: 'Clarity Assist',
    category: 'AI Strategy',
    priceTier: 'growth',
    rating: 4.75,
    reviews: 34,
    description: 'Fractional AI leadership to align product, data, and go-to-market execution.',
    price: 'From $4,200',
    tags: ['Leadership', 'Product', 'Enablement'],
    href: '/provider/clarity-assist',
    launchedAt: '2024-03-01',
  },
]

const categories = ['All categories', 'AI Agents', 'AI Education', 'AI Strategy', 'AI Solutions']
const priceTiers: { value: PriceTier | 'all'; label: string }[] = [
  { value: 'all', label: 'All tiers' },
  { value: 'free', label: 'Free' },
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'enterprise', label: 'Enterprise' },
]
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A to Z' },
]

const PAGE_SIZE = 6

export function BrowseClient() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All categories')
  const [selectedTier, setSelectedTier] = React.useState<PriceTier | 'all'>('all')
  const [sortOption, setSortOption] = React.useState<string>('featured')
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const loadingTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const startLoading = React.useCallback(() => {
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current)
    }
    setIsLoading(true)
    loadingTimeout.current = setTimeout(() => {
      setIsLoading(false)
    }, 250)
  }, [])

  React.useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
    }
  }, [])

  const filteredSolutions = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const results = ALL_SOLUTIONS.filter((solution) => {
      const matchesCategory =
        selectedCategory === 'All categories' || solution.category === selectedCategory
      const matchesTier = selectedTier === 'all' || solution.priceTier === selectedTier
      const matchesSearch =
        normalizedSearch.length === 0 ||
        solution.name.toLowerCase().includes(normalizedSearch) ||
        solution.description.toLowerCase().includes(normalizedSearch) ||
        solution.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))

      return matchesCategory && matchesTier && matchesSearch
    })

    results.sort((a, b) => {
      switch (sortOption) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime()
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        default:
          return b.rating - a.rating
      }
    })

    return results
  }, [searchTerm, selectedCategory, selectedTier, sortOption])

  const pageCount = Math.max(1, Math.ceil(filteredSolutions.length / PAGE_SIZE))

  React.useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedCategory, selectedTier, sortOption])

  React.useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const paginatedSolutions = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredSolutions.slice(start, start + PAGE_SIZE)
  }, [filteredSolutions, page])

  const hasResults = paginatedSolutions.length > 0

  return (
    <div className="space-y-12 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Marketplace"
          title="Browse AI Solutions"
          description="Search and filter curated AI agents, education partners, and solution providers to match your goals."
          align="center"
          actions={
            <form
              onSubmit={(event) => {
                event.preventDefault()
                startLoading()
              }}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                    startLoading()
                  }}
                  placeholder="Search by solution, provider, or keyword"
                  className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-base shadow-sm"
                  aria-label="Search solutions"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-xl px-8 text-base">
                Search
              </Button>
            </form>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>Filter results</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value)
                  startLoading()
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedTier}
                onValueChange={(value) => {
                  setSelectedTier(value as PriceTier | 'all')
                  startLoading()
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Price tier" />
                </SelectTrigger>
                <SelectContent>
                  {priceTiers.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      {tier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortOption}
                onValueChange={(value) => {
                  setSortOption(value)
                  startLoading()
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={PAGE_SIZE.toString()}
                onValueChange={() => {
                  startLoading()
                }}
                disabled
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white text-sm">
                  <SelectValue placeholder="Results per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PAGE_SIZE.toString()}>{PAGE_SIZE} per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div key={index} className="space-y-4 rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))
              : hasResults
              ? paginatedSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.id}
                    name={solution.name}
                    description={solution.description}
                    tags={solution.tags}
                    rating={solution.rating}
                    reviews={solution.reviews}
                    price={solution.price}
                    href={solution.href}
                    logo={
                      <span className="text-lg font-semibold">
                        {solution.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </span>
                    }
                  />
                ))
              : (
                  <div className="col-span-full flex flex-col items-center gap-4 rounded-3xl border border-dashed border-primary/40 bg-white/70 p-12 text-center shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900">No matches yet</h3>
                    <p className="max-w-md text-sm text-gray-600">
                      Adjust your filters or explore all providers to find the best AI partner for your project.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedCategory('All categories')
                          setSelectedTier('all')
                          setSortOption('featured')
                          setPage(1)
                        }}
                      >
                        Reset filters
                      </Button>
                      <Button asChild>
                        <Link href="/contact">Talk to our team</Link>
                      </Button>
                    </div>
                  </div>
                )}
          </div>

          {hasResults && !isLoading ? (
            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={(nextPage) => {
                setPage(nextPage)
                startLoading()
              }}
              className="pt-6"
            />
          ) : null}
        </div>
      </section>
    </div>
  )
}