'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'

interface CollectionSectionProps {
  collection: any
  alternate?: boolean
}

export default function CollectionSection({ collection, alternate }: CollectionSectionProps) {
  const description = collection.metadata?.description
  const hasDescription = typeof description === 'string' && description
  const accent = alternate ? 'bg-comic-blue' : 'bg-comic-pink'

  return (
    <section className={`py-section relative ${alternate ? 'bg-comic-cream' : ''} border-y-[3px] border-comic-ink`}>
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div className="flex items-end gap-4 flex-wrap">
            <span className={`inline-block ${accent} text-white font-heading text-sm uppercase tracking-widest px-3 py-1 border-[3px] border-comic-ink shadow-comic-sm -rotate-2`}>
              ★ Collection ★
            </span>
            <div>
              <h2 className="font-heading text-4xl sm:text-5xl tracking-wider text-comic-ink">
                {collection.title}!
              </h2>
              {hasDescription && (
                <p className="text-comic-ink mt-2 max-w-lg font-bold">{description}</p>
              )}
            </div>
          </div>
          <Link
            href={`/collections/${collection.handle}`}
            className="btn-comic-black text-sm whitespace-nowrap"
            prefetch={true}
          >
            View All
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </Link>
        </div>
        <ProductGrid collectionId={collection.id} limit={4} />
      </div>
    </section>
  )
}
