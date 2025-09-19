import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type PaginationValue = number | 'ellipsis'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
  className?: string
  siblingCount?: number
  'aria-label'?: string
}

function createRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getPaginationRange(config: {
  page: number
  pageCount: number
  siblingCount: number
}): PaginationValue[] {
  const { page, pageCount, siblingCount } = config

  const totalPageNumbers = siblingCount * 2 + 5

  if (pageCount <= totalPageNumbers) {
    return createRange(1, pageCount)
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 2)
  const rightSiblingIndex = Math.min(page + siblingCount, pageCount - 1)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < pageCount - 1

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItems = createRange(1, 3 + siblingCount * 2)
    return [...leftItems, 'ellipsis', pageCount]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItems = createRange(pageCount - (3 + siblingCount * 2) + 1, pageCount)
    return [1, 'ellipsis', ...rightItems]
  }

  return [1, 'ellipsis', ...createRange(leftSiblingIndex, rightSiblingIndex), 'ellipsis', pageCount]
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ page, pageCount, onPageChange, className, siblingCount = 1, 'aria-label': ariaLabel = 'Pagination' }, ref) => {
    const range = React.useMemo(
      () => getPaginationRange({ page, pageCount, siblingCount }),
      [page, pageCount, siblingCount]
    )

    const handleChange = (targetPage: number) => {
      if (onPageChange) {
        onPageChange(Math.max(1, Math.min(targetPage, pageCount)))
      }
    }

    return (
      <nav
        ref={ref}
        className={cn('flex items-center justify-center gap-2', className)}
        aria-label={ariaLabel}
      >
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => handleChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-2">
          {range.map((value, index) => {
            if (value === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
                  ...
                </span>
              )
            }

            const isActive = value === page

            return (
              <Button
                key={value}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={cn('h-9 w-9 rounded-full', isActive ? 'shadow-lg' : '')}
                onClick={() => handleChange(value)}
                aria-current={isActive ? 'page' : undefined}
              >
                {value}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => handleChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </nav>
    )
  }
)
Pagination.displayName = 'Pagination'
