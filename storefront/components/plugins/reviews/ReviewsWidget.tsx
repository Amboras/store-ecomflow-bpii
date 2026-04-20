'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useProductReviews } from '@amboras-dev/reviews'
import { Loader2, MessageSquare, ImageIcon } from 'lucide-react'
import StarRating from './StarRating'

export interface ReviewsWidgetProps {
  productId: string
  /** How many reviews per page (default 5) */
  perPage?: number
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function ReviewsWidget({ productId, perPage = 5 }: ReviewsWidgetProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useProductReviews(productId, { page, perPage })

  if (isLoading) {
    return (
      <section className="border-t py-12">
        <div className="container-custom flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="border-t py-12">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground text-center">
            Unable to load reviews right now.
          </p>
        </div>
      </section>
    )
  }

  const reviews = data?.reviews ?? []
  const stats = data?.stats ?? { averageRating: 0, totalCount: 0, distribution: {} }
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  // Empty state
  if (totalCount === 0) {
    return (
      <section className="border-t py-12">
        <div className="container-custom">
          <h2 className="text-h3 font-heading font-semibold mb-6">Customer Reviews</h2>
          <div className="border border-dashed rounded-sm p-12 text-center">
            <MessageSquare
              className="h-8 w-8 mx-auto text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              No reviews yet. Be the first to share your thoughts!
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Verified customers can leave a review from their order page.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const maxBarCount = Math.max(
    ...[1, 2, 3, 4, 5].map((s) => stats.distribution[s] ?? 0),
    1,
  )

  return (
    <section className="border-t py-12">
      <div className="container-custom">
        <h2 className="text-h3 font-heading font-semibold mb-8">Customer Reviews</h2>

        {/* Stats summary */}
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 pb-10 border-b">
          {/* Average */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-5xl font-heading font-semibold">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={stats.averageRating} size="md" className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on {stats.totalCount} review{stats.totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Distribution */}
          <div className="space-y-1.5 max-w-md w-full">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars] ?? 0
              const pct = (count / maxBarCount) * 100
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-8 text-muted-foreground">{stars} ★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground tabular-nums">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Review list */}
        <div className="divide-y">
          {reviews.map((review) => (
            <article key={review.id} className="py-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <StarRating rating={review.rating} size="sm" />
                  {review.title && (
                    <h3 className="font-medium text-sm mt-2">{review.title}</h3>
                  )}
                </div>
                <time className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDate(review.created_at)}
                </time>
              </div>

              {review.content && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {review.content}
                </p>
              )}

              {/* Media */}
              {review.media && review.media.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {review.media.map((m, idx) =>
                    m.type === 'image' ? (
                      <div
                        key={idx}
                        className="relative h-20 w-20 bg-muted rounded-sm overflow-hidden"
                      >
                        <Image
                          src={m.url}
                          alt={`Review image ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <a
                        key={idx}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-20 w-20 bg-muted rounded-sm flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </a>
                    ),
                  )}
                </div>
              )}

              {/* Merchant reply */}
              {review.reply && (
                <div className="mt-4 pl-4 border-l-2 border-accent/40 bg-muted/30 rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Store response</span>
                    {review.reply_at && (
                      <span className="text-xs text-muted-foreground">
                        · {formatDate(review.reply_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {review.reply}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm font-medium hover:underline disabled:opacity-40 disabled:no-underline"
            >
              ← Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm font-medium hover:underline disabled:opacity-40 disabled:no-underline"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
