'use client'
import Link from 'next/link'
import { useKlaviyoSmsStatus } from '@amboras-dev/klaviyo'

export default function SmsPreferencesNavCard() {
  const status = useKlaviyoSmsStatus()
  if (!status.data?.smsActive) return null
  return (
    <Link href="/account/notifications" className="block rounded border p-4 hover:bg-gray-50">
      <h3 className="text-sm font-medium">SMS Preferences</h3>
      <p className="mt-1 text-xs text-gray-600">Manage which text messages you receive.</p>
    </Link>
  )
}
