'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogIn } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import CartDrawer from '@/components/cart/cart-drawer'
import { useCollections } from '@/hooks/use-collections'

export default function Header() {
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: collections } = useCollections()

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Focus close button when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileMenuCloseRef.current?.focus()
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  // Focus trap for mobile menu
  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !mobileMenuRef.current) return
    const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b-[3px] border-comic-ink transition-all duration-300 ${
          isScrolled ? 'bg-comic-yellow shadow-comic-sm' : 'bg-comic-yellow'
        }`}
      >
        <div className="container-custom">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 lg:hidden border-[3px] border-comic-ink bg-white shadow-comic-sm hover:-translate-y-0.5 transition-transform"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="inline-block font-heading text-3xl sm:text-4xl bg-comic-pink text-white border-[3px] border-comic-ink px-4 py-1 shadow-comic-sm -rotate-2 group-hover:rotate-0 transition-transform tracking-wider">
                MEMEMART!
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                href="/products"
                className="font-heading text-lg uppercase tracking-wide px-3 py-1 border-[3px] border-transparent hover:border-comic-ink hover:bg-white transition-colors"
                prefetch={true}
              >
                Shop All
              </Link>
              {collections?.slice(0, 3).map((collection: any) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="font-heading text-lg uppercase tracking-wide px-3 py-1 border-[3px] border-transparent hover:border-comic-ink hover:bg-white transition-colors"
                  prefetch={true}
                >
                  {collection.title}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="p-2 border-[3px] border-comic-ink bg-white shadow-comic-sm hover:-translate-y-0.5 transition-transform"
                aria-label="Search"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/auth/login'}
                className="p-2 border-[3px] border-comic-ink bg-white shadow-comic-sm hover:-translate-y-0.5 transition-transform hidden sm:block"
                aria-label={isLoggedIn ? 'Account' : 'Sign in'}
              >
                {isLoggedIn ? <User className="h-4 w-4" strokeWidth={2.5} /> : <LogIn className="h-4 w-4" strokeWidth={2.5} />}
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 border-[3px] border-comic-ink bg-comic-pink text-white shadow-comic-sm hover:-translate-y-0.5 transition-transform"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-comic-yellow border-2 border-comic-ink text-[10px] font-bold text-comic-ink">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleMobileMenuKeyDown}
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-comic-yellow border-r-[3px] border-comic-ink animate-slide-in-right"
          >
            <div className="flex items-center justify-between p-4 border-b-[3px] border-comic-ink bg-comic-pink text-white">
              <span className="font-heading text-2xl tracking-wider">MENU!</span>
              <button
                ref={mobileMenuCloseRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border-[3px] border-comic-ink bg-white text-comic-ink"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 font-heading text-xl uppercase tracking-wide bg-white border-[3px] border-comic-ink shadow-comic-sm"
                prefetch={true}
              >
                Shop All
              </Link>
              {collections?.map((collection: any) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 font-heading text-xl uppercase tracking-wide bg-white border-[3px] border-comic-ink shadow-comic-sm"
                  prefetch={true}
                >
                  {collection.title}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href={isLoggedIn ? '/account' : '/auth/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-4 font-bold uppercase tracking-wide text-comic-ink"
                >
                  {isLoggedIn ? '★ Account' : '★ Sign In'}
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-4 font-bold uppercase tracking-wide text-comic-ink"
                >
                  ★ Search
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
