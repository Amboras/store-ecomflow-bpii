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

<!-- AMBORAS:PLUGIN:klaviyo:START -->
### Klaviyo
npm: @amboras-dev/klaviyo

Email and SMS marketing for ecommerce — flows, segments, and predictive analytics powered by your store data.

**Components (written to your workspace — edit freely):**

> BEFORE rendering any of these components, open the file with the Read tool and read the exported TypeScript `Props` interface. Required props MUST be passed or the build will fail with a type error at runtime.

`KlaviyoProvider` — Loads klaviyo.js once for the entire storefront. Renders nothing if no publicKey is configured. Required for any other klaviyo hook to work.
  Destination:    `Root layout (mounted via rootProviders slot)`
  Required props: (none)
  Optional props: strategy: 'afterInteractive' | 'lazyOnload' (default: afterInteractive), publicKey: string — Klaviyo company id (e.g. 'SUru6y')
  Usage:          `<KlaviyoProvider publicKey={status.data?.publicKey} />`

`KlaviyoIdentifyOnLogin` — Fires Klaviyo identify with the customer's email + id whenever they sign in. Idempotent — deduplicates on email changes so a re-login doesn't re-fire.
  Destination:    `Account section (auto-placed)`
  Required props: (none)
  Optional props: customer: object — { id, email, first_name, last_name, phone? }
  Usage:          `<KlaviyoIdentifyOnLogin customer={customer} />`

`SmsConsentCheckbox` — Renders an opt-in form for SMS marketing at checkout. Auto-hides when the merchant has no active SMS plan or no configured sender. Substitutes {brand} in the disclosure with the actual store name. Posts to Klaviyo's /client/subscriptions on submit; double-opt-in SMS arrives on the phone for the shopper to confirm.
  Destination:    `checkoutOrderSummary slot (storefront checkout page)`
  Required props: (none)

  Usage:          `<SmsConsentCheckbox /> (component reads everything it needs from useKlaviyoSmsStatus)`

`SmsPreferencesNavCard` — Nav card in the account dashboard linking shoppers to /account/notifications to manage SMS preferences. Auto-hides when SMS isn't active for the store.
  Destination:    `accountOverview slot`
  Required props: (none)

  Usage:          `<SmsPreferencesNavCard />`

`NotificationsPage` — Customer-facing unsubscribe page. Reads the storefront customer JWT from the _medusa_jwt cookie and calls /store/klaviyo/unsubscribe-sms server-side.
  Destination:    `app/account/notifications/page.jsx`
  Required props: (none)

  Usage:          `Auto-installed at /account/notifications`

**Hooks (from npm package — import, do not copy):**

`useKlaviyo` — `useKlaviyo(): { isReady: boolean, klaviyo: KlaviyoSDK | null }`
  Returns: Access to the loaded klaviyo.js SDK + readiness flag. Returns null SDK until KlaviyoProvider finishes loading.
  Import:  `import { useKlaviyo } from '@amboras-dev/klaviyo'`

`useKlaviyoIdentify` — `useKlaviyoIdentify(): (profile: { email, first_name?, last_name?, phone? }) => Promise<void>`
  Returns: Imperative identify trigger. Use when you need to identify outside of the login flow (e.g. newsletter signup popup).
  Import:  `import { useKlaviyoIdentify } from '@amboras-dev/klaviyo'`

`useKlaviyoTrack` — `useKlaviyoTrack(): (metric: string, properties?: Record<string, unknown>) => Promise<void>`
  Returns: Send a custom event to Klaviyo. Standard events ('Started Checkout', 'Placed Order') are fired automatically by other amboras plugins — use this hook for custom merchant-defined events.
  Import:  `import { useKlaviyoTrack } from '@amboras-dev/klaviyo'`

`useKlaviyoViewedProduct` — `useKlaviyoViewedProduct(product: { id, title, price, imageUrl?, url? }): void`
  Returns: Auto-fires the 'Viewed Product' event on mount. Place on PDP. Idempotent within a single page-view session.
  Import:  `import { useKlaviyoViewedProduct } from '@amboras-dev/klaviyo'`

`useKlaviyoSmsStatus` — `useKlaviyoSmsStatus(opts?: { baseUrl?, publishableKey? }): UseQueryResult<SmsStatusData>`
  Returns: { smsActive, senderConfigured, disclosureText, smsListId, publicKey, storeName } from Medusa's /store/integrations/active. 5-min TanStack staleTime. Returns smsActive=false when the merchant hasn't completed SMS setup.
  Import:  `import { useKlaviyoSmsStatus } from '@amboras-dev/klaviyo'`

`useKlaviyoSubscribePhone` — `useKlaviyoSubscribePhone(opts: { tenantId?, publicApiKey?, listId?, customSource?, supportedCountries? }): UseMutationResult<SubscribePhoneResult, never, { phoneNumber, disclosureText }>`
  Returns: Mutation hook that POSTs to Klaviyo's /client/subscriptions with E.164-normalized phone + list relationship. Result shape: { ok: true } | { ok: false, error: { code, message } }. Short-circuit codes: 'no_public_key' (publicApiKey missing), 'invalid_phone' (parse failed), 'unsupported_country' (region not in active list), 'klaviyo_error' (upstream 4xx/5xx).
  Import:  `import { useKlaviyoSubscribePhone } from '@amboras-dev/klaviyo'`

`useKlaviyoUnsubscribePhone` — `useKlaviyoUnsubscribePhone(opts?: { baseUrl? }): UseMutationResult<UnsubscribePhoneResult, never, { phoneNumber, customerToken }>`
  Returns: Mutation hook for the customer self-service unsubscribe page. Posts to Medusa's /store/klaviyo/unsubscribe-sms (not Klaviyo directly). Returns Result shape matching subscribe.
  Import:  `import { useKlaviyoUnsubscribePhone } from '@amboras-dev/klaviyo'`

`getKlaviyoPublicKey (server)` — `getKlaviyoPublicKey(baseUrl: string, publishableKey: string): Promise<string | null>`
  Returns: Server-side fetch of the merchant's public key from Medusa. Use in Next.js Server Components or app router root layout to pass into <KlaviyoProvider> at SSR time without exposing the storefront's publishable key client-side beyond what's already public.
  Import:  `import { getKlaviyoPublicKey (server) } from '@amboras-dev/klaviyo'`

**API endpoints:**
  GET  /store/integrations/active  — public-safe plugin config { klaviyo: {publicKey, sms_active, sms_sender_configured, sms_disclosure_text, sms_list_id, sms_active_regions, sms_supported_countries}, store_name } (cached 60s, busted on credential sync)
  POST /store/klaviyo/unsubscribe-sms  — customer self-service unsubscribe; requires _medusa_jwt bearer token
  POST   /admin/klaviyo/connect           — merchant supplies privateKey + publicKey; validates with Klaviyo, encrypts + stores, probes SMS, registers webhook (if Advanced KDP)  ← admin auth required
  DELETE /admin/klaviyo/disconnect        — clears credentials + Medusa metadata + in-memory caches  ← admin auth required
  GET    /admin/klaviyo/status            — connected/disconnected + account name + plan info  ← admin auth required
  GET    /admin/klaviyo/sms-status        — SMS plan state, sender config, active regions, list id  ← admin auth required
  POST   /admin/klaviyo/probe-sms         — manual 'Refresh status' trigger; re-runs the 21-country probe  ← admin auth required
  PATCH  /admin/klaviyo/sms-disclosure    — update the TCPA disclosure text + frequency-per-month  ← admin auth required
  GET    /admin/klaviyo/sms-events        — activity log feed (sent/received/clicked/failed/subscribed/unsubscribed), grouped by phone number, paginated. Empty for non-KDP accounts.  ← admin auth required
  POST   /webhooks/klaviyo                — Klaviyo → Medusa webhook ingress (HMAC-verified, dedup-on-conflict). Requires Klaviyo Advanced KDP on the merchant account.  ← admin auth required
  POST   /orchestrator/klaviyo/sync-credentials  — internal endpoint (X-Orchestrator-Secret); orchestrator pushes credential + SMS state on every connect/probe; handler busts storefront cache + ensures webhook is registered  ← admin auth required

<!-- AMBORAS:PLUGIN:klaviyo:END -->
