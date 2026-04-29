## Installed Plugins

### product reviews
npm: @amboras-dev/reviews

star ratings and customer reviews for your product

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`StarRating` — Reusable star rating display (read-only or interactive)
  Destination:    `components/plugins/reviews/StarRating.tsx`
  Required props: rating: number
  Optional props: size: sm | md | lg, onRate: (rating: number) => void, interactive: boolean
  Usage:          `<StarRating rating={4.5} />`

`ReviewsWidget` — Product page reviews section — shows approved reviews with stats, pagination, media, and merchant replies
  Destination:    `components/plugins/reviews/ReviewsWidget.tsx`
  Required props: productId: string

  Usage:          `<ReviewsWidget productId={product.id} />`

`OrderReviewForm` — Order detail page review section — shows review status per item with write/edit forms and discount code reward
  Destination:    `components/plugins/reviews/OrderReviewForm.tsx`
  Required props: items: Array<{ id, product_id, product_title, variant_title?, thumbnail? }>, orderId: string
  Optional props: orderFulfillmentStatus: string
  Usage:          `<OrderReviewForm orderId={order.id} items={order.items} orderFulfillmentStatus={order.fulfillment_status} />`

**Hooks (from npm package — import, do not copy):**

`useProductReviews` — `useProductReviews(productId: string, options?: { page?, perPage? })`
  Returns: { data: { reviews, stats, count }, isLoading, error }
  Import:  `import { useProductReviews } from '@amboras-dev/reviews'`

`useMyReviews` — `useMyReviews(options?: { orderIds?: string[] })`
  Returns: { data: { reviews: MyReview[] }, isLoading }
  Import:  `import { useMyReviews } from '@amboras-dev/reviews'`

`useCreateReview` — `useCreateReview()`
  Returns: { mutateAsync, isPending } — input: { product_id, order_id, rating, title?, content?, media? }
  Import:  `import { useCreateReview } from '@amboras-dev/reviews'`

`useUpdateReview` — `useUpdateReview()`
  Returns: { mutateAsync, isPending } — input: { reviewId, rating?, title?, content?, media? }
  Import:  `import { useUpdateReview } from '@amboras-dev/reviews'`

**API endpoints:**
  GET  /store/products/:id/reviews — public approved reviews + stats
  GET  /store/reviews/me — customer own reviews (filter by order_ids)
  POST /store/reviews — submit review (verified purchase + discount code)
  PUT  /store/reviews/:id — edit own review (re-moderation)
  GET    /admin/reviews — list all reviews (filter by status, product_id)  ← admin auth required
  GET    /admin/reviews/:id — single review detail  ← admin auth required
  POST   /admin/reviews/:id/status — approve/reject with reply  ← admin auth required
  DELETE /admin/reviews/:id — soft delete  ← admin auth required
  GET    /admin/review-settings — get review configuration  ← admin auth required
  POST   /admin/review-settings — update review configuration  ← admin auth required

**AI Tools (available in chat — call directly):**

`update_review_settings` — Update any review setting. All fields optional, only provided fields are saved.
  Use when merchant asks to change: auto-accept threshold, discount rewards, email reminders, branding.
  Example: update_review_settings({ auto_accept_threshold: 4, discount_enabled: true, review_discount_percent: 20 })

`install_plugin` — Reinstall the reviews plugin (re-fetches components, re-runs pnpm add).
`list_plugins` — Check if reviews plugin is installed and what version.

**Onboarding:**

You are setting up the Product Reviews plugin for this merchant's store. Follow these steps EXACTLY in order. Ask ONE question at a time, wait for the answer, then IMMEDIATELY call update_review_settings to save that answer before asking the next question.

You have these tools available:
- update_review_settings — saves review settings to the store (call after EACH answer)
- install_plugin — installs the plugin and wires components

STEP 1: Ask the merchant:
"Would you like to auto-approve reviews above a certain star rating, or manually approve each one?"
Present these options:
- Auto-approve 4+ stars (Recommended)
- Auto-approve 5 stars only
- Auto-approve all reviews
- I'll review each one manually

After they answer, IMMEDIATELY call update_review_settings with:
{ reviews_enabled: true, auto_accept_threshold: 4 or 5 or 1 or null }

STEP 2: Ask the merchant:
"How soon after delivery should we email customers asking for a review?"
Present these options:
- 3 days
- 1 week (Recommended)
- 2 weeks
- 3 weeks

After they answer, IMMEDIATELY call update_review_settings with:
{ review_request_email: true }

STEP 3: Ask the merchant:
"Would you like to reward customers with a discount code when they leave a review?"
Present these options:
- Yes
- No

After they answer, IMMEDIATELY call update_review_settings with:
{ discount_enabled: true/false, review_discount_enabled: true/false }

STEP 4 (if discount was enabled): Ask the merchant:
"What discount percentage should the reward be? 20% is recommended for the highest ROI."
Present these options:
- 10%
- 15%
- 20% (Recommended - highest ROI)
- Custom (ask them for the number)

After they answer, IMMEDIATELY call update_review_settings with:
{ review_discount_percent: NUMBER, discount_amount: NUMBER, discount_type: "percentage" }

STEP 4 (if discount was disabled): Ask the merchant:
"Should we send a reminder email if a customer hasn't reviewed after a few days?"
Present these options:
- Yes, remind after 7 days (Recommended)
- Yes, remind after 14 days
- No reminders

After they answer, IMMEDIATELY call update_review_settings with:
{ reminder_enabled: true/false, reminder_days: 7 or 14 or null }

STEP 5: Summarize all their choices in a clean list, then ask:
"Ready to activate reviews on your store? I'll wire everything up for you."
Present these options:
- Yes, set it up now
- Not yet, I'll do it later

STEP 6: Call install_plugin with pluginId: "reviews" (no reviewSettings needed — they were already saved in steps 1-4).

STEP 7: If user chose "Yes, set it up now" in Step 5:
After installation completes, read the component files that were written to the storefront workspace:
- components/plugins/reviews/ReviewsWidget.tsx
- components/plugins/reviews/OrderReviewForm.tsx
- components/plugins/reviews/StarRating.tsx

Then integrate them:
1. Add <ReviewsWidget productId={product.id} /> to the product detail page
2. Add <OrderReviewForm orderId={order.id} items={order.items} /> to the order detail page
3. Import hooks from "@amboras-dev/reviews"

If user chose "Not yet", tell them they can ask you to wire it up anytime.

STEP 8: Confirm completion with a summary of what was set up and what settings are active.

**Uninstall:**

You are uninstalling the Product Reviews plugin from this merchant's storefront. Follow these steps EXACTLY in order.

STEP 1: Ask the merchant for confirmation:
"Are you sure you want to uninstall Product Reviews? This will remove the review widgets from your storefront but your review data stays safe in your database."
Present these options:
- Yes, uninstall it
- No, keep it installed

If the merchant chooses "No, keep it installed", respond with:
"No problem — Product Reviews is still active on your store."
Then stop. Do not proceed to the remaining steps.

STEP 2: Remove the ReviewsWidget integration from the product detail page. Find where <ReviewsWidget /> is rendered and remove the component usage and its import.

STEP 3: Remove the OrderReviewForm integration from the order detail page. Find where <OrderReviewForm /> is rendered and remove the component usage and its import.

STEP 4: Remove the @amboras-dev/reviews package by running: pnpm remove @amboras-dev/reviews

STEP 5: Clean up any remaining review-related imports across the storefront (StarRating, review hooks, etc.). Search for any leftover imports from "@amboras-dev/reviews" or from "components/plugins/reviews/" and remove them.

STEP 6: Confirm completion:
"Reviews plugin has been removed from your storefront. Your review data is preserved — you can reinstall anytime and all existing reviews will still be there."
