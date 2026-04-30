'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

// Helper: extract price amount from calculated_price object
function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  // Medusa Admin API returns variant.options as VariantOption[] (the `options`
  // relation expanded), but the SDK's generic ProductVariant type declares it
  // as Record<string, string>. Cast here so the rest of the component can use
  // the actual runtime shape.
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  // Track selected value per option: { "opt_xxx": "S", "opt_yyy": "Black" }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  // Find variant matching all selected options
  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]

    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  // Extension data for selected variant (compare-at + inventory)
  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const manageInventory = ext?.manage_inventory ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = manageInventory && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = manageInventory && inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 10

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  // Should we show variant selectors?
  const hasMultipleVariants = variants.length > 1

  return (
    <div className="space-y-6">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Option Selectors */}
      {hasMultipleVariants && options.map((option: ProductOptionWithValues) => {
        // option.values is an array of { id, value, ... } objects
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        // Skip if only "One Size" or "Default"
        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        return (
          <div key={optionId}>
            <h3 className="text-sm font-heading uppercase tracking-wide text-comic-ink mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 text-comic-pink">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value

                // Check availability: is there a variant with this option value that's in stock?
                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt?.manage_inventory) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`min-w-[52px] px-4 py-2.5 text-sm font-heading uppercase tracking-wide border-[3px] border-comic-ink transition-all duration-150 ${
                      isSelected
                        ? 'bg-comic-ink text-comic-yellow shadow-comic-sm -translate-x-0.5 -translate-y-0.5'
                        : isAvailable
                        ? 'bg-white text-comic-ink hover:-translate-y-0.5 hover:shadow-comic-sm'
                        : 'bg-comic-cream text-comic-ink/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Low Stock Warning */}
      {isLowStock && (
        <div className="inline-block bg-comic-red text-white border-[3px] border-comic-ink shadow-comic-sm px-3 py-1.5 font-heading uppercase tracking-wide text-xs animate-pulse">
          ⚡ Only {inventoryQuantity} left! ⚡
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        <div className="flex items-center border-[3px] border-comic-ink bg-white shadow-comic-sm">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-comic-yellow transition-colors disabled:opacity-30"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4 text-comic-ink" strokeWidth={3} />
          </button>
          <span className="w-12 text-center text-base font-heading tabular-nums text-comic-ink border-x-[3px] border-comic-ink py-2">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-comic-yellow transition-colors disabled:opacity-30"
            disabled={isOutOfStock || (inventoryQuantity != null && quantity >= inventoryQuantity)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4 text-comic-ink" strokeWidth={3} />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-heading uppercase tracking-wide text-base border-[3px] border-comic-ink transition-all duration-150 ${
            isOutOfStock
              ? 'bg-comic-cream text-comic-ink/50 cursor-not-allowed'
              : justAdded
              ? 'bg-comic-green text-comic-ink shadow-comic'
              : isAddingItem
              ? 'bg-comic-yellow text-comic-ink shadow-comic-sm'
              : 'bg-comic-pink text-white shadow-comic hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-comic-lg active:translate-x-1 active:translate-y-1 active:shadow-none'
          }`}
        >
          {isAddingItem ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
              Adding...
            </>
          ) : justAdded ? (
            <>
              <Check className="h-5 w-5" strokeWidth={3} />
              Added!
            </>
          ) : isOutOfStock ? (
            'Sold Out!'
          ) : (
            <>
              <Zap className="h-5 w-5" strokeWidth={2.5} fill="currentColor" />
              Add to Bag!
            </>
          )}
        </button>
      </div>
    </div>
  )
}
