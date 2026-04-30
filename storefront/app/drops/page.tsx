'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { ArrowRight, Flame, Clock, Sparkles, Plus } from 'lucide-react'
import { useCollections } from '@/hooks/use-collections'
import { useProducts } from '@/hooks/use-products'

type Tab = 'active' | 'upcoming' | 'security'

export default function DropsPage() {
  const [tab, setTab] = useState<Tab>('active')
  const { data: collections } = useCollections()
  const { data: products } = useProducts({ limit: 24 })

  const formatPrice = (amount: number, currency = 'inr') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: 0 }).format(amount)

  // Build deterministic "drops" from products
  const drops = useMemo(() => {
    if (!products) return []
    return products.slice(0, 9).map((p: any, i: number) => {
      const variant = p.variants?.[0]
      const price = variant?.calculated_price?.calculated_amount ?? 0
      const currency = variant?.calculated_price?.currency_code ?? 'inr'
      // deterministic pseudo-random based on index for stable values
      const stockTotal = 50 + ((i * 17) % 200)
      const stockSold = Math.floor(stockTotal * (0.15 + ((i * 13) % 70) / 100))
      const progress = Math.min(99, Math.round((stockSold / stockTotal) * 100))
      return {
        product: p,
        price,
        currency,
        stockTotal,
        stockSold,
        progress,
        status: progress >= 80 ? 'Almost Gone' : progress >= 30 ? 'Live' : 'Just Dropped',
      }
    })
  }, [products])

  return (
    <div className="relative min-h-screen pt-12 pb-24">
      {/* Twinkling stars */}
      <div className="absolute top-32 left-[10%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-white/80 animate-twinkle" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-[8%] w-1 h-1 rounded-full bg-white/50 animate-twinkle" style={{ animationDelay: '2s' }} />

      {/* HERO */}
      <section className="container-custom text-center pt-12 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 backdrop-blur-sm mb-8">
          <Flame className="h-3.5 w-3.5 text-red-400" />
          Limited drops, big stories
        </div>
        <h1 className="font-heading font-bold tracking-tighter text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
          The Drops.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Limited-edition releases, made in small batches and shipped fast. When they&apos;re gone, they&apos;re gone — secure yours before the timer runs out.
        </p>

        {/* Tabs */}
        <div className="mt-10 inline-flex items-center bg-white/[0.03] border border-white/10 rounded-full p-1.5 backdrop-blur-md">
          {([
            { id: 'active' as Tab, label: 'Active' },
            { id: 'upcoming' as Tab, label: 'Upcoming' },
            { id: 'security' as Tab, label: 'How drops work' },
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

      {/* CONTENT */}
      <section className="container-custom">
        {tab === 'active' && (
          <>
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-2 font-medium">Live now</p>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                  Active drops <span className="text-white/40">({drops.length})</span>
                </h2>
              </div>
              <Link href="/products" className="btn-pill-red text-sm">
                <Plus className="h-4 w-4" />
                Submit a Drop
              </Link>
            </div>

            {drops.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card-aura p-6 h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drops.map((d, i) => (
                  <DropCard key={d.product.id} drop={d} index={i} formatPrice={formatPrice} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(collections?.slice(0, 4) || []).map((c: any, i: number) => (
              <div key={c.id} className="card-aura p-6 group hover:bg-white/[0.04] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-1.5 font-medium">Coming soon</p>
                    <h3 className="font-heading font-bold text-2xl text-white">{c.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/60">
                    Day {(i + 1) * 3}
                  </span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  A new chapter is brewing. Sign up to get notified the moment it goes live.
                </p>
                <Link href={`/collections/${c.handle}`} className="btn-pill text-sm" prefetch={true}>
                  Notify me
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
            {(!collections || collections.length === 0) && (
              <div className="md:col-span-2 card-aura p-12 text-center">
                <Sparkles className="h-10 w-10 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-white/60">More drops are on the way. Check back soon.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Authentic', desc: 'Every drop is sourced direct from the maker. No knock-offs, no resellers.', step: '01' },
              { title: 'Limited', desc: 'Small batches by design. Once stock hits zero, the drop closes.', step: '02' },
              { title: 'Fair launch', desc: 'No early access, no friends-and-family. Whoever clicks first, wins.', step: '03' },
            ].map((item) => (
              <div key={item.step} className="card-aura p-8">
                <p className="text-5xl font-heading font-bold text-white/10 mb-4">{item.step}</p>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function DropCard({ drop, index, formatPrice }: { drop: any; index: number; formatPrice: (a: number, c?: string) => string }) {
  const { product, price, currency, stockTotal, stockSold, progress, status } = drop
  const statusColor =
    status === 'Almost Gone' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
    status === 'Live' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
    'text-white/70 bg-white/[0.04] border-white/15'

  return (
    <div
      className="card-aura overflow-hidden group hover:bg-white/[0.04] hover:border-white/20 transition-all animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
    >
      {/* Image */}
      <Link href={`/products/${product.handle}`} className="block aspect-[4/3] relative bg-white/[0.02] overflow-hidden" prefetch={true}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white/20" />
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-md ${statusColor}`}>
          {status}
        </span>
      </Link>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-lg text-white mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Drop #{String(index + 1).padStart(3, '0')}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/50 uppercase tracking-wider">Progress</span>
            <span className="text-white font-medium">{stockSold} / {stockTotal} sold</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Price</p>
            <p className="text-white font-bold mt-1">{formatPrice(price, currency)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Ends in</p>
            <p className="text-white font-bold mt-1 flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-red-400" />
              {2 + (index % 5)}d {(index * 7) % 24}h
            </p>
          </div>
        </div>

        <Link
          href={`/products/${product.handle}`}
          className="mt-5 w-full btn-pill text-sm justify-center"
          prefetch={true}
        >
          View Drop
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
