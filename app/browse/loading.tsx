import { PageHero } from '@/components/shared/PageHero'
import { Skeleton } from '@/components/ui/skeleton'

export default function BrowseLoading() {
  return (
    <div className="space-y-12 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Marketplace"
          title="Loading solutions"
          description="Fetching the latest AI providers and agents for you."
          align="center"
        />
      </div>
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm">
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
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}