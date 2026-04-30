'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Package, Star, Play, Camera, BadgeCheck } from 'lucide-react'
import { useProductReviews } from '@amboras-dev/reviews'

export interface CustomerReviewsGridProps {
  productId: string
  productTitle: string
  productThumbnail?: string | null
  priceAmount?: number | null
  compareAtAmount?: number | null
  currencyCode?: string | null
}

function formatMoney(amountInCents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountInCents / 100)
  } catch {
    return `${(amountInCents / 100).toFixed(2)} ${currency.toUpperCase()}`
  }
}

function formatPurchaseDate(iso: string): string {
  try {
    const d = new Date(iso)
    return `Bought in ${d.toLocaleDateString('en-US', { month: 'long' })}`
  } catch {
    return ''
  }
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'V'
}

interface ReviewMediaItem {
  url: string
  type: 'image' | 'video'
}

interface ReviewCardData {
  id: string
  rating: number
  content: string | null
  title: string | null
  customerName: string
  createdAt: string
  media: ReviewMediaItem[]
}

function ReviewCard({
  review,
  productTitle,
  priceAmount,
  compareAtAmount,
  currencyCode,
  productThumbnail,
}: {
  review: ReviewCardData
  productTitle: string
  priceAmount?: number | null
  compareAtAmount?: number | null
  currencyCode?: string | null
  productThumbnail?: string | null
}) {
  const customerPhotos = review.media.filter((m) => m.type === 'image')
  const customerVideo = review.media.find((m) => m.type === 'video')
  const hasCustomerMedia = customerPhotos.length > 0 || !!customerVideo

  const heroImage =
    customerPhotos[0]?.url ||
    (customerVideo ? null : productThumbnail) ||
    productThumbnail ||
    null

  const showPriceRow =
    typeof priceAmount === 'number' &&
    typeof compareAtAmount === 'number' &&
    compareAtAmount > priceAmount &&
    !!currencyCode

  return (
    <article className="card-aura overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-glow-red transition-all duration-500">
      {/* Hero media */}
      <div className="relative aspect-[4/3] bg-white/[0.02] overflow-hidden">
        {customerVideo ? (
          <video
            src={customerVideo.url}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
            poster={customerPhotos[0]?.url || productThumbnail || undefined}
          />
        ) : heroImage ? (
          <Image
            src={heroImage}
            alt={review.title || `Review by ${review.customerName}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
            className="object-cover"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <Package className="h-12 w-12" strokeWidth={1.5} />
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {customerVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-14 w-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Play className="h-5 w-5 text-white" fill="white" />
            </div>
          </div>
        )}

        {hasCustomerMedia && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-wider text-white">
            <Camera className="h-3 w-3" strokeWidth={2} />
            Customer photo
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((s) => {
            const filled = s <= Math.round(review.rating)
            return (
              <Star
                key={s}
                className="h-4 w-4"
                style={{
                  color: filled ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  fill: filled ? '#ef4444' : 'transparent',
                }}
                strokeWidth={2}
              />
            )
          })}
        </div>

        {/* Reviewer name + verified */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <h3 className="font-medium text-white text-sm">
            {review.customerName}
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] text-red-400">
            <BadgeCheck className="h-3 w-3" strokeWidth={2} />
            Verified
          </span>
        </div>

        {review.title && (
          <h4 className="font-semibold text-white text-base mb-2 leading-tight">
            &ldquo;{review.title}&rdquo;
          </h4>
        )}

        {review.content && (
          <p className="text-sm text-white/60 leading-relaxed flex-1">
            {review.content}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 h-9 w-9 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center font-medium text-white text-sm"
              aria-hidden
            >
              {getInitial(review.customerName)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{productTitle}</p>
              {showPriceRow ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/30 line-through">
                    {formatMoney(compareAtAmount, currencyCode)}
                  </span>
                  <span className="text-red-400 font-medium">
                    {formatMoney(priceAmount, currencyCode)}
                  </span>
                </div>
              ) : typeof priceAmount === 'number' && currencyCode ? (
                <p className="text-xs text-red-400">
                  {formatMoney(priceAmount, currencyCode)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-white/40">
            <Package className="h-3 w-3" strokeWidth={1.5} />
            <span>{formatPurchaseDate(review.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function CustomerReviewsGrid({
  productId,
  productTitle,
  productThumbnail,
  priceAmount,
  compareAtAmount,
  currencyCode,
}: CustomerReviewsGridProps) {
  const { data, isLoading } = useProductReviews(productId, { page: 1, perPage: 3 })

  const reviews = data?.reviews ?? []
  const stats = data?.stats ?? { averageRating: 0, totalCount: 0, distribution: {} }
  const totalCount = data?.count ?? 0

  const cards = useMemo<ReviewCardData[]>(() => {
    const sorted = [...reviews].sort((a, b) => {
      const aHas = (a.media?.length ?? 0) > 0 ? 1 : 0
      const bHas = (b.media?.length ?? 0) > 0 ? 1 : 0
      return bHas - aHas
    })
    return sorted.map((r) => {
      const rawName =
        (r as { customer_name?: string | null }).customer_name?.trim() || ''
      const media: ReviewMediaItem[] = (r.media || []).map((m) => ({
        url: m.url,
        type: m.type === 'video' ? 'video' : 'image',
      }))
      return {
        id: r.id,
        rating: r.rating,
        content: r.content ?? null,
        title: r.title ?? null,
        customerName: rawName || 'Verified Customer',
        createdAt: r.created_at,
        media,
      }
    })
  }, [reviews])

  if (isLoading) {
    return (
      <section className="relative py-section border-t border-white/10">
        <div className="container-custom">
          <div className="h-10 bg-white/5 rounded-full animate-pulse max-w-md mx-auto" />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-aura h-[480px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (totalCount === 0) {
    return null
  }

  const avg =
    stats.averageRating && stats.averageRating > 0
      ? stats.averageRating
      : cards.reduce((sum, c) => sum + c.rating, 0) / Math.max(1, cards.length)

  const formattedTotal = totalCount.toLocaleString('en-US')

  return (
    <section className="relative py-section border-t border-white/10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[80%] red-glow opacity-25 pointer-events-none" />

      <div className="container-custom relative max-w-6xl">
        {/* Stats banner */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Testimonials</p>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            What customers are saying.
          </h2>
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white/80">
            <Star className="h-4 w-4 text-red-400" fill="#ef4444" strokeWidth={0} />
            <span>
              {avg.toFixed(1)} · {formattedTotal} review{totalCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              productTitle={productTitle}
              priceAmount={priceAmount}
              compareAtAmount={compareAtAmount}
              currencyCode={currencyCode}
              productThumbnail={productThumbnail}
            />
          ))}
        </div>

        {totalCount > cards.length && (
          <div className="mt-12 text-center">
            <a href="#all-reviews" className="btn-pill inline-flex">
              See all {formattedTotal} reviews
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
