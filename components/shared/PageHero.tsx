import * as React from 'react'

import { cn } from '@/lib/utils'

interface PageHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
  align?: 'left' | 'center'
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  align = 'left',
  className,
  children,
  ...props
}: PageHeroProps) {
  const alignmentClasses = align === 'center'
    ? 'max-w-3xl items-center text-center'
    : 'max-w-3xl text-left'

  return (
    <div
      className={cn(
        'mx-auto max-w-7xl rounded-3xl border border-white/40 bg-white/80 px-6 py-16 shadow-xl backdrop-blur sm:px-10 sm:py-20',
        className
      )}
      {...props}
    >
      <div className={cn('mx-auto flex flex-col gap-6', alignmentClasses)}>
        {eyebrow ? (
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h1>
        {description ? (
          <p className="text-lg text-gray-600 md:text-xl">{description}</p>
        ) : null}
        {children}
        {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div> : null}
      </div>
    </div>
  )
}