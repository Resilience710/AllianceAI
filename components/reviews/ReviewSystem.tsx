'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MoreVertical,
  Calendar,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  clientId: string
  clientName: string
  clientAvatar?: string
  providerId: string
  projectTitle: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
  notHelpful: number
  isVerified: boolean
  response?: {
    content: string
    createdAt: Date
  }
}

interface ReviewSystemProps {
  providerId: string
  reviews: Review[]
  canWriteReview?: boolean
  onSubmitReview?: (review: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>) => void
  onHelpfulClick?: (reviewId: string) => void
  onNotHelpfulClick?: (reviewId: string) => void
  onReportReview?: (reviewId: string) => void
}

export function ReviewSystem({
  providerId,
  reviews,
  canWriteReview = false,
  onSubmitReview,
  onHelpfulClick,
  onNotHelpfulClick,
  onReportReview
}: ReviewSystemProps) {
  const [showWriteReview, setShowWriteReview] = React.useState(false)
  const [newReview, setNewReview] = React.useState({
    rating: 0,
    comment: '',
    projectTitle: ''
  })
  const [hoveredRating, setHoveredRating] = React.useState(0)
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingDistribution = React.useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }, [reviews])

  const sortedReviews = React.useMemo(() => {
    return [...reviews].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })
  }, [reviews, sortBy])

  const handleSubmitReview = () => {
    if (newReview.rating > 0 && newReview.comment.trim() && onSubmitReview) {
      onSubmitReview({
        clientId: 'current-user-id', // This would come from auth context
        clientName: 'Current User', // This would come from auth context
        providerId,
        projectTitle: newReview.projectTitle,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        isVerified: true
      })
      setNewReview({ rating: 0, comment: '', projectTitle: '' })
      setShowWriteReview(false)
    }
  }

  const StarRating = ({ rating, size = 'sm', interactive = false, onRatingChange }: {
    rating: number
    size?: 'sm' | 'md' | 'lg'
    interactive?: boolean
    onRatingChange?: (rating: number) => void
  }) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              interactive && 'cursor-pointer',
              star <= (interactive ? hoveredRating || rating : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Reviews & Ratings</CardTitle>
              <CardDescription>
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} from clients
              </CardDescription>
            </div>
            {canWriteReview && (
              <Button onClick={() => setShowWriteReview(true)}>
                Write Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overall Rating */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={Math.round(averageRating)} size="lg" />
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: reviews.length > 0 
                          ? `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Modal */}
      {showWriteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your experience working with this provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-title">Project Title</Label>
              <input
                id="project-title"
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="What project did you work on together?"
                value={newReview.projectTitle}
                onChange={(e) => setNewReview(prev => ({ ...prev, projectTitle: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Rating</Label>
              <div className="mt-2">
                <StarRating
                  rating={newReview.rating}
                  size="lg"
                  interactive
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                placeholder="Tell others about your experience..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={newReview.rating === 0 || !newReview.comment.trim()}
              >
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Reviews</CardTitle>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.clientAvatar} />
                      <AvatarFallback>
                        {review.clientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{review.clientName}</h4>
                          {review.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <StarRating rating={review.rating} />
                        <span>•</span>
                        <span>{formatDistanceToNow(review.createdAt, { addSuffix: true })}</span>
                        <span>•</span>
                        <span>{review.projectTitle}</span>
                      </div>

                      <p className="text-gray-700">{review.comment}</p>

                      {review.response && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Provider Response</span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(review.response.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{review.response.content}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onHelpfulClick?.(review.id)}
                          className="text-gray-500 hover:text-green-600"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNotHelpfulClick?.(review.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Not Helpful ({review.notHelpful})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReportReview?.(review.id)}
                          className="text-gray-500 hover:text-orange-600"
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              This provider hasn't received any reviews yet. Be the first to share your experience!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
