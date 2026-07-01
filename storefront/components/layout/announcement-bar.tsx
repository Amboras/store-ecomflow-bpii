'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-black via-red-950/40 to-black border-b border-white/5 overflow-hidden">
      <div className="container-custom relative flex items-center justify-center py-2 text-xs sm:text-sm font-medium text-white/80">
        <p className="tracking-wide text-center pr-8 sm:pr-0">
          New arrivals are live — free shipping across India on orders over ₹999
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 sm:right-4 p-1 text-white/50 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
