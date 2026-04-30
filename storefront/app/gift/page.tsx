'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Gift, Lock, Send, Copy, Check, Sparkles } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'

type Tab = 'create' | 'how' | 'mygifts'

export default function GiftPage() {
  const [tab, setTab] = useState<Tab>('create')
  const { data: products } = useProducts({ limit: 12 })
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')
  const [generated, setGenerated] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const productList = products || []
  const selected = productList[selectedIdx]
  const variant = selected?.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount ?? 0
  const currency = variant?.calculated_price?.currency_code ?? 'inr'

  const formatPrice = (amount: number, c = 'inr') =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: c.toUpperCase(), maximumFractionDigits: 0 }).format(amount)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    const code = Math.random().toString(36).slice(2, 10).toUpperCase()
    setGenerated(`https://yourstore.com/claim/${code}`)
  }

  const copyLink = () => {
    if (!generated) return
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-h-screen pt-12 pb-24">
      <div className="absolute top-32 left-[10%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-white/80 animate-twinkle" style={{ animationDelay: '1s' }} />

      {/* HERO */}
      <section className="container-custom text-center pt-12 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 backdrop-blur-sm mb-8">
          <Gift className="h-3.5 w-3.5 text-red-400" />
          Send a moment
        </div>
        <h1 className="font-heading font-bold tracking-tighter text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
          Gift Links.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Send a gift to anyone with just a link. They pick the size, you pick the moment. No address required up front.
        </p>

        {/* Demo notice */}
        <div className="mt-8 max-w-3xl mx-auto px-5 py-3 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
          <p className="text-xs sm:text-sm text-yellow-200/80">
            <span className="font-semibold">Preview mode:</span> Generate a sample gift link to see how it works. Real gift checkouts go live soon.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 inline-flex items-center bg-white/[0.03] border border-white/10 rounded-full p-1.5 backdrop-blur-md">
          {([
            { id: 'create' as Tab, label: 'Create Gift' },
            { id: 'how' as Tab, label: 'How it works' },
            { id: 'mygifts' as Tab, label: 'My Gifts' },
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
      <section className="container-custom max-w-3xl">
        {tab === 'create' && (
          <form onSubmit={handleGenerate} className="card-aura p-6 sm:p-10">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-8">Create Gift Link</h2>

            {/* Step 1: select product */}
            <div className="mb-8">
              <label className="block text-sm text-white/60 mb-3">Select a product</label>
              {productList.length > 0 ? (
                <div className="card-aura p-6 sm:p-8 bg-white/[0.02]">
                  <div className="flex flex-col items-center text-center">
                    {/* Selected product card with arrows */}
                    <div className="flex items-center gap-3 sm:gap-6 w-full">
                      <button
                        type="button"
                        onClick={() => setSelectedIdx((selectedIdx - 1 + productList.length) % productList.length)}
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                        aria-label="Previous"
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                      </button>

                      <div className="flex-1 flex flex-col items-center relative">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-white/[0.04] border border-white/15">
                          {selected?.thumbnail ? (
                            <Image src={selected.thumbnail} alt={selected.title} fill className="object-cover" sizes="160px" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black" />
                          )}
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" strokeWidth={3} />
                          </div>
                        </div>
                        <p className="mt-4 font-semibold text-white text-base">{selected?.title}</p>
                        <p className="text-xs text-white/50 mt-1">{formatPrice(price, currency)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedIdx((selectedIdx + 1) % productList.length)}
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                        aria-label="Next"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Pagination dots */}
                    <div className="flex gap-1.5 mt-6">
                      {productList.slice(0, Math.min(productList.length, 6)).map((_p: any, i: number) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedIdx(i)}
                          className={`h-1.5 rounded-full transition-all ${i === selectedIdx ? 'w-6 bg-red-400' : 'w-1.5 bg-white/20'}`}
                          aria-label={`Go to product ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-aura p-8 text-center text-white/40 text-sm">No products available yet.</div>
              )}
            </div>

            {/* Step 2: recipient */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">Recipient&apos;s name <span className="text-white/30">(optional)</span></label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priya"
                className="w-full rounded-full bg-white/[0.04] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Step 3: message */}
            <div className="mb-8">
              <label className="block text-sm text-white/60 mb-2">A short note <span className="text-white/30">(optional)</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Happy birthday — picked this one with you in mind."
                className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] transition-all resize-none"
              />
            </div>

            <button type="submit" className="w-full btn-pill-red justify-center text-base py-4">
              <Send className="h-4 w-4" />
              Generate Gift Link
            </button>

            {/* Generated link */}
            {generated && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 animate-fade-in">
                <p className="text-xs uppercase tracking-[0.2em] text-red-400 mb-2 font-medium flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Secret link ready
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs sm:text-sm text-white font-mono bg-black/30 rounded-lg px-3 py-2 truncate">
                    {generated}
                  </code>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="flex-shrink-0 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="mt-3 text-xs text-white/50">
                  Share this link with {recipientName || 'your recipient'}. They&apos;ll claim the gift, pick a size, and we&apos;ll ship it.
                </p>
              </div>
            )}
          </form>
        )}

        {tab === 'how' && (
          <div className="space-y-4">
            {[
              { step: '01', title: 'Pick a product', desc: 'Choose anything from the catalog. Set the variant or let them pick.' },
              { step: '02', title: 'Add a personal note', desc: 'Drop a line for the recipient — birthday, milestone, just because.' },
              { step: '03', title: 'Share the secret link', desc: 'Send via WhatsApp, email, or wherever. Only the holder can claim.' },
              { step: '04', title: 'They claim, we ship', desc: 'Recipient enters their address, picks size, and we deliver. Easy.' },
            ].map((item) => (
              <div key={item.step} className="card-aura p-6 flex items-start gap-5">
                <p className="font-heading font-bold text-4xl bg-gradient-to-b from-red-400 to-red-700 bg-clip-text text-transparent flex-shrink-0">
                  {item.step}
                </p>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'mygifts' && (
          <div className="card-aura p-12 text-center">
            <Sparkles className="h-10 w-10 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-heading font-bold text-xl text-white mb-2">No gifts sent yet</h3>
            <p className="text-white/50 mb-8 max-w-sm mx-auto">Once you send a gift, it&apos;ll show up here so you can track when it&apos;s claimed.</p>
            <button
              type="button"
              onClick={() => setTab('create')}
              className="btn-pill-red"
            >
              Send your first gift
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
