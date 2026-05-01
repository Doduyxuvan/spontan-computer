import WAButton from '@/components/user/WAButton'
import Link from 'next/link'

async function getTestimonials() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/testimonials`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

async function getSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/settings`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([getTestimonials(), getSettings()])
  const whatsapp = settings?.whatsappNumber || '6281234567890'

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '60px 20px 48px' }}>
        <div className="container-main text-center">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', marginBottom: 10 }}>Review Nyata</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400, marginBottom: 14 }}>Testimoni Pelanggan</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Apa kata mereka tentang produk kami</p>
        </div>
      </div>

      {/* Grid testimoni */}
      <div className="container-main" style={{ padding: '48px 20px' }}>
        {testimonials.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <p className="font-semibold">Belum ada testimoni.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {testimonials.map((t: any) => (
              <div
                key={t._id}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}
              >
                {/* Bintang */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ fontSize: '1.2rem', color: i < (t.rating || 5) ? '#FBBF24' : '#E5E3DC' }}>★</span>
                  ))}
                </div>

                {/* Pesan */}
                <p style={{ color: 'var(--text)', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                  "{t.message}"
                </p>

                {/* Avatar + nama */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--accent-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'var(--accent)',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {t.image
                      ? <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : t.name?.charAt(0).toUpperCase()
                    }
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pelanggan Setia</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--accent-bg)', borderTop: '1px solid var(--border)', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: '1.8rem', fontWeight: 400, marginBottom: 12 }}>Tertarik? Pesan Sekarang</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Bergabunglah bersama pelanggan yang puas dengan produk kami.</p>
          <WAButton phone={whatsapp} label="Pesan via WhatsApp" size="lg" />
        </div>
      </div>
    </div>
  )
}
