'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useProductReviews } from '@amboras-dev/reviews'
import { Loader2, MessageSquare, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import StarRating from './StarRating'

export interface ReviewsWidgetProps {
  productId: string
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
      <section className="border-t border-white/10 py-section">
        <div className="container-custom flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-red-400" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="border-t border-white/10 py-section">
        <div className="container-custom">
          <div className="card-aura p-6 text-center max-w-md mx-auto">
            <p className="text-white/60">Couldn&apos;t load reviews.</p>
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
      <section className="relative border-t border-white/10 py-section overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] red-glow opacity-30 pointer-events-none" />
        <div className="container-custom relative">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Reviews</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white tracking-tight">
              All Reviews
            </h2>
          </div>
          <div className="card-aura p-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <MessageSquare className="h-5 w-5 text-red-400" strokeWidth={1.5} />
            </div>
            <p className="text-lg text-white">No reviews yet</p>
            <p className="mt-2 text-sm text-white/50">
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
      className="relative border-t border-white/10 py-section overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] red-glow opacity-20 pointer-events-none" />

      <div className="container-custom relative">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Reviews</p>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight">
            All Reviews
          </h2>
        </div>

        {/* Stats summary */}
        <div className="card-aura p-6 lg:p-8 mb-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12">
            {/* Average */}
            <div className="flex flex-col items-center md:items-start">
              <div className="text-6xl font-heading font-bold text-white leading-none">
                {stats.averageRating.toFixed(1)}
              </div>
              <StarRating rating={stats.averageRating} size="lg" className="mt-3" />
              <p className="text-xs text-white/50 mt-2">
                Based on {stats.totalCount} review{stats.totalCount !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Distribution */}
            <div className="space-y-2.5 max-w-md w-full self-center">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.distribution[stars] ?? 0
                const pct = (count / maxBarCount) * 100
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-8 text-white/60">{stars} ★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-white/50 tabular-nums">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Review list */}
        <div className="grid gap-4 max-w-3xl mx-auto">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="card-aura p-6 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <StarRating rating={review.rating} size="md" />
                  {review.title && (
                    <h3 className="font-medium text-base text-white mt-2 leading-tight">
                      {review.title}
                    </h3>
                  )}
                </div>
                <time className="text-xs text-white/40 flex-shrink-0">
                  {formatDate(review.created_at)}
                </time>
              </div>

              {review.content && (
                <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
                  {review.content}
                </p>
              )}

              {review.media && review.media.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {review.media.map((m, i) =>
                    m.type === 'image' ? (
                      <div
                        key={i}
                        className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/10"
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
                        className="h-20 w-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <ImageIcon className="h-5 w-5 text-white/60" strokeWidth={1.5} />
                      </a>
                    ),
                  )}
                </div>
              )}

              {review.reply && (
                <div className="mt-5 ml-4 pl-4 border-l-2 border-red-500/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 uppercase tracking-wider">
                      Store
                    </span>
                    {review.reply_at && (
                      <span className="text-xs text-white/40">
                        {formatDate(review.reply_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
                    {review.reply}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-12 max-w-3xl mx-auto">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-pill !text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="text-sm text-white/50">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-pill !text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
