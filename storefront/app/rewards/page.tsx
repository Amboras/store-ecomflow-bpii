'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Crown, Sparkles, Vote, Check, X } from 'lucide-react'

type Tab = 'tiers' | 'proposals' | 'history'

const TIERS = [
  {
    name: 'Insider',
    price: 'Free',
    perks: ['Early drops access', 'Free shipping over ₹999', 'Members-only newsletter'],
    color: 'from-white/10 to-transparent',
    badge: 'text-white/60',
  },
  {
    name: 'Crew',
    price: '5,000 pts',
    perks: ['Everything in Insider', '10% off all products', 'First-look at new collections', 'Birthday surprise'],
    color: 'from-red-500/20 via-red-500/5 to-transparent',
    badge: 'text-red-400',
    featured: true,
  },
  {
    name: 'Inner Circle',
    price: '20,000 pts',
    perks: ['Everything in Crew', '20% off all products', 'Free express shipping', 'Vote on next drops', 'Annual gift box'],
    color: 'from-yellow-500/15 via-yellow-500/5 to-transparent',
    badge: 'text-yellow-400',
  },
]

const PROPOSALS = [
  { id: 'P-101', title: 'Add a sustainable packaging upgrade', votes: { yes: 1245, no: 87 }, status: 'Active' as const, ends: '3d 12h' },
  { id: 'P-100', title: 'Launch a limited edition holiday collection', votes: { yes: 982, no: 213 }, status: 'Active' as const, ends: '5d 2h' },
  { id: 'P-099', title: 'Open weekend pop-up in Bengaluru', votes: { yes: 670, no: 451 }, status: 'Closed' as const, ends: 'Ended' },
]

export default function RewardsPage() {
  const [tab, setTab] = useState<Tab>('tiers')
  const [voted, setVoted] = useState<Record<string, 'yes' | 'no' | undefined>>({})

  return (
    <div className="relative min-h-screen pt-12 pb-24">
      <div className="absolute top-32 left-[10%] w-1 h-1 rounded-full bg-white/60 animate-twinkle" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-white/80 animate-twinkle" style={{ animationDelay: '1s' }} />

      {/* HERO */}
      <section className="container-custom text-center pt-12 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 backdrop-blur-sm mb-8">
          <Crown className="h-3.5 w-3.5 text-red-400" />
          Members-only
        </div>
        <h1 className="font-heading font-bold tracking-tighter text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
          Rewards.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Every purchase earns points. Every member shapes what we make next. The more you shop, the more you decide.
        </p>

        <div className="mt-10 inline-flex items-center bg-white/[0.03] border border-white/10 rounded-full p-1.5 backdrop-blur-md">
          {([
            { id: 'tiers' as Tab, label: 'Tiers' },
            { id: 'proposals' as Tab, label: 'Member Voting' },
            { id: 'history' as Tab, label: 'Activity' },
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

      <section className="container-custom">
        {tab === 'tiers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative card-aura p-6 sm:p-8 bg-gradient-to-b ${tier.color} ${tier.featured ? 'lg:scale-105 border-red-500/30 shadow-[0_20px_60px_-20px_rgba(239,68,68,0.4)]' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white text-[10px] uppercase tracking-wider font-semibold">
                    Most Popular
                  </div>
                )}
                <p className={`text-xs uppercase tracking-[0.2em] font-medium ${tier.badge}`}>{tier.name}</p>
                <p className="mt-3 font-heading font-bold text-4xl text-white">{tier.price}</p>
                <div className="mt-6 space-y-2.5">
                  {tier.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/auth/register"
                  prefetch={true}
                  className={`mt-8 w-full justify-center ${tier.featured ? 'btn-pill-red' : 'btn-pill'}`}
                >
                  Join now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {tab === 'proposals' && (
          <div className="max-w-3xl mx-auto">
            <div className="card-aura p-5 mb-6 flex items-center gap-4 bg-gradient-to-r from-red-500/10 to-transparent border-red-500/20">
              <Vote className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-white/70">
                <span className="font-semibold text-white">You hold 0 votes.</span> Make your first purchase to earn voting power on what we launch next.
              </p>
            </div>

            <div className="space-y-4">
              {PROPOSALS.map((p) => {
                const total = p.votes.yes + p.votes.no
                const yesPct = Math.round((p.votes.yes / total) * 100)
                const userVote = voted[p.id]
                return (
                  <div key={p.id} className="card-aura p-6">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">{p.id}</p>
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-white">{p.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                        p.status === 'Active' ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-white/50 bg-white/[0.04] border-white/15'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    {/* Vote bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400 font-medium">Yes {yesPct}%</span>
                        <span className="text-white/40">{total.toLocaleString()} votes</span>
                        <span className="text-red-400 font-medium">No {100 - yesPct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
                        <div className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000" style={{ width: `${yesPct}%` }} />
                        <div className="bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000" style={{ width: `${100 - yesPct}%` }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-xs text-white/40">Ends in <span className="text-white/70 font-medium">{p.ends}</span></p>
                      {p.status === 'Active' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setVoted({ ...voted, [p.id]: 'yes' })}
                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                              userVote === 'yes'
                                ? 'bg-green-500/20 border-green-500/40 text-green-300'
                                : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.08]'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Yes
                          </button>
                          <button
                            onClick={() => setVoted({ ...voted, [p.id]: 'no' })}
                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                              userVote === 'no'
                                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.08]'
                            }`}
                          >
                            <X className="h-3.5 w-3.5" />
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="card-aura p-12 text-center max-w-xl mx-auto">
            <Sparkles className="h-10 w-10 text-red-400 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-heading font-bold text-xl text-white mb-2">No activity yet</h3>
            <p className="text-white/50 mb-8 max-w-sm mx-auto">Sign in to see your points, rewards earned, and votes cast.</p>
            <Link href="/auth/login" className="btn-pill-red inline-flex" prefetch={true}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
