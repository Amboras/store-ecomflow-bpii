import Image from 'next/image'
import Link from 'next/link'
import { getProductImage } from '@/lib/utils/placeholder-images'
import ProductPrice, { isProductSoldOut, type VariantExtension } from './product-price'

interface ProductCardProps {
  product: any
  variantExtensions?: Record<string, VariantExtension>
}

export default function ProductCard({ product, variantExtensions }: ProductCardProps) {
  const variant = product.variants?.[0]
  const calculatedPrice = variant?.calculated_price

  const currency = calculatedPrice?.currency_code || 'inr'
  const currentAmount = calculatedPrice?.calculated_amount
  const ext = variant?.id ? variantExtensions?.[variant.id] : null

  const soldOut = isProductSoldOut(product.variants || [], variantExtensions)
  const onSale = ext?.compare_at_price && currentAmount && ext.compare_at_price > currentAmount

  return (
    <Link href={`/products/${product.handle}`} className="group block" prefetch={true}>
      <div className="relative card-aura overflow-hidden hover:-translate-y-1 transition-all duration-500 hover:shadow-glow-red">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
          <Image
            src={getProductImage(product.thumbnail, product.id)}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${soldOut ? 'opacity-40' : ''}`}
          />
          {/* Subtle bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {soldOut && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-[10px] uppercase tracking-wider text-white">
              Sold out
            </div>
          )}
          {!soldOut && onSale && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500/90 border border-red-400/40 backdrop-blur-md text-[10px] uppercase tracking-wider font-medium text-white shadow-glow-red">
              Sale
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-1.5">
          <h3 className={`text-sm sm:text-base font-medium line-clamp-1 ${soldOut ? 'text-white/40' : 'text-white'}`}>
            {product.title}
          </h3>
          <ProductPrice
            amount={currentAmount}
            currency={currency}
            compareAtPrice={ext?.compare_at_price}
            soldOut={soldOut}
            size="card"
          />
        </div>
      </div>
    </Link>
  )
}
