import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string
  author: string
  role: string
  company?: string
  avatarUrl?: string
}

export function Testimonial({
  quote,
  author,
  role,
  company,
  avatarUrl,
  className,
  ...props
}: TestimonialProps) {
  const initials = React.useMemo(() => {
    return author
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }, [author])

  return (
    <Card
      className={cn('h-full border-border/60 bg-card/80 shadow-sm transition-shadow hover:shadow-md', className)}
      {...props}
    >
      <CardContent className="flex h-full flex-col gap-6 p-8">
        <p className="text-lg font-medium text-foreground">"{quote}"</p>
        <div className="flex items-center gap-4">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={author} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold text-foreground">{author}</p>
            <p className="text-sm text-muted-foreground">
              {role}
              {company ? ` - ${company}` : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}