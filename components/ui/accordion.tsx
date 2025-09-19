import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)
Accordion.displayName = 'Accordion'

interface AccordionItemProps
  extends Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  heading: React.ReactNode
}

export const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, children, heading, open, ...props }, ref) => (
    <details
      ref={ref}
      className={cn(
        'group overflow-hidden rounded-2xl border border-border/60 bg-card/80 text-card-foreground shadow-sm backdrop-blur transition-colors',
        className
      )}
      open={open}
      {...props}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between px-6 py-5 text-left text-base font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
      >
        <span>{heading}</span>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-border/60 bg-background/60 px-6 py-5 text-sm text-muted-foreground">
        {children}
      </div>
    </details>
  )
)
AccordionItem.displayName = 'AccordionItem'