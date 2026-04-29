'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  useMyReviews,
  useCreateReview,
  useUpdateReview,
  type MyReview,
} from '@amboras-dev/reviews'
import {
  Loader2,
  CheckCircle2,
  Pencil,
  Clock,
  XCircle,
  Copy,
  Check,
  ImagePlus,
  X,
  Play,
} from 'lucide-react'
import { toast } from 'sonner'
import StarRating from './StarRating'
import {
  uploadReviewMedia,
  validateReviewFile,
  mediaTypeFromMime,
  ALLOWED_MIME_TYPES,
  MAX_REVIEW_MEDIA_FILES,
  type ReviewMediaItem,
} from './media-upload'

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

  // Media that's already uploaded (carried over when editing)
  const [existingMedia, setExistingMedia] = useState<ReviewMediaItem[]>(() => {
    const m = (existingReview as MyReview & { media?: ReviewMediaItem[] } | undefined)
      ?.media
    return Array.isArray(m) ? m : []
  })
  // Newly picked files, not yet uploaded — kept as File for previewing
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createMutation = useCreateReview()
  const updateMutation = useUpdateReview()

  const isEditing = !!existingReview
  const isPending = createMutation.isPending || updateMutation.isPending || isUploading

  const totalMediaCount = existingMedia.length + pendingFiles.length
  const canAddMore = totalMediaCount < MAX_REVIEW_MEDIA_FILES

  const handleFilesPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    // Reset the input so the same file can be re-picked after removal
    e.target.value = ''
    if (picked.length === 0) return

    const remainingSlots = MAX_REVIEW_MEDIA_FILES - totalMediaCount
    if (remainingSlots <= 0) {
      toast.error(`You can attach at most ${MAX_REVIEW_MEDIA_FILES} files`)
      return
    }

    const accepted: File[] = []
    for (const file of picked.slice(0, remainingSlots)) {
      const err = validateReviewFile(file)
      if (err) {
        toast.error(err)
        continue
      }
      accepted.push(file)
    }
    if (accepted.length === 0) return

    if (picked.length > remainingSlots) {
      toast.message(
        `Only the first ${remainingSlots} file${remainingSlots === 1 ? '' : 's'} were added`,
      )
    }

    const previews = accepted.map((f) => URL.createObjectURL(f))
    setPendingFiles((prev) => [...prev, ...accepted])
    setPendingPreviews((prev) => [...prev, ...previews])
  }

  const removeExistingMedia = (idx: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== idx))
  }

  const removePendingFile = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
    setPendingPreviews((prev) => {
      const url = prev[idx]
      if (url) URL.revokeObjectURL(url)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1) {
      toast.error('Please select a rating')
      return
    }

    try {
      // 1. Upload any pending files first → get URLs back
      let uploadedMedia: ReviewMediaItem[] = []
      if (pendingFiles.length > 0) {
        setIsUploading(true)
        try {
          uploadedMedia = await uploadReviewMedia(pendingFiles)
        } finally {
          setIsUploading(false)
        }
      }

      // 2. Build the full media payload — keep existing + add newly uploaded
      const media = [...existingMedia, ...uploadedMedia]

      if (isEditing) {
        await updateMutation.mutateAsync({
          reviewId: existingReview.id,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
          media,
        })
        toast.success('Review updated — pending re-moderation')
      } else {
        const result = await createMutation.mutateAsync({
          product_id: item.product_id,
          order_id: orderId,
          rating,
          title: title.trim() || undefined,
          content: content.trim() || undefined,
          media,
        })
        toast.success('Review submitted — thank you!')
        if (result.discount_code) {
          onDiscountCode(result.discount_code)
        }
      }
      // Clean up object URLs
      pendingPreviews.forEach((u) => URL.revokeObjectURL(u))
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

      {/* Media uploader */}
      <div>
        <label className="block text-xs font-medium mb-1.5">
          Photos &amp; videos (optional)
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Up to {MAX_REVIEW_MEDIA_FILES} files. JPG, PNG, WebP, GIF, MP4, MOV or WebM.
        </p>

        {(existingMedia.length > 0 || pendingPreviews.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {existingMedia.map((m, i) => (
              <div
                key={`existing-${i}`}
                className="relative aspect-square bg-muted rounded-sm overflow-hidden group"
              >
                {m.type === 'video' ? (
                  <>
                    <video
                      src={m.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Play className="h-6 w-6 text-white drop-shadow" fill="white" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={m.url}
                    alt={`Review media ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeExistingMedia(i)}
                  disabled={isPending}
                  aria-label="Remove media"
                  className="absolute top-1 right-1 p-1 rounded-full bg-foreground/80 text-background opacity-0 group-hover:opacity-100 focus:opacity-100 transition disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {pendingPreviews.map((preview, i) => {
              const file = pendingFiles[i]
              const isVideo = file
                ? mediaTypeFromMime(file.type) === 'video'
                : false
              return (
                <div
                  key={`pending-${i}`}
                  className="relative aspect-square bg-muted rounded-sm overflow-hidden group"
                >
                  {isVideo ? (
                    <>
                      <video
                        src={preview}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Play
                          className="h-6 w-6 text-white drop-shadow"
                          fill="white"
                        />
                      </div>
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={`Pending upload ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removePendingFile(i)}
                    disabled={isPending}
                    aria-label="Remove file"
                    className="absolute top-1 right-1 p-1 rounded-full bg-foreground/80 text-background opacity-0 group-hover:opacity-100 focus:opacity-100 transition disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_MIME_TYPES.join(',')}
          onChange={handleFilesPicked}
          disabled={!canAddMore || isPending}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAddMore || isPending}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Add photos or video
          <span className="text-muted-foreground">
            ({totalMediaCount}/{MAX_REVIEW_MEDIA_FILES})
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending || rating < 1}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-background rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isUploading
            ? 'Uploading…'
            : isEditing
              ? 'Update review'
              : 'Submit review'}
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
