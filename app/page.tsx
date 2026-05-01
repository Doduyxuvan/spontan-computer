import WAButton from '@/components/user/WAButton'
import ProductCard from '@/components/user/ProductCard'
import Link from 'next/link'

async function getSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/settings`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

async function getFeaturedProducts() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/products?featured=true`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.slice(0, 6)
  } catch { return [] }
}

async function getTestimonials() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/testimonials`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return data.slice(0, 3)
  } catch { return [] }
}

const keunggulan = [
  { icon: '✅', title: 'Produk Berkualitas', desc: 'Setiap produk dipilih dan dikurasi dengan ketat untuk memastikan kualitas terbaik.' },
  { icon: '🚀', title: 'Pengiriman Cepat', desc: 'Proses cepat, produk langsung dikirim setelah konfirmasi pembayaran.' },
  { icon: '💰', title: 'Harga Terjangkau', desc: 'Dapatkan produk berkualitas tanpa harus menguras kantong.' },
  { icon: '🛡️', title: 'Bergaransi', desc: 'Semua produk kami dilengkapi garansi resmi untuk ketenangan pikiran Anda.' },
]

export default async function HomePage() {
  const [settings, products, testimonials] = await Promise.all([
    getSettings(),
    getFeaturedProducts(),
    getTestimonials(),
  ])
  const whatsapp = settings?.whatsappNumber || '6281234567890'

  return (
    <>
      {/* HERO */}
      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight: '88vh',
          background: settings?.heroImage
            ? `url(${settings.heroImage}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
        <div className="relative z-10 text-center px-6" style={{ maxWidth: 720 }}>
          <h1
            className="serif fade-up"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}
          >
            Produk Terbaik,<br /><em>Harga Terjangkau</em>
          </h1>
          <p
            className="fade-up-delay"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.6 }}
          >
            {settings?.description || 'Temukan produk pilihan berkualitas terbaik dengan harga yang tidak menguras kantong.'}
          </p>
          <div className="fade-up-delay-2">
            <WAButton phone={whatsapp} label="Pesan Sekarang" size="lg" />
          </div>
        </div>
      </section>

      {/* PRODUK UNGGULAN */}
      {products.length > 0 && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container-main">
            <div className="flex items-end justify-between" style={{ marginBottom: 40 }}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', marginBottom: 8 }}>Pilihan Terbaik</p>
                <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>Produk Unggulan</h2>
              </div>
              <Link href="/products" className="text-sm font-semibold" style={{ color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Lihat Semua →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {products.map((p: any) => (
                <ProductCard key={p._id} product={p} whatsappNumber={whatsapp} />
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 48 }}>
              <Link
                href="/products"
                style={{ display: 'inline-block', border: '2px solid var(--accent)', color: 'var(--accent)', padding: '12px 32px', borderRadius: 100, fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* KEUNGGULAN */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container-main">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', marginBottom: 8 }}>Mengapa Kami</p>
            <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>Kenapa Pilih Kami?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {keunggulan.map((item) => (
              <div key={item.title} className="text-center" style={{ background: 'var(--surface)', borderRadius: 20, padding: '36px 28px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                <h3 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: 10, color: 'var(--text)' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      {testimonials.length > 0 && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container-main">
            <div className="text-center" style={{ marginBottom: 48 }}>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', marginBottom: 8 }}>Review Pelanggan</p>
              <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 400 }}>Kata Mereka</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
              {testimonials.map((t: any) => (
                <div key={t._id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
                  <div style={{ color: '#FBBF24', fontSize: '1.1rem', marginBottom: 14 }}>
                    {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                  </div>
                  <p style={{ color: 'var(--text)', lineHeight: 1.65, marginBottom: 20, fontStyle: 'italic' }}>"{t.message}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)', overflow: 'hidden', flexShrink: 0 }}>
                      {t.image ? <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/testimonials" className="text-sm font-semibold" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Lihat Semua Testimoni →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA BOTTOM */}
      <section style={{ background: 'var(--accent)', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, color: '#fff', marginBottom: 16 }}>
            Siap untuk Pesan?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 36, fontSize: '1.05rem' }}>
            Hubungi kami sekarang via WhatsApp dan dapatkan produk terbaik.
          </p>
          <WAButton phone={whatsapp} label="Chat WhatsApp Sekarang" size="lg" />
        </div>
      </section>
    </>
  )
}
