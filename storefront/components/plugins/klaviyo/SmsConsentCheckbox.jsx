'use client'
import { useState } from 'react'
import { useKlaviyoSubscribePhone, useKlaviyoSmsStatus } from '@amboras-dev/klaviyo'

export default function SmsConsentCheckbox() {
  const status = useKlaviyoSmsStatus()
  // tenantId — read from NEXT_PUBLIC_STORE_ID (set at deploy time by
  // vercel-deployment.service.ts → getOrCreateProductionEnvironment).
  // Passed to the hook so it attaches as properties._amboras_tenant_id
  // on the Klaviyo subscribe. Medusa's webhook handler reads it as
  // Tier-0 lookup → non-customer subscribers (popup signups who never
  // ordered) route to the right tenant without a per-tenant scan.
  //
  // publicApiKey + listId — read from the SMS-status query so the
  // storefront doesn't depend on NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY being
  // set in its env (rarely is on legacy stores). Without these two
  // the subscribe hook short-circuits to {ok:false, code:'no_public_key'}
  // BEFORE making any HTTP call to Klaviyo (the 2026-06-17 staging
  // regression). Requires @amboras-dev/klaviyo >= 0.4.5 which exposes
  // publicKey + storeName on useKlaviyoSmsStatus().data.
  const tenantId = process.env.NEXT_PUBLIC_STORE_ID
  const subscribe = useKlaviyoSubscribePhone({
    tenantId,
    publicApiKey: status.data?.publicKey,
    listId: status.data?.smsListId,
  })
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  if (!status.data?.smsActive || !status.data?.senderConfigured) return null

  // Default MUST mirror backend/src/modules/klaviyo-integrations/constants.ts
  // DEFAULT_SMS_DISCLOSURE — this string is written into the merchant's
  // storefront workspace, so it can't directly import the backend constant.
  //
  // The raw template stores '{brand}' as a placeholder; we substitute the
  // actual store name here before render. Server-side substitution would
  // require an extra Medusa query at every page load — Klaviyo's hook
  // already returns storeName so we can do it client-side for free.
  // Falls back to 'us' (TCPA-acceptable generic) if storeName is missing.
  const rawDisclosure = status.data.disclosureText ?? 'By providing your phone number, you agree to receive recurring marketing text messages from {brand}. Msg & data rates may apply. Reply STOP to cancel, HELP for help.'
  const disclosure = rawDisclosure.replace(/\{brand\}/g, status.data?.storeName ?? 'us')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consent || !phone) return
    const result = await subscribe.mutateAsync({ phoneNumber: phone, disclosureText: disclosure })
    setSubmitted(result.ok ? 'ok' : 'error')
  }

  if (submitted === 'ok') return <p className="text-sm text-green-700">Check your phone for a confirmation message.</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="text-sm font-medium">Text me deals</label>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 555-0006" className="w-full rounded border px-3 py-2 text-sm" />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>{disclosure}</span>
      </label>
      <button type="submit" disabled={!consent || !phone || subscribe.isPending} className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:bg-gray-400">
        {subscribe.isPending ? 'Submitting…' : 'Sign me up'}
      </button>
      {submitted === 'error' && <p className="text-xs text-red-600">Couldn&apos;t subscribe — please try again.</p>}
    </form>
  )
}
