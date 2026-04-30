'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'
import { useProducts } from '@/hooks/use-products'
import ProductCard from '@/components/product/product-card'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const { data: products } = useProducts({ limit: 8 })
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Red radial glow at center */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] red-glow animate-glow-pulse" />
        </div>

        {/* Watermark giant letters in background */}
        <div className="absolute inset-x-0 top-1/2 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="watermark-text text-[28vw] leading-none whitespace-nowrap">
            AURA
          </span>
        </div>

        {/* Floating star dots */}
        <div className="absolute top-20 left-[15%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" />
        <div className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-white/80 animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-32 right-[35%] w-1 h-1 rounded-full bg-white/50 animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-[25%] w-1 h-1 rounded-full bg-white/70 animate-twinkle" style={{ animationDelay: '0.5s' }} />

        <div className="container-custom relative z-10 py-24 lg:py-32 text-center">
          {/* Pill badge */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 backdrop-blur-sm hover:bg-white/[0.08] transition-all"
          >
            New collection live
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Massive headline */}
          <h1 className="mt-8 font-heading font-bold tracking-tighter text-white animate-fade-in-up">
            <span className="block text-5xl sm:text-7xl lg:text-8xl">
              Curated. Crafted.
            </span>
            <span className="block text-6xl sm:text-8xl lg:text-9xl mt-1">
              Unforgettable.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Discover products that go beyond the ordinary — built with care,
            shipped with speed, designed for the people who notice the details.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/products" className="btn-pill" prefetch={true}>
              Browse Shop
            </Link>
            <Link href="/collections" className="btn-pill-red" prefetch={true}>
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Floating product preview cards */}
          {products && products.length >= 2 && (
            <div className="mt-20 relative max-w-4xl mx-auto h-[280px] sm:h-[360px] hidden md:block">
              {/* Left tilted card */}
              <div className="absolute left-0 top-8 w-56 lg:w-64 -rotate-6 animate-float-slow">
                <FloatingProductCard product={products[0]} />
              </div>
              {/* Center card */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-60 lg:w-72 z-10 animate-float-slow" style={{ animationDelay: '-1.5s' }}>
                <FloatingProductCard product={products[1]} accent />
              </div>
              {/* Right tilted card */}
              {products[2] && (
                <div className="absolute right-0 top-8 w-56 lg:w-64 rotate-6 animate-float-slow" style={{ animationDelay: '-3s' }}>
                  <FloatingProductCard product={products[2]} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-section">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Featured</p>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight">
                Best sellers.
              </h2>
            </div>
            <Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group" prefetch={true}>
              View all
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 4).map((product: any, i: number) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'backwards' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] card-aura animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections from API */}
      {!isLoading && collections && collections.length > 0 && (
        <>
          {collections.slice(0, 2).map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      )}

      {/* Trust bar */}
      <section className="relative py-section-sm border-y border-white/10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: Truck, title: 'Fast Shipping', sub: 'Free over ₹999' },
              { Icon: RotateCcw, title: 'Easy Returns', sub: '30-day policy' },
              { Icon: Shield, title: 'Secure Checkout', sub: '256-bit SSL' },
            ].map(({ Icon, title, sub }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-red-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-white/50">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Value section */}
      <section className="relative py-section overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full red-glow opacity-40 pointer-events-none" />
        <div className="container-custom relative max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Our story</p>
          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
            Designed with intention.<br />
            <span className="text-white/40">Shipped with care.</span>
          </h2>
          <p className="mt-8 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Every product in our store earns its place. We don&apos;t do filler. We don&apos;t do fast trends.
            We curate pieces built to last and ship them to you fast.
          </p>
          <Link href="/about" className="mt-10 btn-pill inline-flex" prefetch={true}>
            Learn more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-section border-t border-white/10 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] red-glow opacity-50 pointer-events-none" />
        <div className="container-custom relative max-w-2xl text-center">
          <Sparkles className="h-7 w-7 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Stay in the loop.
          </h2>
          <p className="mt-4 text-white/60">
            Get early access to drops, exclusive offers, and new collections.
          </p>
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-full bg-white/[0.04] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
            />
            <button type="submit" className="btn-pill-red whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-white/30">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}

// Floating product preview card for the hero (used 3x with rotation)
function FloatingProductCard({ product, accent = false }: { product: any; accent?: boolean }) {
  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const currency = variant?.calculated_price?.currency_code || 'inr'

  const formatted = price != null
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumFractionDigits: 0,
      }).format(price / 100)
    : ''

  return (
    <Link
      href={`/products/${product.handle}`}
      prefetch={true}
      className={`block card-glass overflow-hidden ${accent ? 'shadow-glow-red' : ''} hover:scale-105 transition-transform duration-500`}
    >
      <div className="relative aspect-[3/4] bg-white/5 overflow-hidden">
        {product.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-white truncate">{product.title}</p>
        {formatted && (
          <p className="text-xs text-red-400 mt-1">{formatted}</p>
        )}
      </div>
    </Link>
  )
}
