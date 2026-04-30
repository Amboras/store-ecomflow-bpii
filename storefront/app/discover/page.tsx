'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Sparkles, TrendingUp, Brain, Search, Star } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'

type Tab = 'recommend' | 'trending' | 'insights'

export default function DiscoverPage() {
  const [tab, setTab] = useState<Tab>('recommend')
  const [query, setQuery] = useState('')
  const { data: products } = useProducts({ limit: 12 })

  const formatPrice = (amount: number, currency = 'inr') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: 0 }).format(amount)

  const filtered = (products || []).filter((p: any) =>
    !query.trim() ? true : p.title.toLowerCase().includes(query.toLowerCase().trim())
  )

  return (
    <div className="relative min-h-screen pt-12 pb-24">
      {/* Twinkling stars */}
      <div className="absolute top-32 left-[10%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-white/80 animate-twinkle" style={{ animationDelay: '1s' }} />

      {/* HERO */}
      <section className="container-custom text-center pt-12 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 backdrop-blur-sm mb-8">
          <Brain className="h-3.5 w-3.5 text-red-400" />
          Powered by smart shopping
        </div>
        <h1 className="font-heading font-bold tracking-tighter text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
          Discover.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          A smarter way to find what you&apos;ll love. We surface the picks that match your taste and your budget — instantly.
        </p>

        {/* Tabs */}
        <div className="mt-10 inline-flex items-center bg-white/[0.03] border border-white/10 rounded-full p-1.5 backdrop-blur-md">
          {([
            { id: 'recommend' as Tab, label: 'For You' },
            { id: 'trending' as Tab, label: 'Trending' },
            { id: 'insights' as Tab, label: 'Insights' },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-white/10 text-white shadow-inset-border'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN GRID — search panel + stats panels */}
      <section className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Search panel — spans 2 */}
          <div className="lg:col-span-2 card-aura p-6 sm:p-8">
            <h2 className="font-heading font-bold text-2xl text-white mb-5">
              {tab === 'recommend' && 'Curated for you'}
              {tab === 'trending' && 'What everyone\u2019s buying'}
              {tab === 'insights' && 'Style insights'}
            </h2>

            {/* Search input — pill style */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tell us what you&rsquo;re after — e.g. &lsquo;cozy&rsquo;, &lsquo;gift&rsquo;, &lsquo;vibrant&rsquo;"
                className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* AI processing pill */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 mb-6">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <div className="text-left">
                <p className="text-xs text-red-400 font-medium">Smart match</p>
                <p className="text-xs text-white/60">Ranking products by fit, popularity, and your budget</p>
              </div>
            </div>

            {/* Results — 3 column grid of compact tiles */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.slice(0, 6).map((p: any, i: number) => {
                  const v = p.variants?.[0]
                  const price = v?.calculated_price?.calculated_amount ?? 0
                  const currency = v?.calculated_price?.currency_code ?? 'inr'
                  return (
                    <Link
                      key={p.id}
                      href={`/products/${p.handle}`}
                      prefetch={true}
                      className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all"
                      style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}
                    >
                      <div className="aspect-square relative bg-white/[0.02]">
                        {p.thumbnail ? (
                          <Image src={p.thumbnail} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-white font-medium line-clamp-1">{p.title}</p>
                        <p className="text-xs text-red-400 font-semibold mt-1">{formatPrice(price, currency)}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-white/40 text-sm">
                Nothing matches that yet. Try a broader search.
              </div>
            )}

            <Link href="/products" className="mt-6 w-full btn-pill-red justify-center">
              Browse all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* RIGHT: Stats panels stack */}
          <div className="space-y-5">
            <StatCard
              label="Catalog Size"
              value={`${(products?.length || 0)}+ items`}
              cta={{ label: 'Browse', href: '/products' }}
              gradient
            />
            <StatCard
              label="Trending This Week"
              value={products?.[0]?.title?.slice(0, 18) || 'New arrivals'}
              cta={{ label: 'View', href: '/products' }}
            />
            <StatCard
              label="Best Rated"
              value="4.9 / 5"
              icon={<Star className="h-4 w-4 fill-red-400 text-red-400" />}
              cta={{ label: 'Reviews', href: '/products' }}
            />
          </div>
        </div>

        {/* Trending strip */}
        {tab === 'trending' && products && products.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-red-400 mb-5 font-medium flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Hot right now
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 4).map((p: any) => {
                const v = p.variants?.[0]
                const price = v?.calculated_price?.calculated_amount ?? 0
                const currency = v?.calculated_price?.currency_code ?? 'inr'
                return (
                  <Link key={p.id} href={`/products/${p.handle}`} className="card-aura overflow-hidden group" prefetch={true}>
                    <div className="aspect-square relative bg-white/[0.02]">
                      {p.thumbnail && (
                        <Image src={p.thumbnail} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white font-medium line-clamp-1">{p.title}</p>
                      <p className="text-sm text-red-400 font-semibold mt-1">{formatPrice(price, currency)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'insights' && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { stat: '93%', label: 'of customers find their perfect match in under 60 seconds' },
              { stat: '4.9★', label: 'average rating across our most-loved categories' },
              { stat: '2 days', label: 'average time from order to your doorstep' },
            ].map((item) => (
              <div key={item.label} className="card-aura p-6">
                <p className="font-heading font-bold text-5xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  {item.stat}
                </p>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label, value, cta, icon, gradient,
}: {
  label: string
  value: string
  cta: { label: string; href: string }
  icon?: React.ReactNode
  gradient?: boolean
}) {
  return (
    <div className={`card-aura p-5 sm:p-6 relative overflow-hidden ${gradient ? 'bg-gradient-to-br from-red-500/10 via-white/[0.02] to-transparent' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
        {icon}
      </div>
      <p className="font-heading font-bold text-3xl text-white tracking-tight line-clamp-1">{value}</p>
      <Link href={cta.href} className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors group" prefetch={true}>
        {cta.label}
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}
