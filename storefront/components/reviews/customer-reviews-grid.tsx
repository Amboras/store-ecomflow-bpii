'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Package, Star, Play, Camera, Zap } from 'lucide-react'
import { useProductReviews } from '@amboras-dev/reviews'

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
    return `Bought in ${d.toLocaleDateString('en-US', { month: 'long' })}`
  } catch {
    return ''
  }
}

function getInitial(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'V'
}

const COMIC_AVATAR_COLORS = ['#FFE600', '#FF3EA5', '#2EC4F1', '#7CFF6B', '#FF2E2E']

function pickAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COMIC_AVATAR_COLORS[Math.abs(hash) % COMIC_AVATAR_COLORS.length]
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

const CARD_BG = ['bg-white', 'bg-comic-yellow', 'bg-comic-blue']
const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-[0.5deg]']

function ReviewCard({
  review,
  productTitle,
  priceAmount,
  compareAtAmount,
  currencyCode,
  productThumbnail,
  index,
}: {
  review: ReviewCardData
  productTitle: string
  priceAmount?: number | null
  compareAtAmount?: number | null
  currencyCode?: string | null
  productThumbnail?: string | null
  index: number
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

  const bg = CARD_BG[index % CARD_BG.length]
  const rotation = ROTATIONS[index % ROTATIONS.length]
  const avatarColor = pickAvatarColor(review.customerName)

  return (
    <article
      className={`${bg} border-[3px] border-comic-ink shadow-comic ${rotation} flex flex-col overflow-hidden hover:rotate-0 hover:-translate-y-1 hover:shadow-comic-lg transition-all duration-200`}
    >
      {/* Hero media area */}
      <div className="relative aspect-[4/3] bg-comic-cream overflow-hidden border-b-[3px] border-comic-ink">
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
          <div className="absolute inset-0 flex items-center justify-center text-comic-ink/30">
            <Package className="h-12 w-12" strokeWidth={2.5} />
          </div>
        )}

        {/* Video play overlay */}
        {customerVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-14 w-14 bg-comic-ink border-[3px] border-comic-ink shadow-comic flex items-center justify-center">
              <Play className="h-6 w-6 text-comic-yellow" fill="#FFE600" strokeWidth={0} />
            </div>
          </div>
        )}

        {/* Customer photo badge */}
        {hasCustomerMedia && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-comic-pink text-white font-heading uppercase tracking-wide text-[10px] px-2 py-1 border-[2px] border-comic-ink shadow-comic-sm">
            <Camera className="h-3 w-3" strokeWidth={2.5} />
            Real Photo!
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
                className="h-5 w-5"
                style={{
                  color: filled ? '#0A0A0A' : '#0A0A0A',
                  fill: filled ? '#FFE600' : 'transparent',
                }}
                strokeWidth={2.5}
              />
            )
          })}
        </div>

        {/* Reviewer name + verified buyer badge */}
        <div className="flex items-start gap-2 mb-3 flex-wrap">
          <h3 className="font-heading uppercase tracking-wide text-comic-ink text-base">
            {review.customerName}
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-heading uppercase tracking-wide bg-comic-ink text-comic-yellow px-2 py-0.5 border-[2px] border-comic-ink whitespace-nowrap">
            <Zap className="h-3 w-3" strokeWidth={3} fill="#FFE600" />
            Verified
          </span>
        </div>

        {/* Review title */}
        {review.title && (
          <h4 className="font-heading uppercase tracking-wide text-comic-ink text-sm mb-2 leading-tight">
            &ldquo;{review.title}&rdquo;
          </h4>
        )}

        {/* Review body */}
        {review.content && (
          <p className="text-sm text-comic-ink leading-relaxed flex-1">
            {review.content}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t-[3px] border-comic-ink border-dashed">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex-shrink-0 h-10 w-10 border-[3px] border-comic-ink flex items-center justify-center font-heading text-comic-ink text-base shadow-comic-sm"
              style={{ backgroundColor: avatarColor }}
              aria-hidden
            >
              {getInitial(review.customerName)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading uppercase tracking-wide text-comic-ink truncate">
                {productTitle}
              </p>
              {showPriceRow ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-comic-ink/50 line-through font-heading">
                    {formatMoney(compareAtAmount, currencyCode)}
                  </span>
                  <span className="font-heading text-comic-pink">
                    {formatMoney(priceAmount, currencyCode)}
                  </span>
                </div>
              ) : typeof priceAmount === 'number' && currencyCode ? (
                <p className="text-sm font-heading text-comic-pink">
                  {formatMoney(priceAmount, currencyCode)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-heading uppercase tracking-wide text-comic-ink/70">
            <Package className="h-3.5 w-3.5" strokeWidth={2.5} />
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
        customerName: rawName || 'Verified Hero',
        createdAt: r.created_at,
        media,
      }
    })
  }, [reviews])

  if (isLoading) {
    return (
      <section className="bg-comic-pink border-y-[4px] border-comic-ink py-14 halftone-pink">
        <div className="container-custom">
          <div className="h-14 bg-white/40 border-[3px] border-comic-ink animate-pulse max-w-2xl mx-auto" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="card-comic bg-white h-[480px] animate-pulse"
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
      <section className="bg-comic-pink border-y-[4px] border-comic-ink py-14 halftone-pink">
        <div className="container-custom max-w-3xl text-center">
          <div className="inline-block bg-comic-yellow border-[4px] border-comic-ink shadow-comic px-6 py-3 -rotate-1 mb-6">
            <h2 className="text-h3 font-heading uppercase tracking-wide text-comic-ink">
              ★ Be the first reviewer ★
            </h2>
          </div>
          <div className="card-comic bg-white p-8 max-w-xl mx-auto">
            <p className="font-heading uppercase tracking-wide text-comic-ink">
              No reviews yet — your story could be the first!
            </p>
          </div>
        </div>
      </section>
    )
  }

  const avg =
    stats.averageRating && stats.averageRating > 0
      ? stats.averageRating
      : cards.reduce((sum, c) => sum + c.rating, 0) / Math.max(1, cards.length)

  const formattedTotal = totalCount.toLocaleString('en-US')

  return (
    <section className="bg-comic-pink border-y-[4px] border-comic-ink py-14 halftone-pink">
      <div className="container-custom max-w-6xl">
        {/* Stats banner — comic ribbon */}
        <div className="text-center mb-6">
          <div className="inline-block bg-comic-yellow border-[4px] border-comic-ink shadow-comic px-6 py-3 -rotate-1">
            <p className="font-heading uppercase tracking-wide text-base md:text-lg text-comic-ink flex items-center justify-center gap-2">
              <Star className="h-5 w-5" fill="#0A0A0A" strokeWidth={0} />
              <span>
                {avg.toFixed(1)}/5 ★ {formattedTotal} review
                {totalCount === 1 ? '' : 's'}
              </span>
              <Star className="h-5 w-5" fill="#0A0A0A" strokeWidth={0} />
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-6 mb-10 text-center text-h2 font-heading uppercase tracking-wide text-white"
            style={{ textShadow: '4px 4px 0 #0A0A0A' }}>
          What Heroes Are Saying!
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {cards.map((review, idx) => (
            <ReviewCard
              key={review.id}
              review={review}
              productTitle={productTitle}
              priceAmount={priceAmount}
              compareAtAmount={compareAtAmount}
              currencyCode={currencyCode}
              productThumbnail={productThumbnail}
              index={idx}
            />
          ))}
        </div>

        {/* View all link */}
        {totalCount > cards.length && (
          <div className="mt-12 text-center">
            <a
              href="#all-reviews"
              className="btn-comic-black !text-sm"
            >
              See all {formattedTotal} reviews →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
