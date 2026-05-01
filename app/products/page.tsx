'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/user/ProductCard'

interface Category { _id: string; name: string }
interface Product { _id: string; name: string; price: number; description?: string; image?: string; categoryId?: { _id: string; name: string } | null }

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ width: '100%', aspectRatio: '1', background: 'var(--bg-2)' }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 12, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 8, width: '60%' }} />
        <div style={{ height: 16, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 16, width: '80%' }} />
        <div style={{ height: 20, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 40, background: 'var(--bg-2)', borderRadius: 100 }} />
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [whatsapp, setWhatsapp] = useState('6281234567890')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
    fetch('/api/settings').then(r => r.json()).then(s => { if (s?.whatsappNumber) setWhatsapp(s.whatsappNumber) }).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const url = activeCategory === 'all' ? '/api/products' : `/api/products?category=${activeCategory}`
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [activeCategory])

  return (
    <div style={{ minHeight: '70vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '48px 20px 32px' }}>
        <div className="container-main">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', marginBottom: 8 }}>Koleksi Lengkap</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400 }}>Semua Produk</h1>
        </div>
      </div>

      <div className="container-main" style={{ padding: '40px 20px' }}>
        {/* Filter kategori */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {[{ _id: 'all', name: 'Semua' }, ...categories].map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              style={{
                padding: '8px 20px',
                borderRadius: 100,
                fontWeight: 600,
                fontSize: '0.875rem',
                border: '1.5px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: activeCategory === cat._id ? 'var(--accent)' : 'var(--border)',
                background: activeCategory === cat._id ? 'var(--accent)' : 'var(--surface)',
                color: activeCategory === cat._id ? '#fff' : 'var(--text)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid produk */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center" style={{ padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p className="font-semibold">Gagal memuat produk. Coba refresh halaman.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p className="font-semibold">Belum ada produk di kategori ini.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {products.map(p => (
              <ProductCard key={p._id} product={p} whatsappNumber={whatsapp} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
