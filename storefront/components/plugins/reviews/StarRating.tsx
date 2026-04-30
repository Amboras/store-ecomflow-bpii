'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

export interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  onRate?: (rating: number) => void
  interactive?: boolean
  className?: string
}

const SIZE_MAP: Record<NonNullable<StarRatingProps['size']>, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
}

export default function StarRating({
  rating,
  size = 'md',
  onRate,
  interactive = false,
  className = '',
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const sizeClass = SIZE_MAP[size]

  const active = hover ?? rating
  const stars = [1, 2, 3, 4, 5]

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${rating.toFixed(1)} out of 5`}
    >
      {stars.map((value) => {
        const filled = active >= value
        const partial = !interactive && !filled && active > value - 1 && active < value
        const fillPercent = partial ? Math.round((active - (value - 1)) * 100) : 0

        const Icon = (
          <span className={`relative inline-block ${sizeClass}`}>
            <Star
              className={`${sizeClass} ${filled ? 'fill-red-500 text-red-500' : 'fill-transparent text-white/20'}`}
              strokeWidth={2}
            />
            {partial && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  className={`${sizeClass} fill-red-500 text-red-500`}
                  strokeWidth={2}
                />
              </span>
            )}
          </span>
        )

        if (!interactive) {
          return <span key={value}>{Icon}</span>
        }

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value > 1 ? 's' : ''}`}
            onClick={() => onRate?.(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
            className="transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm"
          >
            {Icon}
          </button>
        )
      })}
    </div>
  )
}
