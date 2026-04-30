'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw, Star, TrendingUp, Flame, Brain, Gift, Crown } from 'lucide-react'
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

  // Featured product = first product with an image
  const featuredProduct = products?.find((p: any) => p.thumbnail) || products?.[0]
  const featuredVariant = featuredProduct?.variants?.[0]
  const featuredPrice = featuredVariant?.calculated_price?.calculated_amount
  const featuredCurrency = featuredVariant?.calculated_price?.currency_code || 'inr'
  const formatPrice = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: 0 }).format(amount)

  // Two side products for the floating mini cards
  const sideProducts = (products || []).filter((p: any) => p.id !== featuredProduct?.id && p.thumbnail).slice(0, 2)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pb-48">
        {/* Red radial glow at center bottom */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] red-glow animate-glow-pulse" />
        </div>

        {/* Floating star dots */}
        <div className="absolute top-20 left-[15%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" />
        <div className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-white/80 animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-32 right-[35%] w-1 h-1 rounded-full bg-white/50 animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-[25%] w-1 h-1 rounded-full bg-white/70 animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-[8%] w-1 h-1 rounded-full bg-white/50 animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-[10%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" style={{ animationDelay: '2.5s' }} />

        <div className="container-custom relative z-10 text-center">
          {/* Pill badge */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 backdrop-blur-sm hover:bg-white/[0.08] transition-all"
          >
            New collection
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Massive headline — multi-word with second line accent */}
          <h1 className="mt-8 font-heading font-bold tracking-tighter text-white animate-fade-in-up leading-[0.95]">
            <span className="block text-4xl sm:text-6xl lg:text-7xl">
              Curated. Crafted.
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-8xl mt-2">
              Unforgettable.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Discover products built with care, shipped with speed.
            Designed for the people who notice the details.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/products" className="btn-pill" prefetch={true}>
              Browse Shop
            </Link>
            <Link href="/collections" className="btn-pill-red" prefetch={true}>
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* HERO STAGE — fanned cards + center product + floating chips + watermark */}
          <div className="relative mt-16 lg:mt-24 h-[420px] sm:h-[520px] lg:h-[600px] flex items-end justify-center">

            {/* Watermark giant AURA letters */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none overflow-hidden select-none">
              <span className="watermark-text text-[18vw] sm:text-[16vw] lg:text-[14vw] leading-none whitespace-nowrap font-heading font-bold tracking-tighter">
                <span className="text-red-600/30">A</span>
                <span>U</span>
                <span>R</span>
                <span>A</span>
              </span>
            </div>

            {/* Fanned background cards — left side */}
            <div className="hidden sm:block absolute bottom-0 left-[6%] w-[140px] lg:w-[180px] h-[260px] lg:h-[340px] rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 -rotate-12 backdrop-blur-sm" style={{ transform: 'rotate(-14deg) translateY(20px)' }} />
            <div className="hidden sm:block absolute bottom-0 left-[18%] w-[150px] lg:w-[200px] h-[280px] lg:h-[360px] rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10" style={{ transform: 'rotate(-7deg) translateY(10px)' }} />

            {/* Fanned background cards — right side */}
            <div className="hidden sm:block absolute bottom-0 right-[18%] w-[150px] lg:w-[200px] h-[280px] lg:h-[360px] rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10" style={{ transform: 'rotate(7deg) translateY(10px)' }} />
            <div className="hidden sm:block absolute bottom-0 right-[6%] w-[140px] lg:w-[180px] h-[260px] lg:h-[340px] rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10" style={{ transform: 'rotate(14deg) translateY(20px)' }} />

            {/* Center hero product card (the "phone") */}
            {featuredProduct && (
              <Link
                href={`/products/${featuredProduct.handle}`}
                prefetch={true}
                className="relative z-20 w-[200px] sm:w-[240px] lg:w-[280px] h-[400px] sm:h-[480px] lg:h-[560px] rounded-[2.5rem] overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_30px_80px_-20px_rgba(239,68,68,0.5)] backdrop-blur-md group animate-float"
              >
                {/* Notch detail */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black/60 z-10" />

                {/* Status bar mockup */}
                <div className="absolute top-0 inset-x-0 px-6 pt-2 pb-1 flex justify-between items-center text-[10px] text-white/80 z-10">
                  <span className="font-medium">9:41</span>
                  <div className="flex gap-1 items-center">
                    <span className="text-[8px]">●●●</span>
                  </div>
                </div>

                {/* Product image */}
                <div className="absolute inset-0 pt-10">
                  {featuredProduct.thumbnail ? (
                    <Image
                      src={featuredProduct.thumbnail}
                      alt={featuredProduct.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="280px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black" />
                  )}
                  {/* Gradient overlay for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                {/* Product info at bottom */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-left">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 mb-1.5 font-medium">Featured</p>
                  <p className="text-white font-semibold text-base leading-tight line-clamp-2">{featuredProduct.title}</p>
                  {featuredPrice !== undefined && (
                    <p className="mt-2 text-red-400 font-bold text-lg">{formatPrice(featuredPrice, featuredCurrency)}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Floating chip — top left (rating) */}
            {featuredProduct && (
              <div
                className="absolute z-30 left-[18%] sm:left-[26%] lg:left-[30%] top-[18%] sm:top-[22%] animate-float-slow"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-[0_10px_30px_-5px_rgba(239,68,68,0.4)]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white fill-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-white/50 leading-none">Rating</p>
                    <p className="text-white font-semibold text-sm leading-tight mt-0.5">4.9 / 5</p>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">+12%</span>
                </div>
              </div>
            )}

            {/* Floating chip — bottom right (price/trending) */}
            {sideProducts[0] && (
              <div
                className="absolute z-30 right-[14%] sm:right-[22%] lg:right-[26%] bottom-[28%] sm:bottom-[30%] animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-[0_10px_30px_-5px_rgba(239,68,68,0.4)]">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 relative">
                    {sideProducts[0].thumbnail && (
                      <Image
                        src={sideProducts[0].thumbnail}
                        alt={sideProducts[0].title}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    )}
                  </div>
                  <div className="text-left max-w-[120px]">
                    <p className="text-white font-semibold text-sm leading-tight line-clamp-1">{sideProducts[0].title}</p>
                    {sideProducts[0].variants?.[0]?.calculated_price?.calculated_amount !== undefined && (
                      <p className="text-red-400 font-bold text-xs leading-tight mt-0.5">
                        {formatPrice(sideProducts[0].variants[0].calculated_price.calculated_amount, sideProducts[0].variants[0].calculated_price.currency_code || 'inr')}
                      </p>
                    )}
                  </div>
                  <span className="text-green-400 text-[10px] font-semibold flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />Hot</span>
                </div>
              </div>
            )}
          </div>
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

      {/* THREE PROMISES — amboras-inspired structured panel */}
      <section className="relative py-section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">How we work</p>
              <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight leading-[1.05]">
                Three promises. <span className="text-white/40">All kept.</span>
              </h2>
            </div>
            <p className="lg:col-span-2 text-base sm:text-lg text-white/60 leading-relaxed lg:pt-12">
              From the moment you land here to the moment your order arrives — we&apos;ve obsessed over the details so you don&apos;t have to. No surprises, no shortcuts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Curated, not catalogued',
                desc: 'Every product earns its place. We say no to hundreds so you only see the few that matter.',
                Icon: Sparkles,
              },
              {
                num: '02',
                title: 'Live in 10 minutes',
                desc: 'From order to confirmation — one of the fastest checkouts on the planet, no friction.',
                Icon: Brain,
              },
              {
                num: '03',
                title: 'Shipped with intent',
                desc: 'Tracked from our hands to yours. Free shipping on orders over ₹999, always.',
                Icon: Truck,
              },
            ].map((item) => (
              <div key={item.num} className="card-aura p-7 group hover:bg-white/[0.04]">
                <div className="flex items-center justify-between mb-6">
                  <p className="font-heading font-bold text-5xl text-white/10">{item.num}</p>
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <item.Icon className="h-4 w-4 text-red-400" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM TABS — amboras-inspired "AI runs everything" */}
      <section className="relative py-section">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-3 font-medium">Made for you</p>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white tracking-tight leading-[1.05]">
              One store. <span className="text-white/40">Everything you need.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { Icon: Flame, label: 'Drops', title: 'Limited releases, before they\u2019re gone', desc: 'Small-batch products that close when stock hits zero. Move fast.', href: '/drops', accent: 'red' },
              { Icon: Brain, label: 'Discover', title: 'Smart picks, tailored to you', desc: 'Browse with intent. Filter by mood, budget, and what\u2019s loved.', href: '/discover', accent: 'red' },
              { Icon: Gift, label: 'Gift Links', title: 'Send a gift in 30 seconds', desc: 'Pick a product, write a note, share a secret link. They claim, we ship.', href: '/gift', accent: 'red' },
              { Icon: Crown, label: 'Rewards', title: 'Earn, save, vote on what\u2019s next', desc: 'Members shape the catalog. Every purchase counts toward perks.', href: '/rewards', accent: 'red' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="group card-aura p-7 sm:p-9 hover:bg-white/[0.04] hover:border-white/20 transition-all relative overflow-hidden"
              >
                {/* Subtle red glow on hover */}
                <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-red-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <item.Icon className="h-4 w-4 text-red-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-red-400 font-medium">{item.label}</p>
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white mb-2 leading-tight">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-6">{item.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-white group-hover:text-red-400 transition-colors">
                    Open
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS panel — amboras-inspired bold gradient block */}
      <section className="relative py-section">
        <div className="container-custom">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/15 via-red-900/5 to-transparent p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 starfield opacity-40 pointer-events-none" />
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
              {[
                { stat: '2 days', label: 'Average delivery time' },
                { stat: '4.9 / 5', label: 'Rating across products' },
                { stat: '10k+', label: 'Happy customers' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-heading font-bold text-5xl sm:text-6xl text-white tracking-tight">{item.stat}</p>
                  <p className="mt-3 text-sm text-white/60 uppercase tracking-[0.2em]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — amboras-inspired big quote */}
      <section className="relative py-section">
        <div className="container-custom">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-transparent p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full red-glow opacity-30 pointer-events-none" />
            <div className="relative max-w-3xl">
              <p className="font-heading text-3xl sm:text-5xl text-white leading-[1.15] tracking-tight">
                &ldquo;Easily the best little shop I&apos;ve found this year. The drops are tight, the shipping is stupid-fast, and you can tell every product has a person behind it.&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700" />
                <div>
                  <p className="text-white font-medium">Aanya M.</p>
                  <p className="text-sm text-white/40">Insider member · Bengaluru</p>
                </div>
              </div>
            </div>
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
