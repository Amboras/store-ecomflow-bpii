'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Package, Star, ChevronDown, Play, Camera } from 'lucide-react'
import { useProductReviews } from '@amboras-dev/reviews'

const ACCENT = '#E91E8C'

export interface CustomerReviewsGridProps {
  productId: string
  productTitle: string
  productThumbnail?: string | null
  /** Current price in cents */
  priceAmount?: number | null
  /** Compare-at price in cents (strikethrough). Hide row when null/undefined. */
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
    return `Purchased on ${d.toLocaleDateString('en-US', { month: 'long' })}`
  } catch {
    return ''
  }
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'V'
}

/**
 * Stable HSL color from a string — used for avatar backgrounds.
 */
function hashColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 65%, 75%)`
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
  /** Customer-uploaded media (photos/videos) on this review */
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

  // Hero image: prefer the customer's first photo, then a video poster
  // placeholder, then the product thumbnail. Always render something.
  const heroImage =
    customerPhotos[0]?.url ||
    (customerVideo ? null : productThumbnail) ||
    productThumbnail ||
    null

  // Extra customer photos beyond the first (rendered as a strip below hero)
  const extraPhotos = customerPhotos.slice(1, 4)

  const showPriceRow =
    typeof priceAmount === 'number' &&
    typeof compareAtAmount === 'number' &&
    compareAtAmount > priceAmount &&
    !!currencyCode

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Hero media area */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <Package className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}

        {/* Video play overlay */}
        {customerVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full bg-black/55 flex items-center justify-center">
              <Play className="h-5 w-5 text-white" fill="white" strokeWidth={0} />
            </div>
          </div>
        )}

        {/* Customer photo badge */}
        {hasCustomerMedia && (
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold shadow-sm"
            style={{ color: ACCENT }}
          >
            <Camera className="h-3 w-3" strokeWidth={2.5} />
            Customer photo
          </span>
        )}
      </div>

      {/* Extra photo strip (only when the customer uploaded multiple) */}
      {extraPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50">
          {extraPhotos.map((photo, idx) => (
            <div key={photo.url} className="relative aspect-square overflow-hidden rounded">
              <Image
                src={photo.url}
                alt={`Customer photo ${idx + 2}`}
                fill
                sizes="120px"
                className="object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>
      )}

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
                  color: filled ? ACCENT : '#E5E7EB',
                  fill: filled ? ACCENT : 'transparent',
                }}
                strokeWidth={1.5}
              />
            )
          })}
        </div>

        {/* Reviewer name + verified buyer badge */}
        <div className="flex items-start gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-base">
            {review.customerName}
          </h3>
          <span
            className="inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded border whitespace-nowrap mt-0.5"
            style={{ color: ACCENT, borderColor: ACCENT }}
          >
            Verified Buyer
            <ChevronDown className="h-3 w-3" strokeWidth={2} />
          </span>
        </div>

        {/* Review body */}
        {review.content && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            {review.content}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ backgroundColor: hashColor(review.customerName) }}
              aria-hidden
            >
              {getInitial(review.customerName)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {productTitle}
              </p>
              {showPriceRow ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 line-through">
                    {formatMoney(compareAtAmount, currencyCode)}
                  </span>
                  <span className="font-bold" style={{ color: ACCENT }}>
                    {formatMoney(priceAmount, currencyCode)}
                  </span>
                </div>
              ) : typeof priceAmount === 'number' && currencyCode ? (
                <p className="text-sm font-bold" style={{ color: ACCENT }}>
                  {formatMoney(priceAmount, currencyCode)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
            <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
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
  // Fetch first page, newest first — limit 3 to fill the grid.
  const { data, isLoading } = useProductReviews(productId, { page: 1, perPage: 3 })

  const reviews = data?.reviews ?? []
  const stats = data?.stats ?? { averageRating: 0, totalCount: 0, distribution: {} }
  const totalCount = data?.count ?? 0

  const cards = useMemo<ReviewCardData[]>(() => {
    // Sort: reviews with photos/videos first, then by recency (preserved order from API).
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
      <section className="bg-gray-50 py-14">
        <div className="container-custom">
          <div className="h-12 rounded-full bg-gray-200 animate-pulse max-w-2xl mx-auto" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm h-[480px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Empty state
  if (totalCount === 0) {
    return (
      <section className="bg-gray-50 py-14">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            <span className="text-gray-900">Customer </span>
            <span style={{ color: ACCENT }}>Reviews</span>
          </h2>
          <p className="mt-4 text-gray-600">
            No reviews yet. Be the first to leave a review.
          </p>
          <a
            href="#write-review"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-medium text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: ACCENT }}
          >
            Write a review
          </a>
        </div>
      </section>
    )
  }

  // Use real stats; fall back to sample average if total stats missing.
  const avg =
    stats.averageRating && stats.averageRating > 0
      ? stats.averageRating
      : cards.reduce((sum, c) => sum + c.rating, 0) / Math.max(1, cards.length)

  const formattedTotal = totalCount.toLocaleString('en-US')

  return (
    <section className="bg-gray-50 py-14">
      <div className="container-custom max-w-6xl">
        {/* Pink stats banner */}
        <div
          className="rounded-2xl py-5 px-6 text-center text-white shadow-sm"
          style={{ backgroundColor: ACCENT }}
        >
          <p className="font-semibold text-base md:text-lg flex items-center justify-center gap-2">
            <Star className="h-5 w-5 fill-white" strokeWidth={0} />
            <span>
              Rated {avg.toFixed(1)}/5 based on {formattedTotal} review
              {totalCount === 1 ? '' : 's'}
            </span>
          </p>
        </div>

        {/* Title */}
        <h2 className="mt-10 mb-8 text-center text-3xl md:text-4xl font-heading font-bold">
          <span className="text-gray-900">Customer </span>
          <span style={{ color: ACCENT }}>Reviews</span>
        </h2>

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

        {/* View all link */}
        {totalCount > cards.length && (
          <div className="mt-10 text-center">
            <a
              href="#all-reviews"
              className="inline-block text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: ACCENT }}
            >
              View all {formattedTotal} reviews →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
