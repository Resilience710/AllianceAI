import * as React from 'react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SolutionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  description: string
  tags: string[]
  rating: number
  reviews: number
  price?: string
  href?: string
  ctaLabel?: string
  logo?: React.ReactNode
}

export function SolutionCard({
  name,
  description,
  tags,
  rating,
  reviews,
  price,
  href,
  ctaLabel = 'View Solution',
  logo,
  className,
  ...props
}: SolutionCardProps) {
  return (
    <Card className={cn('flex h-full flex-col border-border/60 bg-card/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg', className)} {...props}>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {logo ?? <span className="text-lg font-semibold">AI</span>}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">{name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center justify-end gap-1 text-foreground">
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">/ 5</span>
            </div>
            <span className="text-muted-foreground">{reviews} reviews</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6 pt-0">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-muted/50 text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          {price ? (
            <span className="text-sm font-semibold text-primary">{price}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Custom pricing</span>
          )}
          {href ? (
            <Button asChild size="sm">
              <Link href={href}>{ctaLabel}</Link>
            </Button>
          ) : (
            <Button size="sm">{ctaLabel}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}