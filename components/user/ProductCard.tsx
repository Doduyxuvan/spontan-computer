import Link from 'next/link'
import WAButton from './WAButton'

interface Product {
  _id: string
  name: string
  price: number
  description?: string
  image?: string
  categoryId?: { name: string } | null
}

interface ProductCardProps {
  product: Product
  whatsappNumber: string
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  return (
    <div className="product-card flex flex-col">
      <Link href={`/products/${product._id}`} className="block">
        <div
          className="w-full aspect-square flex items-center justify-center"
          style={{ background: 'var(--bg-2)' }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span style={{ fontSize: 48, opacity: 0.3 }}>📦</span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {product.categoryId?.name && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full w-fit"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {product.categoryId.name}
          </span>
        )}

        <Link href={`/products/${product._id}`}>
          <h3 className="font-bold text-base leading-snug hover:text-accent transition-colors" style={{ color: 'var(--text)' }}>
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {product.description}
          </p>
        )}

        <p className="font-bold text-lg mt-auto" style={{ color: 'var(--accent)' }}>
          {formatRupiah(product.price)}
        </p>

        <WAButton
          phone={whatsappNumber}
          productName={product.name}
          size="sm"
          fullWidth
        />
      </div>
    </div>
  )
}
