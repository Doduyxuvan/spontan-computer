import WAButton from '@/components/user/WAButton'

async function getSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/settings`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export default async function TentangPage() {
  const settings = await getSettings()
  const whatsapp = settings?.whatsappNumber || '6281234567890'
  const waUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}`

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', padding: '60px 20px 48px' }}>
        <div className="container-main">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', marginBottom: 10 }}>Siapa Kami</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400 }}>Tentang Kami</h1>
        </div>
      </div>

      <div className="container-main" style={{ padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
          {/* Deskripsi */}
          <div>
            <h2 className="serif" style={{ fontSize: '1.6rem', fontWeight: 400, marginBottom: 20 }}>
              {settings?.siteTitle || 'Toko Kita'}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
              {settings?.description || 'Kami berkomitmen menyediakan produk berkualitas terbaik dengan harga yang terjangkau dan pelayanan yang memuaskan.'}
            </p>

            <div style={{ marginTop: 40 }}>
              <WAButton phone={whatsapp} label="Hubungi Kami Sekarang" size="lg" />
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h2 className="serif" style={{ fontSize: '1.6rem', fontWeight: 400, marginBottom: 28 }}>Kontak & Info</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* WhatsApp */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 20, background: 'var(--bg-2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>📱</div>
                <div>
                  <p className="font-semibold" style={{ marginBottom: 4 }}>WhatsApp</p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
                  >
                    +{whatsapp.replace(/\D/g, '')}
                  </a>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>Klik untuk chat langsung</p>
                </div>
              </div>

              {/* Alamat */}
              {settings?.address && (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 20, background: 'var(--bg-2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>📍</div>
                  <div>
                    <p className="font-semibold" style={{ marginBottom: 4 }}>Alamat</p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{settings.address}</p>
                  </div>
                </div>
              )}

              {/* Jam operasional */}
              {settings?.operationalHours && (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 20, background: 'var(--bg-2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>🕐</div>
                  <div>
                    <p className="font-semibold" style={{ marginBottom: 4 }}>Jam Operasional</p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{settings.operationalHours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
