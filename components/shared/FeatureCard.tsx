import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description: string
  accent?: 'primary' | 'secondary' | 'purple' | 'green'
}

const accentVariants: Record<NonNullable<FeatureCardProps['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/20 text-secondary-foreground',
  purple: 'bg-purple-500/10 text-purple-400',
  green: 'bg-emerald-500/10 text-emerald-400',
}

export function FeatureCard({
  icon,
  title,
  description,
  accent = 'primary',
  className,
  children,
  ...props
}: FeatureCardProps) {
  return (
    <Card
      className={cn('h-full border-border/60 bg-card/80 shadow-sm transition-shadow hover:shadow-md', className)}
      {...props}
    >
      <CardHeader className="space-y-4">
        {icon ? (
          <div className={cn('inline-flex h-12 w-12 items-center justify-center rounded-xl', accentVariants[accent])}>
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <CardTitle className="text-lg text-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  )
}