'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, RotateCcw, Shield, Sparkles, Star, Truck } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import ProductCard from '@/components/product/product-card'
import { useCollections } from '@/hooks/use-collections'
import { useProducts } from '@/hooks/use-products'

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount)

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const { data: products } = useProducts({ limit: 8 })
  const [email, setEmail] = useState('')

  const featuredProduct = products?.find((product: any) => product.thumbnail) || products?.[0]
  const featuredVariant = featuredProduct?.variants?.[0]
  const featuredPrice = featuredVariant?.calculated_price?.calculated_amount
  const featuredCurrency = featuredVariant?.calculated_price?.currency_code || 'inr'

  const spotlightProducts = (products || []).filter((product: any) => product.id !== featuredProduct?.id).slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,196,92,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(131,97,55,0.22),transparent_28%)]" />
        <div className="container-custom relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[#f6d79b]">
              Fresh look for ecomflow-bpii
            </span>
            <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              A richer storefront with a calm luxury feel.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Warm metallic accents, softer contrast, and a cleaner shopping flow that keeps the focus on your products.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-pill-gold" prefetch={true}>
                Shop all products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections" className="btn-pill" prefetch={true}>
                Explore collections
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Shipping', value: 'Free over ₹999' },
                { label: 'Dispatch', value: 'Fast all-India delivery' },
                { label: 'Support', value: 'Easy returns' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-[#f4ca76]/20 blur-3xl sm:block" />
            <div className="absolute -right-10 bottom-8 hidden h-40 w-40 rounded-full bg-[#9d6f35]/20 blur-3xl sm:block" />
            <div className="grid gap-4 sm:grid-cols-[0.7fr_1fr]">
              <div className="order-2 grid gap-4 sm:order-1">
                {spotlightProducts.slice(0, 2).map((product: any, index: number) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                    prefetch={true}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-white/5">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes={index === 0 ? '240px' : '220px'}
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(246,196,92,0.18),rgba(255,255,255,0.04))]" />
                      )}
                    </div>
                    <div className="px-1 pb-1 pt-4">
                      <p className="line-clamp-1 text-sm font-medium text-white">{product.title}</p>
                      {product.variants?.[0]?.calculated_price?.calculated_amount !== undefined && (
                        <p className="mt-1 text-sm text-[#f6d79b]">
                          {formatPrice(
                            product.variants[0].calculated_price.calculated_amount,
                            product.variants[0].calculated_price.currency_code || 'inr'
                          )}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="order-1 sm:order-2">
                <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#120f0a] p-4 shadow-[0_30px_90px_-35px_rgba(246,196,92,0.45)]">
                  <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white/5">
                    {featuredProduct?.thumbnail ? (
                      <Image
                        src={featuredProduct.thumbnail}
                        alt={featuredProduct.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 520px"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(145deg,rgba(246,196,92,0.18),rgba(255,255,255,0.05))]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                      <Star className="h-3.5 w-3.5 fill-[#f6d79b] text-[#f6d79b]" />
                      Editor&apos;s pick
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/55">Featured right now</p>
                      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{featuredProduct?.title || 'Your next bestseller'}</p>
                      {featuredPrice !== undefined && (
                        <p className="mt-3 text-lg font-medium text-[#f6d79b]">{formatPrice(featuredPrice, featuredCurrency)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-sm">
        <div className="container-custom grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Truck,
              title: 'Fast delivery across India',
              text: 'A simpler promise bar that quickly reassures new shoppers.',
            },
            {
              icon: Shield,
              title: 'Confident checkout experience',
              text: 'Cleaner spacing and softer tones help the buying journey feel premium.',
            },
            {
              icon: RotateCcw,
              title: 'Easy after-purchase support',
              text: 'Policies and next steps now feel easier to scan at a glance.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f6d79b]/20 bg-[#f6d79b]/10 text-[#f6d79b]">
                <item.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-section">
        <div className="container-custom">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#f6d79b]">Best sellers</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Clean product cards. Stronger first impression.
              </h2>
            </div>
            <Link href="/products" className="text-sm text-white/60 transition-colors hover:text-white" prefetch={true}>
              View full catalog
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {products.slice(0, 4).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-[3/4] rounded-[28px] border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
          )}
        </div>
      </section>

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

      <section className="py-section">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(246,196,92,0.08))] p-8 sm:p-10">
              <p className="text-xs uppercase tracking-[0.24em] text-[#f6d79b]">What changed</p>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Dark, refined, and easier to shop.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                I shifted the storefront toward a polished editorial style with premium gold highlights, calmer spacing, and more visual focus around featured products and collections.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  'Softer premium color palette',
                  'Sharper hero section with product spotlight',
                  'More elegant header and footer styling',
                  'Improved visual rhythm on mobile and desktop',
                ].map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
              <Sparkles className="h-6 w-6 text-[#f6d79b]" strokeWidth={1.7} />
              <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-white">Join the list</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Invite shoppers back for launches, restocks, and festive offers with a cleaner signup area.
              </p>
              <form
                className="mt-8 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  setEmail('')
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#f6d79b]/50 focus:outline-none"
                  required
                />
                <button type="submit" className="btn-pill-gold w-full justify-center">
                  Stay updated
                </button>
              </form>
              <p className="mt-4 text-xs text-white/35">Perfect for new drops, gifting moments, and festive campaigns.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
