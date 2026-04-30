import { formatPrice } from '@/lib/utils/format-price'

export interface VariantExtension {
  compare_at_price: number | null
  manage_inventory: boolean
  inventory_quantity: number | null
}

interface ProductPriceProps {
  amount: number | null
  currency: string
  compareAtPrice?: number | null
  soldOut?: boolean
  size?: 'card' | 'detail'
}

export default function ProductPrice({
  amount,
  currency,
  compareAtPrice,
  soldOut = false,
  size = 'card',
}: ProductPriceProps) {
  if (amount == null) return null

  const formattedPrice = formatPrice(amount, currency)
  const hasDiscount = compareAtPrice != null && compareAtPrice > amount
  const formattedCompareAt = hasDiscount ? formatPrice(compareAtPrice, currency) : null

  const isCard = size === 'card'

  if (soldOut) {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`${isCard ? 'text-sm' : 'text-xl font-medium'} text-white/30 line-through`}>
          {formattedPrice}
        </span>
        <span className={`${isCard ? 'text-xs' : 'text-sm'} text-white/40 uppercase tracking-wider`}>
          Sold out
        </span>
      </div>
    )
  }

  if (hasDiscount) {
    return (
      <div className="flex items-baseline gap-2">
        <span className={`${isCard ? 'text-xs' : 'text-lg'} text-white/40 line-through`}>
          {formattedCompareAt}
        </span>
        <span className={`${isCard ? 'text-sm' : 'text-2xl'} font-semibold text-red-400`}>
          {formattedPrice}
        </span>
      </div>
    )
  }

  return (
    <span className={`${isCard ? 'text-sm text-white/70' : 'text-2xl font-semibold text-white'}`}>
      {formattedPrice}
    </span>
  )
}

/**
 * Check if ALL variants of a product are sold out based on extension data.
 */
export function isProductSoldOut(
  variants: any[],
  variantExtensions?: Record<string, VariantExtension>,
): boolean {
  if (!variantExtensions || variants.length === 0) return false
  return variants.every((v: any) => {
    const ext = variantExtensions[v.id]
    if (!ext) return false
    return ext.manage_inventory && ext.inventory_quantity != null && ext.inventory_quantity <= 0
  })
}
