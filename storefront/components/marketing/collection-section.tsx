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

  return (
    <section className="relative py-section border-t border-white/10 overflow-hidden">
      {alternate && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full red-glow opacity-30 pointer-events-none" />
      )}
      <div className="container-custom relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Collection</p>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight">
              {collection.title}
            </h2>
            {hasDescription && (
              <p className="text-white/60 mt-3 max-w-lg">{description}</p>
            )}
          </div>
          <Link
            href={`/collections/${collection.handle}`}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group whitespace-nowrap"
            prefetch={true}
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid collectionId={collection.id} limit={4} />
      </div>
    </section>
  )
}
