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
      {/* Page Header */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 red-glow-soft pointer-events-none" />
        <div className="container-custom py-16 lg:py-20 relative">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Catalog</p>
          <h1 className="font-heading font-bold text-4xl sm:text-6xl text-white tracking-tight">
            Shop all products
          </h1>
          <p className="mt-3 text-white/60 max-w-xl">
            The full collection. Filter by category, sort by what matters to you.
          </p>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-pill !text-xs !py-2 !px-4"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <label className="text-xs uppercase tracking-[0.15em] text-white/50">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full bg-white/[0.04] border border-white/15 px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-10">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 space-y-6">
              <div className="card-aura p-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/50 mb-4 font-medium">
                  Category
                </h3>
                {loadingCategories ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                        !selectedCategory
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      All Products
                    </button>
                    {allCategories.map((category: { id: string; name: string }) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                          selectedCategory === category.id
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  Clear filters
                  <X className="h-3 w-3" />
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
