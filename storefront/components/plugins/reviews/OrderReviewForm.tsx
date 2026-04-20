'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  useMyReviews,
  useCreateReview,
  useUpdateReview,
  type MyReview,
} from '@amboras-dev/reviews'
import { Loader2, CheckCircle2, Pencil, Clock, XCircle, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import StarRating from './StarRating'

export interface OrderReviewFormItem {
  id: string
  product_id: string
  product_title: string
  variant_title?: string | null
  thumbnail?: string | null
}

export interface OrderReviewFormProps {
  items: OrderReviewFormItem[]
  orderId: string
  orderFulfillmentStatus?: string
}

const NON_REVIEWABLE_STATUSES = new Set(['not_fulfilled', 'canceled'])

function StatusPill({ status }: { status: MyReview['status'] }) {
  const map = {
    pending: {
      icon: Clock,
      label: 'Pending review',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Published',
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    rejected: {
      icon: XCircle,
      label: 'Not published',
      className: 'bg-red-50 text-red-700 border-red-200',
    },
  }
  const cfg = map[status]
  const Icon = cfg.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.className}`}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

/** Form for a single product — either write new or edit existing */
function ReviewItemForm({
  item,
  orderId,
  existingReview,
  onClose,
  onDiscountCode,
}: {
  item: OrderReviewFormItem
  orderId: string
  existingReview?: MyReview
  onClose: () => void
  onDiscountCode: (code: string) => void
}) {
  const [rating, setRating] = useState<number>(existingReview?.rating ?? 0)
  const [title, setTitle] = useState<string>(existingReview?.title ?? '')
  const [content, setContent] = useState<string>(existingReview?.content ?? '')

  const createMutation = useCreateReview()
  const updateMutation = useUpdateReview()

  const isEditing = !!existingReview
  const isPending = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1) {
      toast.error('Please select a rating')
      return
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          reviewId: existingReview.id,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        })
        toast.success('Review updated — pending re-moderation')
      } else {
        const result = await createMutation.mutateAsync({
          product_id: item.product_id,
          order_id: orderId,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
        })
        toast.success('Review submitted — thank you!')
        if (result.discount_code) {
          onDiscountCode(result.discount_code)
        }
      }
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit review'
      toast.error(message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 border rounded-sm bg-muted/20 space-y-4"
    >
      <div>
        <label className="block text-xs font-medium mb-2">
          Your rating <span className="text-destructive">*</span>
        </label>
        <StarRating rating={rating} size="lg" interactive onRate={setRating} />
      </div>

      <div>
        <label htmlFor={`title-${item.id}`} className="block text-xs font-medium mb-1.5">
          Title (optional)
        </label>
        <input
          id={`title-${item.id}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Sum up your experience"
          className="w-full px-3 py-2 text-sm border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor={`content-${item.id}`} className="block text-xs font-medium mb-1.5">
          Review (optional)
        </label>
        <textarea
          id={`content-${item.id}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="What did you like or dislike? How was the quality?"
          className="w-full px-3 py-2 text-sm border rounded-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {content.length}/2000
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending || rating < 1}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isEditing ? 'Update review' : 'Submit review'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-sm transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

/** One row per order item */
function OrderItemReviewRow({
  item,
  orderId,
  existingReview,
  canReview,
  onDiscountCode,
}: {
  item: OrderReviewFormItem
  orderId: string
  existingReview?: MyReview
  canReview: boolean
  onDiscountCode: (code: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex gap-4">
        {item.thumbnail && (
          <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded-sm overflow-hidden">
            <Image
              src={item.thumbnail}
              alt={item.product_title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{item.product_title}</h4>
          {item.variant_title && item.variant_title !== 'Default' && (
            <p className="text-xs text-muted-foreground mt-0.5">{item.variant_title}</p>
          )}

          {/* Existing review status */}
          {existingReview ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <StarRating rating={existingReview.rating} size="sm" />
                <StatusPill status={existingReview.status} />
              </div>
              {existingReview.title && (
                <p className="text-sm font-medium">{existingReview.title}</p>
              )}
              {existingReview.content && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {existingReview.content}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">
              {canReview
                ? 'Share your thoughts — help other shoppers decide.'
                : 'You can leave a review once this item has been fulfilled.'}
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="flex-shrink-0">
          {canReview && !open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-muted transition"
            >
              {existingReview ? (
                <>
                  <Pencil className="h-3 w-3" />
                  Edit
                </>
              ) : (
                'Write review'
              )}
            </button>
          )}
        </div>
      </div>

      {open && (
        <ReviewItemForm
          item={item}
          orderId={orderId}
          existingReview={existingReview}
          onClose={() => setOpen(false)}
          onDiscountCode={onDiscountCode}
        />
      )}
    </div>
  )
}

export default function OrderReviewForm({
  items,
  orderId,
  orderFulfillmentStatus,
}: OrderReviewFormProps) {
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useMyReviews({ orderIds: [orderId] })

  const reviewsByProduct = new Map<string, MyReview>()
  for (const r of data?.reviews ?? []) {
    if (r.order_id === orderId) {
      reviewsByProduct.set(r.product_id, r)
    }
  }

  const canReviewAnyItem =
    !orderFulfillmentStatus || !NON_REVIEWABLE_STATUSES.has(orderFulfillmentStatus)

  const copyDiscount = async () => {
    if (!discountCode) return
    try {
      await navigator.clipboard.writeText(discountCode)
      setCopied(true)
      toast.success('Discount code copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Copy failed — please select and copy manually')
    }
  }

  // Deduplicate items by product_id — only need one review per product
  const uniqueItems = Array.from(
    new Map(items.map((i) => [i.product_id, i])).values(),
  )

  if (uniqueItems.length === 0) return null

  return (
    <div className="border rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">Reviews</h2>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Discount reward banner */}
      {discountCode && (
        <div className="mb-4 p-4 border border-accent/40 bg-accent/5 rounded-sm">
          <p className="text-sm font-medium mb-1">🎉 Thanks for your review!</p>
          <p className="text-xs text-muted-foreground mb-3">
            Here&apos;s a discount code for your next order:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 text-sm font-mono bg-background border rounded-sm">
              {discountCode}
            </code>
            <button
              type="button"
              onClick={copyDiscount}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-sm hover:bg-muted transition"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!canReviewAnyItem && (
        <p className="text-xs text-muted-foreground mb-2">
          Reviews unlock once your order has been fulfilled.
        </p>
      )}

      <div>
        {uniqueItems.map((item) => (
          <OrderItemReviewRow
            key={item.id}
            item={item}
            orderId={orderId}
            existingReview={reviewsByProduct.get(item.product_id)}
            canReview={canReviewAnyItem}
            onDiscountCode={setDiscountCode}
          />
        ))}
      </div>
    </div>
  )
}
