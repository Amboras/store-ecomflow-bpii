'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b-[3px] border-comic-ink last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left group"
      >
        <span className="font-heading uppercase tracking-wide text-base text-comic-ink group-hover:text-comic-pink transition-colors">
          {title}
        </span>
        <span
          className={`inline-flex items-center justify-center h-7 w-7 bg-comic-ink text-comic-yellow border-[2px] border-comic-ink transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={3} />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-sm text-comic-ink leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description }: ProductAccordionProps) {
  return (
    <div className="border-t-[3px] border-comic-ink">
      {description && (
        <AccordionItem title="The Story" defaultOpen>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionItem>
      )}

      <AccordionItem title="Shipping & Returns">
        <ul className="space-y-2 list-none pl-0">
          <li>★ Free standard shipping on orders over ₹2000</li>
          <li>★ Express shipping available at checkout</li>
          <li>★ Free returns within 30 days of delivery</li>
          <li>★ Items must be in original condition</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Care Instructions">
        <ul className="space-y-2 list-none pl-0">
          <li>★ Please refer to the care label on the product</li>
          <li>★ Store in a cool, dry place away from direct sunlight</li>
          <li>★ Handle with care to keep your hero in mint condition</li>
        </ul>
      </AccordionItem>
    </div>
  )
}
