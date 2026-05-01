import WAButton from '@/components/user/WAButton'
import ProductCard from '@/components/user/ProductCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/products/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

async function getSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/settings`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/products?category=${categoryId}`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.filter((p: any) => p._id !== excludeId).slice(0, 4)
  } catch { return [] }
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, settings] = await Promise.all([getProduct(id), getSettings()])
  if (!product) notFound()

  const whatsapp = settings?.whatsappNumber || '6281234567890'
  const relatedProducts = product.categoryId?._id
    ? await getRelatedProducts(product.categoryId._id, product._id)
    : []

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '16px 20px' }}>
        <div className="container-main" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Beranda</Link>
          <span>/</span>
          <Link href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Produk</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Detail produk */}
      <div className="container-main" style={{ padding: '48px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>
          {/* Gambar */}
          <div style={{ background: 'var(--bg-2)', borderRadius: 24, overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            {product.image
              ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 80, opacity: 0.25 }}>📦</span>
            }
          </div>

          {/* Info */}
          <div style={{ paddingTop: 8 }}>
            {product.categoryId?.name && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)', display: 'inline-block', marginBottom: 16 }}
              >
                {product.categoryId.name}
              </span>
            )}

            <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400, lineHeight: 1.25, marginBottom: 16 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 24 }}>
              {formatRupiah(product.price)}
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 24 }} />

            {product.description && (
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32, whiteSpace: 'pre-wrap' }}>
                {product.description}
              </p>
            )}

            <WAButton
              phone={whatsapp}
              productName={product.name}
              label="Pesan Sekarang"
              size="lg"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Produk lainnya */}
      {relatedProducts.length > 0 && (
        <div style={{ background: 'var(--bg-2)', padding: '60px 20px', borderTop: '1px solid var(--border)' }}>
          <div className="container-main">
            <h2 className="serif" style={{ fontSize: '1.8rem', fontWeight: 400, marginBottom: 32 }}>Produk Lainnya</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {relatedProducts.map((p: any) => (
                <ProductCard key={p._id} product={p} whatsappNumber={whatsapp} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
