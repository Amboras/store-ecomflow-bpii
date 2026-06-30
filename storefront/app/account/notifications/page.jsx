'use client'
import { Suspense, useState } from 'react'
import { useKlaviyoUnsubscribePhone, useKlaviyoSmsStatus } from '@amboras-dev/klaviyo'

function NotificationsContent() {
  const status = useKlaviyoSmsStatus()
  const unsubscribe = useKlaviyoUnsubscribePhone()
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)

  // Return null while the SMS-status query is still resolving (status.data
  // is undefined) AND when SMS is inactive — don't leak "this store has SMS
  // turned off" copy to shoppers. The nav card that links here already
  // returns null in the same conditions, so the only way a shopper hits
  // this page is by typing the URL directly; rendering nothing is the
  // correct fallback (Next.js shows the layout chrome around an empty page).
  if (!status.data?.smsActive) return null
  if (done) return <p className="text-sm text-green-700">You&apos;ve been unsubscribed.</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">SMS Preferences</h1>
      <p className="text-sm text-gray-600">Enter the phone number you want to unsubscribe from text marketing.</p>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 555-0006" className="w-full rounded border px-3 py-2" />
      <button
        onClick={async () => {
          const token = document.cookie.match(/_medusa_jwt=([^;]+)/)?.[1] ?? ''
          try { await unsubscribe.mutateAsync({ phoneNumber: phone, customerToken: token }); setDone(true) } catch {}
        }}
        disabled={!phone || unsubscribe.isPending}
        className="rounded bg-black px-4 py-2 text-sm text-white disabled:bg-gray-400"
      >
        Unsubscribe
      </button>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <div className="container-custom py-12 max-w-2xl">
      <Suspense><NotificationsContent /></Suspense>
    </div>
  )
}
