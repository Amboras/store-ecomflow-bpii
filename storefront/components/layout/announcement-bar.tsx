'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-comic-ink text-comic-yellow border-b-[3px] border-comic-ink overflow-hidden">
      <div className="absolute inset-0 stripes-black opacity-20 animate-stripes-shift" />
      <div className="container-custom relative flex items-center justify-center py-2.5 text-sm font-bold tracking-widest uppercase">
        <p className="font-heading text-base sm:text-lg animate-shimmy">★ Free Shipping Over ₹999 — Pow! Bam! Shop Now! ★</p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:rotate-90 transition-transform"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
