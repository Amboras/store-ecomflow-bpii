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
      <section className="border-t-[4px] border-comic-ink bg-comic-cream py-16">
        <div className="container-custom flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-comic-pink" strokeWidth={2.5} />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="border-t-[4px] border-comic-ink bg-comic-cream py-16">
        <div className="container-custom">
          <div className="card-comic bg-white p-6 text-center max-w-md mx-auto">
            <p className="font-heading uppercase tracking-wide text-comic-ink">
              Oof! Couldn&apos;t load reviews.
            </p>
          </div>
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
      <section className="border-t-[4px] border-comic-ink bg-comic-cream py-16 halftone-yellow">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="inline-block bg-comic-ink text-comic-yellow font-heading uppercase tracking-wide text-h3 px-6 py-3 border-[4px] border-comic-ink shadow-comic -rotate-1">
              All Reviews
            </h2>
          </div>
          <div className="card-comic bg-white p-10 text-center max-w-2xl mx-auto">
            <div className="inline-block bg-comic-pink border-[3px] border-comic-ink p-3 mb-4 shadow-comic-sm">
              <MessageSquare className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <p className="font-heading uppercase tracking-wide text-lg text-comic-ink">
              No reviews yet — be the first hero!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
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
    <section
      id="all-reviews"
      className="border-t-[4px] border-comic-ink bg-comic-cream py-16 halftone-yellow"
    >
      <div className="container-custom">
        {/* Title — comic banner */}
        <div className="text-center mb-10">
          <h2 className="inline-block bg-comic-ink text-comic-yellow font-heading uppercase tracking-wide text-h3 px-6 py-3 border-[4px] border-comic-ink shadow-comic -rotate-1">
            All Reviews
          </h2>
        </div>

        {/* Stats summary — comic panel */}
        <div className="card-comic bg-white p-6 lg:p-8 mb-10">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12">
            {/* Average — big bold number in a burst */}
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-comic-yellow border-[4px] border-comic-ink shadow-comic px-6 py-3">
                <div className="text-5xl font-heading text-comic-ink leading-none">
                  {stats.averageRating.toFixed(1)}
                </div>
              </div>
              <StarRating rating={stats.averageRating} size="lg" className="mt-3" />
              <p className="text-xs font-heading uppercase tracking-wide text-comic-ink mt-2">
                {stats.totalCount} review{stats.totalCount !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Distribution */}
            <div className="space-y-2 max-w-md w-full self-center">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.distribution[stars] ?? 0
                const pct = (count / maxBarCount) * 100
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-10 font-heading uppercase tracking-wide text-comic-ink">
                      {stars} ★
                    </span>
                    <div className="flex-1 h-4 bg-comic-cream border-[2px] border-comic-ink overflow-hidden">
                      <div
                        className="h-full bg-comic-pink transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-heading text-comic-ink tabular-nums">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Review list — each as its own comic panel */}
        <div className="grid gap-5 max-w-3xl mx-auto">
          {reviews.map((review, idx) => {
            // Alternate background colors for visual interest
            const bgClass =
              idx % 3 === 0
                ? 'bg-white'
                : idx % 3 === 1
                  ? 'bg-comic-yellow'
                  : 'bg-comic-blue'

            return (
              <article
                key={review.id}
                className={`${bgClass} border-[3px] border-comic-ink shadow-comic p-5 hover:-translate-y-0.5 hover:shadow-comic-lg transition-all duration-150`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <StarRating rating={review.rating} size="md" />
                    {review.title && (
                      <h3 className="font-heading uppercase tracking-wide text-lg text-comic-ink mt-2 leading-tight">
                        {review.title}
                      </h3>
                    )}
                  </div>
                  <time className="text-xs font-heading uppercase tracking-wide text-comic-ink/70 flex-shrink-0">
                    {formatDate(review.created_at)}
                  </time>
                </div>

                {review.content && (
                  <p className="text-sm text-comic-ink whitespace-pre-line leading-relaxed">
                    {review.content}
                  </p>
                )}

                {/* Media */}
                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {review.media.map((m, i) =>
                      m.type === 'image' ? (
                        <div
                          key={i}
                          className="relative h-20 w-20 border-[3px] border-comic-ink overflow-hidden shadow-comic-sm"
                        >
                          <Image
                            src={m.url}
                            alt={`Review image ${i + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <a
                          key={i}
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-20 w-20 bg-comic-ink text-comic-yellow border-[3px] border-comic-ink flex items-center justify-center hover:-translate-y-0.5 transition-transform shadow-comic-sm"
                        >
                          <ImageIcon className="h-6 w-6" strokeWidth={2.5} />
                        </a>
                      ),
                    )}
                  </div>
                )}

                {/* Merchant reply — speech bubble style */}
                {review.reply && (
                  <div className="mt-4 ml-4 bg-white border-[3px] border-comic-ink p-4 relative shadow-comic-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-comic-pink text-white font-heading uppercase tracking-wide text-[10px] px-2 py-0.5 border-[2px] border-comic-ink">
                        Store reply
                      </span>
                      {review.reply_at && (
                        <span className="text-xs text-comic-ink/70 font-heading uppercase tracking-wide">
                          {formatDate(review.reply_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-comic-ink whitespace-pre-line leading-relaxed">
                      {review.reply}
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Pagination — comic buttons */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-10 max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-comic-blue !py-2 !px-4 !text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
            >
              ← Prev
            </button>
            <span className="font-heading uppercase tracking-wide text-sm text-comic-ink">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-comic-pink !py-2 !px-4 !text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
