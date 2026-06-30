'use client'

import Link from 'next/link'
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
    { label: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks = [{ label: 'About', href: '/about' }]
  if (policies?.privacy_policy) companyLinks.push({ label: 'Privacy Policy', href: '/privacy' })
  if (policies?.terms_of_service) companyLinks.push({ label: 'Terms of Service', href: '/terms' })
  if (policies?.refund_policy) companyLinks.push({ label: 'Refund Policy', href: '/refund-policy' })
  if (policies?.cookie_policy) companyLinks.push({ label: 'Cookie Policy', href: '/cookie-policy' })

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080706]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f6d79b]/40 to-transparent" />
      <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#f6d79b]/10 blur-3xl" />

      <div className="container-custom relative py-section-sm">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f6d79b]/20 bg-[#f6d79b]/10 text-sm font-semibold tracking-[0.18em] text-[#f6d79b]">
                E
              </span>
              <div>
                <p className="font-heading text-2xl font-semibold tracking-[0.18em] text-white">ECOMFLOW</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Curated essentials</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Thoughtful products, polished presentation, and a shopping experience designed to feel elevated from the first click.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-sm font-semibold uppercase tracking-[0.24em] text-white/40">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-sm font-semibold uppercase tracking-[0.24em] text-white/40">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-sm font-semibold uppercase tracking-[0.24em] text-white/40">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            © {new Date().getFullYear()} ECOMFLOW. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white"
            >
              Manage Cookies
            </button>
            <span className="text-xs uppercase tracking-[0.18em] text-white/25">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
