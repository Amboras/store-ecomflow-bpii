'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Collections', href: '/collections' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [
    { label: 'About', href: '/about' },
  ]
  if (policies?.privacy_policy) companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  if (policies?.terms_of_service) companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  if (policies?.refund_policy) companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  if (policies?.cookie_policy) companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })

  return (
    <footer className="border-t-[3px] border-comic-ink bg-comic-ink text-comic-yellow relative overflow-hidden">
      {/* Marquee strip on top — actually scrolls */}
      <div className="bg-comic-pink text-white border-b-[3px] border-comic-ink py-2 overflow-hidden">
        <div className="flex animate-marquee-reverse whitespace-nowrap font-heading text-lg uppercase tracking-widest">
          <div className="flex shrink-0 items-center gap-6 pr-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                <Star className="h-4 w-4 fill-white" />
                MEMEMART <Star className="h-4 w-4 fill-white" />
                POW! <Star className="h-4 w-4 fill-white" />
                BAM! <Star className="h-4 w-4 fill-white" />
                WOW!
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                <Star className="h-4 w-4 fill-white" />
                MEMEMART <Star className="h-4 w-4 fill-white" />
                POW! <Star className="h-4 w-4 fill-white" />
                BAM! <Star className="h-4 w-4 fill-white" />
                WOW!
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 halftone-yellow opacity-10 pointer-events-none animate-halftone-shift" />

      <div className="container-custom relative py-section-sm">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="inline-block font-heading text-3xl bg-comic-pink text-white border-[3px] border-comic-yellow px-4 py-1 -rotate-2 tracking-wider">
                MEMEMART!
              </span>
            </Link>
            <p className="mt-4 text-sm font-bold leading-relaxed max-w-xs text-comic-yellow/90">
              The only store on the internet built for chronically online legends. Memes, merch, mayhem.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading text-xl tracking-wider mb-4 text-comic-pink">★ Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-bold text-comic-yellow/90 hover:text-comic-pink transition-colors">
                    » {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-heading text-xl tracking-wider mb-4 text-comic-blue">★ Help</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-bold text-comic-yellow/90 hover:text-comic-blue transition-colors">
                    » {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading text-xl tracking-wider mb-4 text-comic-green">★ Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-bold text-comic-yellow/90 hover:text-comic-green transition-colors">
                    » {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t-[3px] border-comic-yellow flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-comic-yellow/80">
            &copy; {new Date().getFullYear()} MEMEMART. All rights reserved. Made with chaos.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs font-bold text-comic-yellow/80 hover:text-comic-pink transition-colors"
            >
              Manage Cookies
            </button>
            <span className="text-xs font-bold text-comic-yellow/80">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
