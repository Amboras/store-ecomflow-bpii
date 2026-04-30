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
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/50 group-hover:text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <div className="text-sm text-white/60 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description }: ProductAccordionProps) {
  return (
    <div className="border-t border-white/10">
      {description && (
        <AccordionItem title="Description" defaultOpen>
          <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
        </AccordionItem>
      )}

      <AccordionItem title="Shipping & Returns">
        <ul className="space-y-2 list-none pl-0">
          <li>· Free standard shipping on orders over ₹2000</li>
          <li>· Express shipping available at checkout</li>
          <li>· Free returns within 30 days of delivery</li>
          <li>· Items must be in original condition</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Care Instructions">
        <ul className="space-y-2 list-none pl-0">
          <li>· Refer to the care label on the product</li>
          <li>· Store in a cool, dry place</li>
          <li>· Handle with care to keep your item in mint condition</li>
        </ul>
      </AccordionItem>
    </div>
  )
}
