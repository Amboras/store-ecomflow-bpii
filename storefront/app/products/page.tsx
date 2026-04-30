'use client'

import { useState } from 'react'
import ProductGrid from '@/components/product/product-grid'
import { useQuery } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import { SlidersHorizontal, X } from 'lucide-react'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getMedusaClient().store.category.list({ limit: 100 })
      return response.product_categories
    },
  })

  const allCategories = categories || []

  return (
    <>
      {/* Page Header — bold comic banner */}
      <div className="bg-comic-yellow border-b-[4px] border-comic-ink halftone">
        <div className="container-custom py-section-sm relative">
          <div className="inline-block bg-white border-[4px] border-comic-ink shadow-comic px-6 py-4 -rotate-1">
            <h1 className="text-h1 font-heading uppercase tracking-wide text-comic-ink">
              Shop All!
            </h1>
            <p className="mt-1 font-heading uppercase tracking-wider text-comic-pink text-sm">
              ★ The whole collection ★
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-comic-pink lg:hidden !py-2 !px-4 !text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} />
            Filters
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <label className="text-xs font-heading uppercase tracking-widest text-comic-ink">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="comic-border bg-white px-3 py-2 text-sm font-heading uppercase tracking-wide focus:outline-none focus:shadow-comic-sm transition-shadow cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 lg:gap-10">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 space-y-6">
              {/* Categories — comic card */}
              <div className="card-comic bg-white p-5">
                <h3 className="font-heading uppercase tracking-wide text-base mb-4 text-comic-ink border-b-[3px] border-comic-ink pb-2">
                  Category
                </h3>
                {loadingCategories ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 w-24 bg-comic-cream rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-1.5 text-sm font-heading uppercase tracking-wide transition-all border-[2px] ${
                        !selectedCategory
                          ? 'bg-comic-ink text-comic-yellow border-comic-ink shadow-comic-sm'
                          : 'border-transparent text-comic-ink hover:bg-comic-cream hover:border-comic-ink'
                      }`}
                    >
                      All Products
                    </button>
                    {allCategories.map((category: { id: string; name: string }) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left px-3 py-1.5 text-sm font-heading uppercase tracking-wide transition-all border-[2px] ${
                          selectedCategory === category.id
                            ? 'bg-comic-ink text-comic-yellow border-comic-ink shadow-comic-sm'
                            : 'border-transparent text-comic-ink hover:bg-comic-cream hover:border-comic-ink'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Filter */}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="inline-flex items-center gap-1.5 text-xs font-heading uppercase tracking-wide bg-comic-pink text-white border-[3px] border-comic-ink px-3 py-1.5 shadow-comic-sm hover:-translate-y-0.5 transition-transform"
                >
                  Clear filters
                  <X className="h-3 w-3" strokeWidth={3} />
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <ProductGrid
              limit={100}
              categoryId={selectedCategory || undefined}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    </>
  )
}
