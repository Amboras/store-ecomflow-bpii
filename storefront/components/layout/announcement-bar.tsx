'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(90deg,rgba(9,8,7,1),rgba(54,39,18,0.95),rgba(9,8,7,1))]">
      <div className="container-custom relative flex items-center justify-center py-2 text-xs font-medium text-white/80 sm:text-sm">
        <p className="tracking-[0.16em] uppercase text-center">
          Free shipping over ₹999 across India
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 p-1 text-white/50 transition-colors hover:text-white sm:right-4"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
