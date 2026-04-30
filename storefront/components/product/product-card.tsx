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

  const currency = calculatedPrice?.currency_code || 'usd'
  const currentAmount = calculatedPrice?.calculated_amount
  const ext = variant?.id ? variantExtensions?.[variant.id] : null

  const soldOut = isProductSoldOut(product.variants || [], variantExtensions)
  const onSale = ext?.compare_at_price && currentAmount && ext.compare_at_price > currentAmount

  return (
    <Link href={`/products/${product.handle}`} className="group block" prefetch={true}>
      <div className="card-comic bg-white overflow-hidden hover:-translate-y-1 hover:shadow-comic-lg transition-all duration-150">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-comic-cream border-b-[3px] border-comic-ink">
          <Image
            src={getProductImage(product.thumbnail, product.id)}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${soldOut ? 'opacity-50' : ''}`}
          />
          {soldOut && (
            <div className="absolute top-2 left-2 bg-comic-ink text-comic-yellow font-heading text-sm uppercase tracking-wider px-3 py-1 border-[3px] border-comic-ink shadow-comic-sm">
              Sold Out!
            </div>
          )}
          {!soldOut && onSale && (
            <div className="absolute top-2 right-2 burst-tag !text-xs">SALE!</div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 space-y-1.5 bg-white">
          <h3 className={`font-heading text-lg sm:text-xl tracking-wide line-clamp-1 ${soldOut ? 'text-muted-foreground' : 'text-comic-ink'}`}>
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
