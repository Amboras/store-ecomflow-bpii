'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Truck, Shield, RotateCcw, Zap, Star, Flame } from 'lucide-react'
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

  const marqueeContent = (
    <span className="flex items-center gap-8 px-4">
      <Star className="h-5 w-5 fill-comic-yellow shrink-0" />
      MEME GANG
      <Star className="h-5 w-5 fill-comic-pink text-comic-pink shrink-0" />
      FREE SHIPPING ₹999+
      <Star className="h-5 w-5 fill-comic-yellow shrink-0" />
      POW! BAM! WOW!
      <Star className="h-5 w-5 fill-comic-pink text-comic-pink shrink-0" />
      NEW DROPS WEEKLY
      <Star className="h-5 w-5 fill-comic-yellow shrink-0" />
    </span>
  )

  return (
    <>
      {/* HERO — comic splash page */}
      <section className="relative bg-comic-yellow border-b-[3px] border-comic-ink overflow-hidden">
        {/* Animated halftone overlay */}
        <div className="absolute inset-0 halftone opacity-40 pointer-events-none animate-halftone-shift" />
        {/* Diagonal stripes corner — animated */}
        <div className="absolute -top-10 -left-10 w-48 h-48 stripes-black opacity-15 -rotate-12 pointer-events-none animate-stripes-shift" />
        {/* Floating decorations */}
        <div className="hidden lg:block absolute top-12 right-1/2 burst-tag bg-comic-green !text-comic-ink !text-xs animate-float pointer-events-none">
          ZAP!
        </div>
        <div className="hidden lg:block absolute bottom-10 left-[42%] burst-tag bg-comic-blue !text-comic-ink !text-xs animate-bounce-hard pointer-events-none">
          NEW!
        </div>

        <div className="container-custom relative grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in-up relative z-10">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="burst-tag animate-spin-slower">NEW DROP!</span>
              <span className="inline-flex items-center gap-1 bg-comic-blue text-comic-ink font-heading text-sm uppercase tracking-wider px-3 py-1 border-[3px] border-comic-ink shadow-comic-sm animate-shimmy">
                <Zap className="h-4 w-4 animate-ping-comic" strokeWidth={3} /> Hot Off The Press
              </span>
            </div>

            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl tracking-wider text-comic-ink leading-[0.95]">
              <span className="inline-block bg-white border-[4px] border-comic-ink px-3 py-1 shadow-comic-lg -rotate-1 animate-tilt">MEMES</span>
              <br />
              <span className="inline-block mt-3">that hit</span>{' '}
              <span className="inline-block bg-comic-pink text-white border-[4px] border-comic-ink px-3 py-1 shadow-comic-lg rotate-1 animate-wiggle-slow">DIFFERENT!</span>
            </h1>

            <div className="speech-bubble max-w-md animate-bounce-hard">
              <p className="font-bold text-comic-ink text-lg">
                Posters, figurines, books &amp; chaotic stuff for people who live online. Shop the vibe!
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/products" className="btn-comic-pink text-base hover-jiggle" prefetch={true}>
                <Flame className="h-5 w-5 animate-wiggle" strokeWidth={3} />
                Shop The Drop
                <ArrowRight className="h-5 w-5" strokeWidth={3} />
              </Link>
              <Link href="/about" className="btn-comic text-base hover-jiggle" prefetch={true}>
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero Visual — comic panel grid (each panel floats with its own rhythm) */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { rot: '-rotate-3', bg: 'bg-comic-pink', text: 'POW!', anim: 'animate-float', delay: '0s' },
                { rot: 'rotate-2', bg: 'bg-comic-blue', text: 'BAM!', anim: 'animate-float', delay: '-0.8s' },
                { rot: 'rotate-3', bg: 'bg-comic-green', text: 'WOW!', anim: 'animate-float', delay: '-1.6s' },
                { rot: '-rotate-2', bg: 'bg-comic-yellow', text: 'BOOM!', anim: 'animate-float', delay: '-2.4s' },
              ].map((panel, i) => (
                <div
                  key={i}
                  className={`relative aspect-square ${panel.bg} border-[4px] border-comic-ink shadow-comic-lg ${panel.rot} flex items-center justify-center halftone ${panel.anim}`}
                  style={{ animationDelay: panel.delay }}
                >
                  <span className="font-heading text-4xl sm:text-5xl lg:text-6xl text-comic-ink tracking-wider drop-shadow-[3px_3px_0_rgba(255,255,255,0.6)]">
                    {panel.text}
                  </span>
                </div>
              ))}
            </div>
            {/* Big star burst — spins! */}
            <div className="absolute -top-6 -right-4 burst-tag bg-comic-yellow !text-comic-ink !text-base px-6 py-4 animate-spin-slow">
              ON SALE!
            </div>
            {/* Smaller floating star */}
            <div className="absolute -bottom-4 -left-4 burst-tag bg-comic-red !text-white !text-xs animate-bounce-hard">
              HOT!
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE-style strip — actually scrolling now */}
      <section className="bg-comic-ink text-comic-yellow border-b-[3px] border-comic-ink py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap font-heading text-2xl uppercase tracking-widest">
          <div className="flex shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="contents">{marqueeContent}</span>
            ))}
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="contents">{marqueeContent}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products grid */}
      <section className="py-section bg-comic-cream border-b-[3px] border-comic-ink relative overflow-hidden">
        <div className="absolute top-10 left-6 burst-tag bg-comic-blue !text-comic-ink !text-xs animate-spin-slower hidden md:block">
          BANGERS!
        </div>
        <div className="absolute top-20 right-8 burst-tag bg-comic-green !text-comic-ink !text-xs animate-bounce-hard hidden md:block">
          FRESH!
        </div>
        <div className="container-custom relative">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block bg-comic-pink text-white font-heading text-sm uppercase tracking-widest px-4 py-1 border-[3px] border-comic-ink shadow-comic-sm -rotate-2 animate-wiggle">
              Top Tier Picks
            </span>
            <h2 className="font-heading text-5xl sm:text-6xl tracking-wider text-comic-ink animate-fade-in-up">
              FAN FAVORITES!
            </h2>
            <p className="font-bold text-comic-ink max-w-md mx-auto">
              Certified bangers. The stuff your timeline actually wants.
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {products.slice(0, 4).map((product: any, i: number) => (
                <div
                  key={product.id}
                  className="hover-jiggle animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'backwards' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] card-comic animate-pulse" />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/products" className="btn-comic-blue hover-jiggle" prefetch={true}>
              See It All
              <ArrowRight className="h-4 w-4 animate-shimmy" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* Collections from API */}
      {isLoading ? null : collections && collections.length > 0 ? (
        <>
          {collections.slice(0, 2).map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* COMIC PANEL "About" Section — panels jiggle */}
      <section className="py-section bg-comic-pink border-y-[3px] border-comic-ink relative overflow-hidden">
        <div className="absolute inset-0 halftone opacity-30 pointer-events-none animate-halftone-shift" />
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {/* Panel 1 */}
            <div className="card-comic p-6 bg-comic-yellow -rotate-1 hover-jiggle">
              <div className="flex items-center gap-2 mb-3">
                <span className="burst-tag !text-xs !px-2 !py-1 animate-spin-slower inline-block">PANEL 1</span>
              </div>
              <h3 className="font-heading text-3xl tracking-wider mb-2">THE PROBLEM!</h3>
              <p className="font-bold text-comic-ink">
                Boring stores selling boring stuff. Generic templates. No personality. NO FUN!
              </p>
            </div>
            {/* Panel 2 */}
            <div className="card-comic p-6 bg-white rotate-1 hover-jiggle">
              <div className="flex items-center gap-2 mb-3">
                <span className="burst-tag bg-comic-blue !text-xs !px-2 !py-1 animate-spin-slower inline-block" style={{ animationDelay: '-3s' }}>PANEL 2</span>
              </div>
              <h3 className="font-heading text-3xl tracking-wider mb-2">THE PLOT TWIST!</h3>
              <p className="font-bold text-comic-ink">
                We made a store packed with memes, vibes, and stuff that actually slaps. Built for the chronically online.
              </p>
            </div>
            {/* Panel 3 */}
            <div className="card-comic p-6 bg-comic-green -rotate-1 hover-jiggle">
              <div className="flex items-center gap-2 mb-3">
                <span className="burst-tag bg-comic-yellow !text-comic-ink !text-xs !px-2 !py-1 animate-spin-slower inline-block" style={{ animationDelay: '-6s' }}>PANEL 3</span>
              </div>
              <h3 className="font-heading text-3xl tracking-wider mb-2">THE WIN!</h3>
              <p className="font-bold text-comic-ink">
                Fast shipping, ridiculous quality, and a vibe that says "yes, I am that person."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-12 bg-comic-yellow border-b-[3px] border-comic-ink relative overflow-hidden">
        <div className="absolute inset-0 halftone opacity-15 pointer-events-none animate-halftone-shift" />
        <div className="container-custom relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Truck, title: 'Free Shipping', sub: 'On orders over ₹999', bg: 'bg-comic-pink', tc: 'text-white' },
              { Icon: RotateCcw, title: 'Easy Returns', sub: '30-day no-drama policy', bg: 'bg-white', tc: 'text-comic-ink' },
              { Icon: Shield, title: 'Secure Checkout', sub: 'Lock & key vibes only', bg: 'bg-comic-blue', tc: 'text-comic-ink' },
            ].map(({ Icon, title, sub, bg, tc }, i) => (
              <div key={i} className={`flex items-center gap-4 ${bg} ${tc} border-[3px] border-comic-ink p-4 shadow-comic-sm hover-jiggle`}>
                <div className="flex-shrink-0 p-2 border-[3px] border-comic-ink bg-comic-yellow text-comic-ink animate-bounce-hard" style={{ animationDelay: `${i * 0.2}s` }}>
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-heading text-xl uppercase tracking-wide">{title}</p>
                  <p className="text-sm font-bold">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — animated halftone background */}
      <section className="py-section bg-comic-blue border-b-[3px] border-comic-ink relative overflow-hidden">
        <div className="absolute inset-0 halftone opacity-25 pointer-events-none animate-halftone-shift" />
        {/* Floating bursts */}
        <div className="absolute top-10 left-10 burst-tag bg-comic-yellow !text-comic-ink !text-xs animate-float hidden md:block">
          PSST!
        </div>
        <div className="absolute bottom-10 right-12 burst-tag bg-comic-pink !text-white !text-xs animate-float hidden md:block" style={{ animationDelay: '-1.5s' }}>
          DEAL!
        </div>
        <div className="container-custom relative max-w-2xl text-center">
          <span className="burst-tag mb-4 inline-block animate-spin-slow">JOIN US!</span>
          <h2 className="font-heading text-5xl sm:text-6xl tracking-wider text-comic-ink mt-4 animate-fade-in-up">
            DON'T MISS THE DROP!
          </h2>
          <p className="mt-4 font-bold text-comic-ink text-lg">
            New memes, new merch, exclusive deals. Straight to your inbox. No spam — pinky promise.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border-[3px] border-comic-ink bg-white px-4 py-3 text-base font-bold placeholder:text-muted-foreground focus:outline-none focus:shadow-comic-sm transition-shadow"
            />
            <button type="submit" className="btn-comic-pink text-base whitespace-nowrap hover-jiggle">
              Sign Me Up!
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
